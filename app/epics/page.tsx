'use client'

import { useState, useEffect, useRef } from 'react'
import EpicForm from '@/components/EpicForm'
import EpicList from '@/components/EpicList'
import EpicAIGeneratorModal from '@/components/EpicAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Epic, EpicFormData } from '@/types/epic'
import type { Besoin } from '@/types/besoin'

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
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [selectedBesoinForAI, setSelectedBesoinForAI] = useState<Besoin | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingEpic, setImprovingEpic] = useState<Epic | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedEpics = localStorage.getItem('epics')
    
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    if (savedEpics) {
      setEpics(JSON.parse(savedEpics))
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

  // Ouvrir la modale de génération IA pour un besoin
  const openAIGenerator = (besoin: Besoin) => {
    setSelectedBesoinForAI(besoin)
    setShowAIGenerator(true)
  }

  // Générer des epics à partir des suggestions IA
  const handleGenerateFromAI = (generatedEpics: { titre: string; description: string }[]) => {
    if (!selectedBesoinForAI) return

    const newEpics: Epic[] = generatedEpics.map((epicData) => ({
      id: generateId(),
      titre: epicData.titre,
      description: epicData.description,
      statut: 'À faire',
      besoinId: selectedBesoinForAI.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setEpics([...epics, ...newEpics])
    showNotification(`${newEpics.length} EPIC(s) générée(s) avec succès !`)
    setShowAIGenerator(false)
    setSelectedBesoinForAI(null)
    setShowForm(false)
  }

  // Ouvrir la modale d'amélioration IA
  const openImprovementModal = (epic: Epic) => {
    setImprovingEpic(epic)
    
    // Générer des suggestions d'amélioration
    const suggestions: Suggestion[] = []
    
    // Suggestion pour le titre (si vide ou trop court)
    if (!epic.titre || epic.titre.length < 10) {
      suggestions.push({
        field: 'titre',
        oldValue: epic.titre || '(vide)',
        newValue: `Gestion de ${epic.titre || 'cette fonctionnalité'}`,
        checked: true,
      })
    }
    
    // Suggestion pour la description (format IREB)
    if (!epic.description || !epic.description.includes('User Story:')) {
      const newDescription = `User Story: En tant qu'utilisateur, je veux ${epic.titre.toLowerCase()}, afin de répondre à mes besoins.
Critères d'acceptation:
1. Le système doit permettre de gérer ${epic.titre.toLowerCase()}.
2. Les données doivent être validées avant toute opération.
3. Une confirmation visuelle doit être affichée après chaque action.
4. Les erreurs doivent être gérées et affichées clairement.`
      
      suggestions.push({
        field: 'description',
        oldValue: epic.description || '(vide)',
        newValue: newDescription,
        checked: true,
      })
    }
    
    setImprovementSuggestions(suggestions)
    setShowImprovementModal(true)
  }

  // Appliquer les suggestions d'amélioration sélectionnées
  const handleApplyImprovements = (selectedSuggestions: Suggestion[]) => {
    if (!improvingEpic) return
    
    // Appliquer les modifications à l'EPIC
    setEpics(
      epics.map((e) => {
        if (e.id !== improvingEpic.id) return e
        
        const updatedEpic = { ...e }
        selectedSuggestions.forEach((suggestion) => {
          if (suggestion.field === 'titre') {
            updatedEpic.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            updatedEpic.description = suggestion.newValue
          }
        })
        updatedEpic.updated_at = new Date().toISOString()
        return updatedEpic
      })
    )
    
    showNotification('Améliorations IA appliquées avec succès !')
    setShowImprovementModal(false)
    setImprovingEpic(null)
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
          onGenerateAI={openAIGenerator}
          onImproveAI={openImprovementModal}
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

      {/* Modale de génération IA */}
      {showAIGenerator && (
        <EpicAIGeneratorModal
          besoin={selectedBesoinForAI}
          onClose={() => {
            setShowAIGenerator(false)
            setSelectedBesoinForAI(null)
          }}
          onGenerate={handleGenerateFromAI}
        />
      )}

      {/* Modale d'amélioration IA */}
      {showImprovementModal && improvingEpic && (
        <AIImprovementModal
          title={improvingEpic.titre}
          suggestions={improvementSuggestions}
          onClose={() => {
            setShowImprovementModal(false)
            setImprovingEpic(null)
          }}
          onApply={handleApplyImprovements}
        />
      )}
    </div>
  )
}
