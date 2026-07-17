'use client'

import { useState, useEffect, useRef } from 'react'
import DataTable from '@/components/DataTable'
import BesoinForm from '@/components/BesoinForm'
import type { Besoin, BesoinFormData } from '@/types/besoin'
import { getStatutDisplay } from '@/utils/statutDisplay'

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

  const handleAdd = () => {
    setEditingBesoin(null)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="card">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="animate-spin">🌀</span>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  // Définir les colonnes du tableau
  const columns = [
    {
      key: 'titre',
      header: 'Titre',
      sortable: true,
      render: (besoin: Besoin) => (
        <div className="font-medium text-gray-800">{besoin.titre}</div>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (besoin: Besoin) => (
        <span className={`status-badge in-table ${
          besoin.statut === 'Termine' ? 'ready' :
          besoin.statut === 'En cours' ? 'processing' :
          besoin.statut === 'Annule' ? 'error' :
          'canceled'
        }`}>
          {getStatutDisplay(besoin.statut)}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      render: (besoin: Besoin) => (
        <div className="text-gray-600 text-sm">
          {besoin.description || '-'}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Créé le',
      sortable: true,
      render: (besoin: Besoin) => (
        <div className="text-muted text-sm">
          {new Date(besoin.created_at).toLocaleDateString('fr-FR')}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="form-container">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
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

      {/* Tableau des besoins */}
      <div ref={listRef}>
        <DataTable
          data={besoins}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          title="Besoins"
          emptyMessage="Aucun besoin enregistré. Cliquez sur 'Ajouter' pour commencer."
        />
      </div>
    </div>
  )
}
