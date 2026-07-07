'use client'

import { useState, useEffect, useRef } from 'react'
import BesoinForm from '@/components/BesoinForm'
import BesoinList from '@/components/BesoinList'
import BesoinAIGeneratorModal from '@/components/BesoinAIGeneratorModal'
import type { Besoin, BesoinFormData } from '@/types/besoin'

export default function Home() {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBesoin, setEditingBesoin] = useState<Besoin | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les besoins depuis localStorage
  const loadBesoins = () => {
    const savedBesoins = localStorage.getItem('besoins')
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadBesoins()
    // Écouter les changements de localStorage (y compris les événements personnalisés)
    const handleStorageChange = () => loadBesoins()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('besoins', JSON.stringify(besoins))
    }
  }, [besoins, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Ouvrir la modale de génération IA
  const openAIGenerator = () => {
    setShowAIGenerator(true)
  }

  // Générer des besoins à partir des suggestions IA
  const handleGenerateFromAI = (generatedBesoins: { titre: string; description: string }[]) => {
    const newBesoins: Besoin[] = generatedBesoins.map((besoinData) => ({
      id: generateId(),
      titre: besoinData.titre,
      description: besoinData.description,
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setBesoins([...besoins, ...newBesoins])
    showNotification(`${newBesoins.length} besoin(s) généré(s) avec succès !`)
    setShowAIGenerator(false)
    setShowForm(false)
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
        // Scroll vers la liste après création
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

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Besoins</h1>

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

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setEditingBesoin(null)
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? 'Annuler' : 'Ajouter un besoin'}
        </button>
        <button
          onClick={openAIGenerator}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Générer avec IA
        </button>
      </div>

      {showForm && (
        <BesoinForm
          besoin={editingBesoin}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingBesoin(null)
          }}
        />
      )}

      {/* Liste des besoins avec référence pour le scroll */}
      <div ref={listRef}>
        <BesoinList
          besoins={besoins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modale de génération IA */}
      {showAIGenerator && (
        <BesoinAIGeneratorModal
          onClose={() => setShowAIGenerator(false)}
          onGenerate={handleGenerateFromAI}
        />
      )}
    </div>
  )
}
