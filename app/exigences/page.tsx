'use client'

import { useState, useEffect, useRef } from 'react'
import DataTable from '@/components/DataTable'
import ExigenceForm from '@/components/ExigenceForm'
import ExigenceAIGeneratorModal from '@/components/ExigenceAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import { getStatutDisplay, getTypeDisplay } from '@/utils/statutDisplay'

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

export default function ExigencesPage() {
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExigence, setEditingExigence] = useState<Exigence | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedFeatureForAI, setSelectedFeatureForAI] = useState<Feature | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingExigence, setImprovingExigence] = useState<Exigence | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const loadData = () => {
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
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
      localStorage.setItem('exigences', JSON.stringify(exigences))
    }
  }, [exigences, loading])

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: ExigenceFormData) => {
    try {
      if (editingExigence) {
        setExigences(
          exigences.map((e) =>
            e.id === editingExigence.id
              ? {
                  ...e,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  featureId: data.featureId,
                  type: data.type,
                  updated_at: new Date().toISOString(),
                }
              : e
          )
        )
        showNotification('Exigence modifiée avec succès !')
      } else {
        const newExigence: Exigence = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          featureId: data.featureId,
          type: data.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setExigences([...exigences, newExigence])
        showNotification('Exigence créée avec succès !')
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

  const handleGenerateAI = (feature: Feature) => {
    setSelectedFeatureForAI(feature)
  }

  const handleImproveAI = (exigence: Exigence) => {
    setImprovingExigence(exigence)
    setShowImprovementModal(true)
  }

  const handleAIGeneratedExigences = (generatedExigences: Exigence[]) => {
    setExigences([...exigences, ...generatedExigences])
    showNotification(`${generatedExigences.length} Exigences générées par IA !`)
    setSelectedFeatureForAI(null)
  }

  const handleImprovementSuggestions = (suggestions: Suggestion[]) => {
    setImprovementSuggestions(suggestions)
  }

  const handleApplyImprovements = () => {
    if (improvingExigence) {
      const improvedExigence = { ...improvingExigence }
      improvementSuggestions.forEach((suggestion) => {
        if (suggestion.checked) {
          if (suggestion.field === 'titre') {
            improvedExigence.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            improvedExigence.description = suggestion.newValue
          }
        }
      })
      setExigences(
        exigences.map((e) => (e.id === improvingExigence.id ? improvedExigence : e))
      )
      showNotification('Améliorations appliquées avec succès !')
      setShowImprovementModal(false)
      setImprovingExigence(null)
      setImprovementSuggestions([])
    }
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
      render: (exigence: Exigence) => (
        <div className="font-medium text-gray-800">{exigence.titre}</div>
      ),
    },
    {
      key: 'feature',
      header: 'Feature',
      sortable: true,
      render: (exigence: Exigence) => {
        const feature = features.find((f) => f.id === exigence.featureId)
        return (
          <div className="text-gray-600 text-sm">
            {feature?.titre || 'Inconnu'}
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (exigence: Exigence) => (
        <span className="env-badge">
          {getTypeDisplay(exigence.type)}
        </span>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (exigence: Exigence) => (
        <span className={`status-badge in-table ${
          exigence.statut === 'Termine' || exigence.statut === 'Valide' ? 'ready' :
          exigence.statut === 'En cours' ? 'processing' :
          exigence.statut === 'Annule' ? 'error' :
          'canceled'
        }`}>
          {getStatutDisplay(exigence.statut)}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      render: (exigence: Exigence) => (
        <div className="text-gray-600 text-sm">
          {exigence.description || '-'}
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
            {editingExigence ? 'Modifier l\'Exigence' : 'Créer une nouvelle Exigence'}
          </h2>
          <ExigenceForm
            exigence={editingExigence}
            features={features}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingExigence(null)
            }}
            onGenerateAI={handleGenerateAI}
            onImproveAI={handleImproveAI}
          />
        </div>
      )}

      {/* Tableau des Exigences */}
      {features.length === 0 ? (
        <div className="card">
          <div className="text-center py-8">
            <p className="text-muted mb-4">
              ⚠️ Vous devez d'abord créer une Feature avant de pouvoir ajouter des Exigences.
            </p>
            <a href="/features" className="btn btn-primary">
              Aller aux Features
            </a>
          </div>
        </div>
      ) : (
        <div ref={listRef}>
          <DataTable
            data={exigences}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingExigence(null)
              setShowForm(true)
            }}
            title="Exigences"
            emptyMessage="Aucune Exigence enregistrée. Cliquez sur 'Ajouter' pour commencer."
          />
        </div>
      )}

      <ExigenceAIGeneratorModal
        feature={selectedFeatureForAI}
        onClose={() => setSelectedFeatureForAI(null)}
        onGenerate={handleAIGeneratedExigences}
      />

      <AIImprovementModal
        isOpen={showImprovementModal}
        onClose={() => {
          setShowImprovementModal(false)
          setImprovingExigence(null)
          setImprovementSuggestions([])
        }}
        item={improvingExigence}
        itemType="Exigence"
        onGetSuggestions={handleImprovementSuggestions}
        onApply={handleApplyImprovements}
        suggestions={improvementSuggestions}
      />
    </div>
  )
}
