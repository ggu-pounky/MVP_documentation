'use client'

import { useState, useEffect, useRef } from 'react'
import DataTable from '@/components/DataTable'
import FeatureForm from '@/components/FeatureForm'
import FeatureAIGeneratorModal from '@/components/FeatureAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Feature, FeatureFormData } from '@/types/feature'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'
import { getStatutDisplay, getPrioriteDisplay } from '@/utils/statutDisplay'

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
  const [selectedBesoinForAI, setSelectedBesoinForAI] = useState<Besoin | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingFeature, setImprovingFeature] = useState<Feature | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const loadData = () => {
    const savedFeatures = localStorage.getItem('features')
    const savedBesoins = localStorage.getItem('besoins')
    const savedEpics = localStorage.getItem('epics')
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    if (savedBesoins) setBesoins(JSON.parse(savedBesoins))
    if (savedEpics) setEpics(JSON.parse(savedEpics))
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
      localStorage.setItem('features', JSON.stringify(features))
    }
  }, [features, loading])

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: FeatureFormData) => {
    try {
      if (editingFeature) {
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
                  epicId: data.epicId ?? null,
                  updated_at: new Date().toISOString(),
                }
              : f
          )
        )
        showNotification('Feature modifiée avec succès !')
      } else {
        const newFeature: Feature = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          priorite: data.priorite,
          statut: data.statut,
          besoinId: data.besoinId,
          epicId: data.epicId ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setFeatures([...features, newFeature])
        showNotification('Feature créée avec succès !')
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

  const handleGenerateAI = (besoin: Besoin) => {
    setSelectedBesoinForAI(besoin)
  }

  const handleImproveAI = (feature: Feature) => {
    setImprovingFeature(feature)
    setShowImprovementModal(true)
  }

  const handleAIGeneratedFeatures = (generatedFeatures: Feature[]) => {
    setFeatures([...features, ...generatedFeatures])
    showNotification(`${generatedFeatures.length} Features générées par IA !`)
    setSelectedBesoinForAI(null)
  }

  const handleImprovementSuggestions = (suggestions: Suggestion[]) => {
    setImprovementSuggestions(suggestions)
  }

  const handleApplyImprovements = () => {
    if (improvingFeature) {
      const improvedFeature = { ...improvingFeature }
      improvementSuggestions.forEach((suggestion) => {
        if (suggestion.checked) {
          if (suggestion.field === 'titre') {
            improvedFeature.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            improvedFeature.description = suggestion.newValue
          }
        }
      })
      setFeatures(
        features.map((f) => (f.id === improvingFeature.id ? improvedFeature : f))
      )
      showNotification('Améliorations appliquées avec succès !')
      setShowImprovementModal(false)
      setImprovingFeature(null)
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
      render: (feature: Feature) => (
        <div className="font-medium text-gray-800">{feature.titre}</div>
      ),
    },
    {
      key: 'epic',
      header: 'EPIC',
      sortable: true,
      render: (feature: Feature) => {
        const epic = epics.find((e) => e.id === feature.epicId)
        return (
          <div className="text-gray-600 text-sm">
            {epic?.titre || 'Aucune'}
          </div>
        )
      },
    },
    {
      key: 'priorite',
      header: 'Priorité',
      sortable: true,
      render: (feature: Feature) => (
        <span className={`env-badge ${
          feature.priorite === 'Critique' ? 'bg-error-light text-error' :
          feature.priorite === 'Elevee' ? 'bg-warning-light text-warning' :
          feature.priorite === 'Moyenne' ? 'bg-gray-200 text-gray-600' :
          'bg-success-light text-success'
        }`}>
          {getPrioriteDisplay(feature.priorite)}
        </span>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (feature: Feature) => (
        <span className={`status-badge in-table ${
          feature.statut === 'Termine' ? 'ready' :
          feature.statut === 'En cours' ? 'processing' :
          feature.statut === 'Annule' ? 'error' :
          'canceled'
        }`}>
          {getStatutDisplay(feature.statut)}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      render: (feature: Feature) => (
        <div className="text-gray-600 text-sm">
          {feature.description || '-'}
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
            {editingFeature ? 'Modifier la Feature' : 'Créer une nouvelle Feature'}
          </h2>
          <FeatureForm
            feature={editingFeature}
            besoins={besoins}
            epics={epics}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingFeature(null)
            }}
            onGenerateAI={handleGenerateAI}
            onImproveAI={handleImproveAI}
          />
        </div>
      )}

      {/* Tableau des Features */}
      {epics.length === 0 ? (
        <div className="card">
          <div className="text-center py-8">
            <p className="text-muted mb-4">
              ⚠️ Vous devez d'abord créer une EPIC avant de pouvoir ajouter des Features.
            </p>
            <a href="/epics" className="btn btn-primary">
              Aller aux EPICS
            </a>
          </div>
        </div>
      ) : (
        <div ref={listRef}>
          <DataTable
            data={features}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingFeature(null)
              setShowForm(true)
            }}
            title="Features"
            emptyMessage="Aucune Feature enregistrée. Cliquez sur 'Ajouter' pour commencer."
          />
        </div>
      )}

      <FeatureAIGeneratorModal
        besoin={selectedBesoinForAI}
        onClose={() => setSelectedBesoinForAI(null)}
        onGenerate={handleAIGeneratedFeatures}
      />

      <AIImprovementModal
        isOpen={showImprovementModal}
        onClose={() => {
          setShowImprovementModal(false)
          setImprovingFeature(null)
          setImprovementSuggestions([])
        }}
        item={improvingFeature}
        itemType="Feature"
        onGetSuggestions={handleImprovementSuggestions}
        onApply={handleApplyImprovements}
        suggestions={improvementSuggestions}
      />
    </div>
  )
}
