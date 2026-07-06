'use client'

import { useState, useEffect, useRef } from 'react'
import EpicForm from '@/components/EpicForm'
import EpicList from '@/components/EpicList'
import type { Epic, EpicFormData } from '@/types/epic'
import type { Besoin } from '@/types/besoin'

export default function EpicsPage() {
  const [epics, setEpics] = useState<Epic[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedEpics = localStorage.getItem('epics')
    
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    if (savedEpics) {
      setEpics(JSON.parse(savedEpics))
    }
    setLoading(false)
  }, [])

  // Sauvegarder les epics dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('epics', JSON.stringify(epics))
    }
  }, [epics, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: EpicFormData) => {
    try {
      if (editingEpic) {
        // Mettre à jour une epic existante
        setEpics(
          epics.map((e) =>
            e.id === editingEpic.id
              ? {
                  ...e,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  besoinId: data.besoinId,
                  updated_at: new Date().toISOString(),
                }
              : e
          )
        )
        showNotification('EPIC modifiée avec succès !')
      } else {
        // Créer une nouvelle epic
        const newEpic: Epic = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          besoinId: data.besoinId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setEpics([...epics, newEpic])
        showNotification('EPIC créée avec succès !')
        // Scroll vers la liste après création
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingEpic(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setEpics(epics.filter((e) => e.id !== id))
      showNotification('EPIC supprimée avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (epic: Epic) => {
    setEditingEpic(epic)
    setShowForm(true)
  }

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des EPICS</h1>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-4 rounded ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Bouton pour ajouter une epic (désactivé si aucun besoin) */}
      <button
        onClick={() => {
          if (besoins.length === 0) {
            showNotification('Veuillez d\'abord créer un besoin', 'error')
            return
          }
          setEditingEpic(null)
          setShowForm(!showForm)
        }}
        disabled={besoins.length === 0}
        className={`mb-4 px-4 py-2 rounded ${
          besoins.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showForm ? 'Annuler' : 'Ajouter une EPIC'}
      </button>

      {showForm && (
        <EpicForm
          epic={editingEpic}
          besoins={besoins}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingEpic(null)
          }}
        />
      )}

      {/* Liste des epics avec référence pour le scroll */}
      <div ref={listRef}>
        <EpicList
          epics={epics}
          besoins={besoins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
