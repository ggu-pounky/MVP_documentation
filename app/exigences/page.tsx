'use client'

import { useState, useEffect, useRef } from 'react'
import ExigenceForm from '@/components/ExigenceForm'
import ExigenceList from '@/components/ExigenceList'
import ExigenceAIGeneratorModal from '@/components/ExigenceAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import type { Besoin } from '@/types/besoin'
import type { Feature } from '@/types/feature'
import type { Epic } from '@/types/epic'

type FeatureInfo = {
  id: string
  besoinTitre: string
  titre: string
  description?: string
}

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

export default function ExigencesPage() {
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExigence, setEditingExigence] = useState<Exigence | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [selectedFeatureForAI, setSelectedFeatureForAI] = useState<FeatureInfo | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingExigence, setImprovingExigence] = useState<Exigence | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedFeatures = localStorage.getItem('features')
    const savedEpics = localStorage.getItem('epics')
    const savedExigences = localStorage.getItem('exigences')
    
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
    }
    if (savedEpics) {
      setEpics(JSON.parse(savedEpics))
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

  // Sauvegarder les exigences dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('exigences', JSON.stringify(exigences))
    }
  }, [exigences, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Ouvrir la modale de génération IA pour une feature
  const openAIGenerator = (feature: FeatureInfo) => {
    setSelectedFeatureForAI(feature)
    setShowAIGenerator(true)
  }

  // Générer des exigences à partir des suggestions IA
  const handleGenerateFromAI = (generatedExigences: { titre: string; description: string }[]) => {
    if (!selectedFeatureForAI) return

    const newExigences: Exigence[] = generatedExigences.map((exigenceData) => ({
      id: generateId(),
      titre: exigenceData.titre,
      description: exigenceData.description,
      statut: 'À faire',
      featureId: selectedFeatureForAI.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setExigences([...exigences, ...newExigences])
    showNotification(`${newExigences.length} exigence(s) générée(s) avec succès !`)
    setShowAIGenerator(false)
    setSelectedFeatureForAI(null)
    setShowForm(false)
  }

  // Ouvrir la modale d'amélioration IA
  const openImprovementModal = (exigence: Exigence) => {
    setImprovingExigence(exigence)
    
    // Trouver la feature associée pour plus de contexte
    const feature = features.find((f) => f.id === exigence.featureId)
    const featureTitre = feature ? feature.titre : 'cette fonctionnalité'
    
    // Générer des suggestions d'amélioration
    const suggestions: Suggestion[] = []
    
    // Suggestion pour le titre (si vide ou trop court)
    if (!exigence.titre || exigence.titre.length < 10) {
      suggestions.push({
        field: 'titre',
        oldValue: exigence.titre || '(vide)',
        newValue: `Gestion de ${exigence.titre || 'cette exigence'}`,
        checked: true,
      })
    }
    
    // Suggestion pour la description (format IREB)
    if (!exigence.description || !exigence.description.includes('User Story:')) {
      const newDescription = `User Story: En tant qu'utilisateur, je veux ${exigence.titre.toLowerCase()} pour ${featureTitre.toLowerCase()}, afin de répondre à mes besoins.
Critères d'acceptation:
1. Le système doit permettre de ${exigence.titre.toLowerCase()}.
2. Les données doivent être validées avant toute opération.
3. Une confirmation visuelle doit être affichée après chaque action.
4. Les erreurs doivent être gérées et affichées clairement.
5. La fonctionnalité doit être accessible depuis l'interface principale.`
      
      suggestions.push({
        field: 'description',
        oldValue: exigence.description || '(vide)',
        newValue: newDescription,
        checked: true,
      })
    }
    
    setImprovementSuggestions(suggestions)
    setShowImprovementModal(true)
  }

  // Appliquer les suggestions d'amélioration sélectionnées
  const handleApplyImprovements = (selectedSuggestions: Suggestion[]) => {
    if (!improvingExigence) return
    
    // Appliquer les modifications à l'Exigence
    setExigences(
      exigences.map((e) => {
        if (e.id !== improvingExigence.id) return e
        
        const updatedExigence = { ...e }
        selectedSuggestions.forEach((suggestion) => {
          if (suggestion.field === 'titre') {
            updatedExigence.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            updatedExigence.description = suggestion.newValue
          }
        })
        updatedExigence.updated_at = new Date().toISOString()
        return updatedExigence
      })
    )
    
    showNotification('Améliorations IA appliquées avec succès !')
    setShowImprovementModal(false)
    setImprovingExigence(null)
  }

  // Préparer la liste des features avec leurs informations complètes
  const featuresWithInfo = features.map((feature) => {
    const besoin = besoins.find((b) => b.id === feature.besoinId)
    return {
      id: feature.id,
      titre: feature.titre,
      besoinTitre: besoin ? besoin.titre : 'Inconnu',
      description: feature.description || undefined,
    }
  })

  const handleSubmit = async (data: ExigenceFormData) => {
    try {
      if (editingExigence) {
        // Mettre à jour une exigence existante
        setExigences(
          exigences.map((e) =>
            e.id === editingExigence.id
              ? {
                  ...e,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  featureId: data.featureId,
                  updated_at: new Date().toISOString(),
                }
              : e
          )
        )
        showNotification('Exigence modifiée avec succès !')
      } else {
        // Créer une nouvelle exigence
        const newExigence: Exigence = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          featureId: data.featureId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setExigences([...exigences, newExigence])
        showNotification('Exigence créée avec succès !')
        // Scroll vers la liste après création
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingExigence(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setExigences(exigences.filter((e) => e.id !== id))
      showNotification('Exigence supprimée avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (exigence: Exigence) => {
    setEditingExigence(exigence)
    setShowForm(true)
  }

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Exigences</h1>

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

      {/* Bouton pour ajouter une exigence (désactivé si aucune feature) */}
      <button
        onClick={() => {
          if (features.length === 0) {
            showNotification('Veuillez d\'abord créer une Feature', 'error')
            return
          }
          setEditingExigence(null)
          setShowForm(!showForm)
        }}
        disabled={features.length === 0}
        className={`mb-4 px-4 py-2 rounded ${
          features.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showForm ? 'Annuler' : 'Ajouter une Exigence'}
      </button>

      {showForm && (
        <ExigenceForm
          exigence={editingExigence}
          features={featuresWithInfo}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingExigence(null)
          }}
          onGenerateAI={openAIGenerator}
          onImproveAI={openImprovementModal}
        />
      )}

      {/* Liste des exigences avec référence pour le scroll */}
      <div ref={listRef}>
        <ExigenceList
          exigences={exigences}
          features={featuresWithInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modale de génération IA */}
      {showAIGenerator && (
        <ExigenceAIGeneratorModal
          feature={selectedFeatureForAI}
          onClose={() => {
            setShowAIGenerator(false)
            setSelectedFeatureForAI(null)
          }}
          onGenerate={handleGenerateFromAI}
        />
      )}

      {/* Modale d'amélioration IA */}
      {showImprovementModal && improvingExigence && (
        <AIImprovementModal
          title={improvingExigence.titre}
          suggestions={improvementSuggestions}
          onClose={() => {
            setShowImprovementModal(false)
            setImprovingExigence(null)
          }}
          onApply={handleApplyImprovements}
        />
      )}
    </div>
  )
}
