'use client'

import { useState, useEffect, useRef } from 'react'
import TestForm from '@/components/TestForm'
import TestList from '@/components/TestList'
import type { Test, TestFormData } from '@/types/test'
import type { Exigence } from '@/types/exigence'

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedTests = localStorage.getItem('tests')
    const savedExigences = localStorage.getItem('exigences')
    
    if (savedTests) {
      setTests(JSON.parse(savedTests))
    }
    if (savedExigences) {
      setExigences(JSON.parse(savedExigences))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    // Écouter les changements de localStorage
    const handleStorageChange = () => loadData()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Sauvegarder les tests dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tests', JSON.stringify(tests))
    }
  }, [tests, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: TestFormData) => {
    try {
      if (editingTest) {
        // Mettre à jour un test existant
        setTests(
          tests.map((t) =>
            t.id === editingTest.id
              ? {
                  ...t,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  type: data.type,
                  exigenceId: data.exigenceId,
                  updated_at: new Date().toISOString(),
                }
              : t
          )
        )
        showNotification('Test modifié avec succès !')
      } else {
        // Créer un nouveau test
        const newTest: Test = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          type: data.type,
          exigenceId: data.exigenceId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setTests([...tests, newTest])
        showNotification('Test créé avec succès !')
        // Scroll vers la liste après création
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingTest(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setTests(tests.filter((t) => t.id !== id))
      showNotification('Test supprimé avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (test: Test) => {
    setEditingTest(test)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="neumorphic-card px-6 py-4">
          <div className="flex items-center gap-2 text-neumorphic">
            <span className="animate-spin">⏳</span>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">Gestion des Tests</h1>
        <p className="text-neumorphic-muted">Créez, modifiez et gérez vos tests projet</p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`neumorphic-card p-4 notification-slide-in ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Bouton pour ajouter un test */}
      <button
        onClick={() => {
          if (exigences.length === 0) {
            showNotification('Veuillez d\'abord créer une exigence', 'error')
            return
          }
          setEditingTest(null)
          setShowForm(!showForm)
        }}
        disabled={exigences.length === 0}
        className={`neumorphic-button px-6 py-3 flex items-center gap-2 ${exigences.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{showForm ? '❌' : '➕'}</span>
        <span>{showForm ? 'Annuler' : 'Ajouter un Test'}</span>
      </button>

      {showForm && (
        <div className="neumorphic-card p-6">
          <TestForm
            test={editingTest}
            exigences={exigences}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingTest(null)
            }}
          />
        </div>
      )}

      {/* Liste des tests */}
      <div ref={listRef} className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">Liste des Tests</h2>
        <TestList
          tests={tests}
          exigences={exigences}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
