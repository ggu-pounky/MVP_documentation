'use client'

import { useState, useEffect, useRef } from 'react'
import FeatureForm from '@/components/FeatureForm'
import FeatureList from '@/components/FeatureList'
import FeatureAIGeneratorModal from '@/components/FeatureAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Feature, FeatureFormData } from '@/types/feature'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [selectedBesoinForAI, setSelectedBesoinForAI] = useState<Besoin | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingFeature, setImprovingFeature] = useState<Feature | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedFeatures = localStorage.getItem('features')
    const savedEpics = localStorage.getItem('epics')
    
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
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

  // Sauvegarder les features dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('features', JSON.stringify(features))
    }
  }, [features, loading])

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

  // Générer des features à partir des suggestions IA
  const handleGenerateFromAI = (generatedFeatures: { titre: string; description: string }[]) => {
    if (!selectedBesoinForAI) return

    const newFeatures: Feature[] = generatedFeatures.map((featureData) => ({
      id: generateId(),
      titre: featureData.titre,
      description: featureData.description,
      priorite: 'Moyenne',
      statut: 'À faire',
      besoinId: selectedBesoinForAI.id,
      epicId: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setFeatures([...features, ...newFeatures])
    showNotification(`${newFeatures.length} Feature(s) générée(s) avec succès !`)
    setShowAIGenerator(false)
    setSelectedBesoinForAI(null)
    setShowForm(false)
  }

  // Ouvrir la modale d'amélioration IA
  const openImprovementModal = (feature: Feature) => {
    setImprovingFeature(feature)
    
    // Générer des suggestions d'amélioration
    const suggestions: Suggestion[] = []
    
    // Suggestion pour le titre (si vide ou trop court)
    if (!feature.titre || feature.titre.length < 10) {
      suggestions.push({
        field: 'titre',
        oldValue: feature.titre || '(vide)',
        newValue: `Gestion de ${feature.titre || 'cette fonctionnalité'}`,
        checked: true,
      })
    }
    
    // Suggestion pour la description (format IREB)
    if (!feature.description || !feature.description.includes('User Story:')) {
      const newDescription = `User Story: En tant qu'utilisateur, je veux ${feature.titre.toLowerCase()}, afin de répondre à mes besoins.
Critères d'acceptation:
1. Le système doit permettre de gérer ${feature.titre.toLowerCase()}.
2. Les données doivent être validées avant toute opération.
3. Une confirmation visuelle doit être affichée après chaque action.
4. Les erreurs doivent être gérées et affichées clairement.`
      
      suggestions.push({
        field: 'description',
        oldValue: feature.description || '(vide)',
        newValue: newDescription,
        checked: true,
      })
    }
    
    setImprovementSuggestions(suggestions)
    setShowImprovementModal(true)
  }

  // Appliquer les suggestions d'amélioration sélectionnées
  const handleApplyImprovements = (selectedSuggestions: Suggestion[]) => {
    if (!improvingFeature) return
    
    // Appliquer les modifications à la Feature
    setFeatures(
      features.map((f) => {
        if (f.id !== improvingFeature.id) return f
        
        const updatedFeature = { ...f }
        selectedSuggestions.forEach((suggestion) => {
          if (suggestion.field === 'titre') {
            updatedFeature.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            updatedFeature.description = suggestion.newValue
          }
        })
        updatedFeature.updated_at = new Date().toISOString()
        return updatedFeature
      })
    )
    
    showNotification('Améliorations IA appliquées avec succès !')
    setShowImprovementModal(false)
    setImprovingFeature(null)
  }

  const handleSubmit = async (data: FeatureFormData) => {
    try {
      if (editingFeature) {
        // Mettre à jour une feature existante
        setFeatures(
          features.map((f) =>
            f.id === editingFeature.id
              ? {
                  ...f,
                  titre: data.titre,
                  description: data.description,
                  priorite: data.priorite,
                  statut: data.statut,
                  besoinId: data.besoinId,
                  epicId: data.epicId || null,
                  updated_at: new Date().toISOString(),
                }
              : f
          )
        )
        showNotification('Feature modifiée avec succès !')
      } else {
        // Créer une nouvelle feature
        const newFeature: Feature = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          priorite: data.priorite,
          statut: data.statut,
          besoinId: data.besoinId,
          epicId: data.epicId || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setFeatures([...features, newFeature])
        showNotification('Feature créée avec succès !')
        // Scroll vers la liste après création
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingFeature(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setFeatures(features.filter((f) => f.id !== id))
      showNotification('Feature supprimée avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature)
    setShowForm(true)
  }

  if (loading) return <div className="p-4">Chargement...</div>

  // Filtrer les EPICS par besoin pour le sélecteur
  const epicsByBesoin = (besoinId: string) => {
    return epics.filter((e) => e.besoinId === besoinId)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Features</h1>

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

      {/* Bouton pour ajouter une feature (désactivé si aucun besoin) */}
      <button
        onClick={() => {
          if (besoins.length === 0) {
            showNotification('Veuillez d\'abord créer un besoin', 'error')
            return
          }
          setEditingFeature(null)
          setShowForm(!showForm)
        }}
        disabled={besoins.length === 0}
        className={`mb-4 px-4 py-2 rounded ${
          besoins.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showForm ? 'Annuler' : 'Ajouter une Feature'}
      </button>

      {showForm && (
        <FeatureForm
          feature={editingFeature}
          besoins={besoins}
          epics={epics}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingFeature(null)
          }}
          onGenerateAI={openAIGenerator}
          onImproveAI={openImprovementModal}
        />
      )}

      {/* Liste des features avec référence pour le scroll */}
      <div ref={listRef}>
        <FeatureList
          features={features}
          besoins={besoins}
          epics={epics}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modale de génération IA */}
      {showAIGenerator && (
        <FeatureAIGeneratorModal
          besoin={selectedBesoinForAI}
          onClose={() => {
            setShowAIGenerator(false)
            setSelectedBesoinForAI(null)
          }}
          onGenerate={handleGenerateFromAI}
        />
      )}

      {/* Modale d'amélioration IA */}
      {showImprovementModal && improvingFeature && (
        <AIImprovementModal
          title={improvingFeature.titre}
          suggestions={improvementSuggestions}
          onClose={() => {
            setShowImprovementModal(false)
            setImprovingFeature(null)
          }}
          onApply={handleApplyImprovements}
        />
      )}
    </div>
  )
}
