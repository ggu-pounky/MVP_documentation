'use client'

import { useState, useEffect, useRef } from 'react'
import BesoinForm from '@/components/BesoinForm'
import BesoinList from '@/components/BesoinList'
import type { Besoin, BesoinFormData } from '@/types/besoin'

export default function Home() {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBesoin, setEditingBesoin] = useState<Besoin | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const loadBesoins = () => {
    const savedBesoins = localStorage.getItem('besoins')
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadBesoins()
    const handleStorageChange = () => loadBesoins()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('besoins', JSON.stringify(besoins))
    }
  }, [besoins, loading])

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: BesoinFormData) => {
    try {
      if (editingBesoin) {
        setBesoins(
          besoins.map((b) =>
            b.id === editingBesoin.id
              ? {
                  ...b,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  updated_at: new Date().toISOString(),
                }
              : b
          )
        )
        showNotification('Besoin modifié avec succès !')
      } else {
        const newBesoin: Besoin = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setBesoins([...besoins, newBesoin])
        showNotification('Besoin créé avec succès !')
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingBesoin(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setBesoins(besoins.filter((b) => b.id !== id))
      showNotification('Besoin supprimé avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (besoin: Besoin) => {
    setEditingBesoin(besoin)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="neumorphic-card px-6 py-4">
          <div className="flex items-center gap-2 text-neumorphic">
            <span className="animate-spin">🌀</span>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">✨ Gestion des Besoins</h1>
        <p className="text-neumorphic-muted">Créez, modifiez et gérez vos besoins projet</p>
      </div>

      {notification && (
        <div
          className={`neumorphic-card p-4 notification-slide-in ${
            notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}
        >
          {notification.message}
        </div>
      )}

      <button
        onClick={() => {
          setEditingBesoin(null)
          setShowForm(!showForm)
        }}
        className="neumorphic-button px-6 py-3 flex items-center gap-2"
      >
        <span>{showForm ? '❌' : '➕'}</span>
        <span>{showForm ? 'Annuler' : 'Ajouter un besoin'}</span>
      </button>

      {showForm && (
        <div className="neumorphic-card p-6">
          <h2 className="text-lg font-semibold text-neumorphic mb-4">
            {editingBesoin ? 'Modifier le besoin' : 'Créer un nouveau besoin'}
          </h2>
          <BesoinForm
            besoin={editingBesoin}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingBesoin(null)
            }}
          />
        </div>
      )}

      <div ref={listRef} className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">
          Liste des besoins ({besoins.length})
        </h2>
        <BesoinList
          besoins={besoins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
