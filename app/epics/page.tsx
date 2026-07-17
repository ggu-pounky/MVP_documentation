'use client'

import { useState, useEffect, useRef } from 'react'
import DataTable from '@/components/DataTable'
import EpicForm from '@/components/EpicForm'
import EpicAIGeneratorModal from '@/components/EpicAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Epic, EpicFormData } from '@/types/epic'
import type { Besoin } from '@/types/besoin'
import { getStatutDisplay } from '@/utils/statutDisplay'

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

export default function EpicsPage() {
  const [epics, setEpics] = useState<Epic[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedBesoinForAI, setSelectedBesoinForAI] = useState<Besoin | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingEpic, setImprovingEpic] = useState<Epic | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const loadData = () => {
    const savedEpics = localStorage.getItem('epics')
    const savedBesoins = localStorage.getItem('besoins')
    if (savedEpics) setEpics(JSON.parse(savedEpics))
    if (savedBesoins) setBesoins(JSON.parse(savedBesoins))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('epics', JSON.stringify(epics))
    }
  }, [epics, loading])

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: EpicFormData) => {
    try {
      if (editingEpic) {
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

  const handleGenerateAI = (besoin: Besoin) => {
    setSelectedBesoinForAI(besoin)
  }

  const handleImproveAI = (epic: Epic) => {
    setImprovingEpic(epic)
    setShowImprovementModal(true)
  }

  const handleAIGeneratedEpics = (generatedEpics: Epic[]) => {
    setEpics([...epics, ...generatedEpics])
    showNotification(`${generatedEpics.length} EPICs générées par IA !`)
    setSelectedBesoinForAI(null)
  }

  const handleImprovementSuggestions = (suggestions: Suggestion[]) => {
    setImprovementSuggestions(suggestions)
  }

  const handleApplyImprovements = () => {
    if (improvingEpic) {
      const improvedEpic = { ...improvingEpic }
      improvementSuggestions.forEach((suggestion) => {
        if (suggestion.checked) {
          if (suggestion.field === 'titre') {
            improvedEpic.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            improvedEpic.description = suggestion.newValue
          }
        }
      })
      setEpics(
        epics.map((e) => (e.id === improvingEpic.id ? improvedEpic : e))
      )
      showNotification('Améliorations appliquées avec succès !')
      setShowImprovementModal(false)
      setImprovingEpic(null)
      setImprovementSuggestions([])
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="card">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="animate-spin">🌐</span>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  // Définir les colonnes du tableau (sans la colonne "Besoin")
  const columns = [
    {
      key: 'titre',
      header: 'Titre',
      sortable: true,
      render: (epic: Epic) => (
        <div className="font-medium text-gray-800">{epic.titre}</div>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (epic: Epic) => (
        <span className={`status-badge in-table ${
          epic.statut === 'Termine' ? 'ready' :
          epic.statut === 'En cours' ? 'processing' :
          epic.statut === 'Annule' ? 'error' :
          'canceled'
        }`}>
          {getStatutDisplay(epic.statut)}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      render: (epic: Epic) => (
        <div className="text-gray-600 text-sm">
          {epic.description || '-'}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Créé le',
      sortable: true,
      render: (epic: Epic) => (
        <div className="text-muted text-sm">
          {new Date(epic.created_at).toLocaleDateString('fr-FR')}
        </div>
      ),
    },
  ]

  // Filtrer les EPICS par besoin
  const getEpicsByBesoin = (besoinId: string) => {
    return epics.filter((epic) => epic.besoinId === besoinId)
  }

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
            {editingEpic ? 'Modifier l\'EPIC' : 'Créer une nouvelle EPIC'}
          </h2>
          <EpicForm
            epic={editingEpic}
            besoins={besoins}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingEpic(null)
            }}
            onGenerateAI={handleGenerateAI}
            onImproveAI={handleImproveAI}
          />
        </div>
      )}

      {/* Tableaux des EPICS groupés par besoin */}
      {besoins.length === 0 ? (
        <div className="card">
          <div className="text-center py-8">
            <p className="text-muted mb-4">
              ⚠️ Vous devez d'abord créer un besoin avant de pouvoir ajouter des EPICS.
            </p>
            <a href="/" className="btn btn-primary">
              Aller aux Besoins
            </a>
          </div>
        </div>
      ) : (
        <div ref={listRef} className="space-y-6">
          {besoins.map((besoin) => {
            const besoinEpics = getEpicsByBesoin(besoin.id)
            
            // Ne pas afficher les besoins sans EPICS
            if (besoinEpics.length === 0) return null
            
            return (
              <div key={besoin.id} className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                  {besoin.titre}
                </h2>
                <DataTable
                  data={besoinEpics}
                  columns={columns}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={() => {
                    setEditingEpic(null)
                    setShowForm(true)
                  }}
                  title="EPICS"
                  emptyMessage="Aucune EPIC enregistrée pour ce besoin. Cliquez sur 'Ajouter' pour commencer."
                />
              </div>
            )
          })}
          
          {/* Afficher un message si aucun besoin n'a d'EPICS */}
          {besoins.every((besoin) => getEpicsByBesoin(besoin.id).length === 0) && (
            <div className="card">
              <div className="text-center py-8">
                <p className="text-muted">
                  Aucune EPIC enregistrée. Cliquez sur "Ajouter" pour commencer.
                </p>
                <button onClick={() => {
                  setEditingEpic(null)
                  setShowForm(true)
                }} className="btn btn-primary mt-4">
                  Ajouter une EPIC
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <EpicAIGeneratorModal
        besoin={selectedBesoinForAI}
        onClose={() => setSelectedBesoinForAI(null)}
        onGenerate={handleAIGeneratedEpics}
      />

      <AIImprovementModal
        isOpen={showImprovementModal}
        onClose={() => {
          setShowImprovementModal(false)
          setImprovingEpic(null)
          setImprovementSuggestions([])
        }}
        item={improvingEpic}
        itemType="EPIC"
        onGetSuggestions={handleImprovementSuggestions}
        onApply={handleApplyImprovements}
        suggestions={improvementSuggestions}
      />
    </div>
  )
}
