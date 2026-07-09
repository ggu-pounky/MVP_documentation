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

  // Filtrer les EPICS par besoin pour le sélecteur
  const epicsByBesoin = (besoinId: string) => {
    return epics.filter((e) => e.besoinId === besoinId)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">Gestion des Features</h1>
        <p className="text-neumorphic-muted">Créez, modifiez et gérez vos features projet</p>
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

      {/* Bouton pour ajouter une feature */}
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
        className={`neumorphic-button px-6 py-3 flex items-center gap-2 ${besoins.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{showForm ? '❌' : '➕'}</span>
        <span>{showForm ? 'Annuler' : 'Ajouter une Feature'}</span>
      </button>

      {showForm && (
        <div className="neumorphic-card p-6">
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
        </div>
      )}

      {/* Liste des features */}
      <div ref={listRef} className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">Liste des Features</h2>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neumorphic-card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <FeatureAIGeneratorModal
              besoin={selectedBesoinForAI}
              onClose={() => {
                setShowAIGenerator(false)
                setSelectedBesoinForAI(null)
              }}
              onGenerate={handleGenerateFromAI}
            />
          </div>
        </div>
      )}

      {/* Modale d'amélioration IA */}
      {showImprovementModal && improvingFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neumorphic-card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <AIImprovementModal
              title={improvingFeature.titre}
              suggestions={improvementSuggestions}
              onClose={() => {
                setShowImprovementModal(false)
                setImprovingFeature(null)
              }}
              onApply={handleApplyImprovements}
            />
          </div>
        </div>
      )}
    </div>
  )
}
