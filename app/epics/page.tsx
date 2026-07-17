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
        <h1 className="text-2xl font-bold text-neumorphic mb-2">🎯 Gestion des EPICS</h1>
        <p className="text-neumorphic-muted">Créez et gérez les EPICS pour vos besoins</p>
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

      {besoins.length === 0 ? (
        <div className="neumorphic-card p-6 text-center">
          <p className="text-neumorphic-muted mb-4">
            ⚠️ Vous devez d'abord créer un besoin avant de pouvoir ajouter des EPICS.
          </p>
          <a href="/" className="neumorphic-button px-6 py-2 inline-block">
            Aller aux Besoins
          </a>
        </div>
      ) : (
        <>
          <button
            onClick={() => {
              setEditingEpic(null)
              setShowForm(!showForm)
            }}
            className="neumorphic-button px-6 py-3 flex items-center gap-2"
          >
            <span>{showForm ? '❌' : '➕'}</span>
            <span>{showForm ? 'Annuler' : 'Ajouter une EPIC'}</span>
          </button>

          {showForm && (
            <div className="neumorphic-card p-6">
              <h2 className="text-lg font-semibold text-neumorphic mb-4">
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

          <div ref={listRef} className="neumorphic-card p-6">
            <h2 className="text-lg font-semibold text-neumorphic mb-4">
              Liste des EPICS ({epics.length})
            </h2>
            <EpicList
              epics={epics}
              besoins={besoins}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </>
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
