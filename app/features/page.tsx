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
        <h1 className="text-2xl font-bold text-neumorphic mb-2">🔧 Gestion des Features</h1>
        <p className="text-neumorphic-muted">Créez et gérez les Features pour vos EPICS</p>
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

      {epics.length === 0 ? (
        <div className="neumorphic-card p-6 text-center">
          <p className="text-neumorphic-muted mb-4">
            ⚠️ Vous devez d'abord créer une EPIC avant de pouvoir ajouter des Features.
          </p>
          <a href="/epics" className="neumorphic-button px-6 py-2 inline-block">
            Aller aux EPICS
          </a>
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setEditingFeature(null)
              setShowForm(!showForm)
            }}
            className="neumorphic-button px-6 py-3 flex items-center gap-2"
          >
            <span>{showForm ? '❌' : '➕'}</span>
            <span>{showForm ? 'Annuler' : 'Ajouter une Feature'}</span>
          </button>

          {showForm && (
            <div className="neumorphic-card p-6">
              <h2 className="text-lg font-semibold text-neumorphic mb-4">
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

          <div ref={listRef} className="neumorphic-card p-6">
            <h2 className="text-lg font-semibold text-neumorphic mb-4">
              Liste des Features ({features.length})
            </h2>
            <FeatureList
              features={features}
              epics={epics}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
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
