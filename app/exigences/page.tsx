'use client'

import { useState, useEffect, useRef } from 'react'
import ExigenceForm from '@/components/ExigenceForm'
import ExigenceList from '@/components/ExigenceList'
import ExigenceAIGeneratorModal from '@/components/ExigenceAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import type { Feature } from '@/types/feature'

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
        <h1 className="text-2xl font-bold text-neumorphic mb-2">📋 Gestion des Exigences</h1>
        <p className="text-neumorphic-muted">Créez et gérez les exigences pour vos Features</p>
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

      {features.length === 0 ? (
        <div className="neumorphic-card p-6 text-center">
          <p className="text-neumorphic-muted mb-4">
            ⚠️ Vous devez d'abord créer une Feature avant de pouvoir ajouter des Exigences.
          </p>
          <a href="/features" className="neumorphic-button px-6 py-2 inline-block">
            Aller aux Features
          </a>
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setEditingExigence(null)
              setShowForm(!showForm)
            }}
            className="neumorphic-button px-6 py-3 flex items-center gap-2"
          >
            <span>{showForm ? '❌' : '➕'}</span>
            <span>{showForm ? 'Annuler' : 'Ajouter une Exigence'}</span>
          </button>

          {showForm && (
            <div className="neumorphic-card p-6">
              <h2 className="text-lg font-semibold text-neumorphic mb-4">
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

          <div ref={listRef} className="neumorphic-card p-6">
            <h2 className="text-lg font-semibold text-neumorphic mb-4">
              Liste des Exigences ({exigences.length})
            </h2>
            <ExigenceList
              exigences={exigences}
              features={features}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
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
