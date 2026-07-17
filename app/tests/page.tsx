'use client'

import { useState, useEffect, useRef } from 'react'
import DataTable from '@/components/DataTable'
import TestForm from '@/components/TestForm'
import TestAIGeneratorModal from '@/components/TestAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Test, TestFormData } from '@/types/test'
import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'
import { getStatutDisplay, getTypeDisplay, getPrioriteDisplay } from '@/utils/statutDisplay'

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

type ExigenceInfo = {
  id: string
  titre: string
  featureTitre: string
  besoinTitre: string
  description?: string
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [selectedExigenceForAI, setSelectedExigenceForAI] = useState<Exigence | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingTest, setImprovingTest] = useState<Test | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const loadData = () => {
    const savedTests = localStorage.getItem('tests')
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    const savedBesoins = localStorage.getItem('besoins')
    if (savedTests) setTests(JSON.parse(savedTests))
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
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
      localStorage.setItem('tests', JSON.stringify(tests))
    }
  }, [tests, loading])

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmit = async (data: TestFormData) => {
    try {
      if (editingTest) {
        setTests(
          tests.map((t) =>
            t.id === editingTest.id
              ? {
                  ...t,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  exigenceId: data.exigenceId,
                  isTNR: data.isTNR,
                  isAutomatisable: data.isAutomatisable,
                  priorite: data.priorite,
                  type: data.type,
                  updated_at: new Date().toISOString(),
                }
              : t
          )
        )
        showNotification('Test modifié avec succès !')
      } else {
        const newTest: Test = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          exigenceId: data.exigenceId,
          isTNR: data.isTNR,
          isAutomatisable: data.isAutomatisable,
          priorite: data.priorite,
          type: data.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setTests([...tests, newTest])
        showNotification('Test créé avec succès !')
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingTest(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setTests(tests.filter((t) => t.id !== id))
      showNotification('Test supprimé avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (test: Test) => {
    setEditingTest(test)
    setShowForm(true)
  }

  const handleGenerateAI = (exigenceInfo: ExigenceInfo) => {
    const exigence = exigences.find((e) => e.id === exigenceInfo.id)
    if (exigence) {
      setSelectedExigenceForAI(exigence)
    }
  }

  const handleImproveAI = (test: Test) => {
    setImprovingTest(test)
    setShowImprovementModal(true)
  }

  const handleAIGeneratedTests = (generatedTests: Test[]) => {
    setTests([...tests, ...generatedTests])
    showNotification(`${generatedTests.length} Tests générés par IA !`)
    setSelectedExigenceForAI(null)
  }

  const handleImprovementSuggestions = (suggestions: Suggestion[]) => {
    setImprovementSuggestions(suggestions)
  }

  const handleApplyImprovements = () => {
    if (improvingTest) {
      const improvedTest = { ...improvingTest }
      improvementSuggestions.forEach((suggestion) => {
        if (suggestion.checked) {
          if (suggestion.field === 'titre') {
            improvedTest.titre = suggestion.newValue
          } else if (suggestion.field === 'description') {
            improvedTest.description = suggestion.newValue
          }
        }
      })
      setTests(
        tests.map((t) => (t.id === improvingTest.id ? improvedTest : t))
      )
      showNotification('Améliorations appliquées avec succès !')
      setShowImprovementModal(false)
      setImprovingTest(null)
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

  // Préparer les exigences avec les informations nécessaires pour le formulaire
  const exigencesWithInfo = exigences.map((e) => {
    const feature = features.find((f) => f.id === e.featureId)
    const besoin = feature ? besoins.find((b) => b.id === feature.besoinId) : null
    return {
      id: e.id,
      titre: e.titre,
      featureTitre: feature?.titre || 'Inconnu',
      besoinTitre: besoin?.titre || 'Inconnu',
      description: e.description || undefined,
    }
  })

  // Définir les colonnes du tableau
  const columns = [
    {
      key: 'titre',
      header: 'Titre',
      sortable: true,
      render: (test: Test) => (
        <div className="font-medium text-gray-800">{test.titre}</div>
      ),
    },
    {
      key: 'exigence',
      header: 'Exigence',
      sortable: true,
      render: (test: Test) => {
        const exigence = exigences.find((e) => e.id === test.exigenceId)
        return (
          <div className="text-gray-600 text-sm">
            {exigence?.titre || 'Inconnu'}
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (test: Test) => (
        <span className="env-badge">
          {getTypeDisplay(test.type)}
        </span>
      ),
    },
    {
      key: 'priorite',
      header: 'Priorité',
      sortable: true,
      render: (test: Test) => (
        <span className={`env-badge ${
          test.priorite === 'Critique' ? 'bg-error-light text-error' :
          test.priorite === 'Elevee' ? 'bg-warning-light text-warning' :
          test.priorite === 'Moyenne' ? 'bg-gray-200 text-gray-600' :
          'bg-success-light text-success'
        }`}>
          {getPrioriteDisplay(test.priorite)}
        </span>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (test: Test) => (
        <span className={`status-badge in-table ${
          test.statut === 'Termine' || test.statut === 'Valide' ? 'ready' :
          test.statut === 'En cours' ? 'processing' :
          test.statut === 'Annule' ? 'error' :
          'canceled'
        }`}>
          {getStatutDisplay(test.statut)}
        </span>
      ),
    },
    {
      key: 'tnr',
      header: 'TNR',
      sortable: false,
      render: (test: Test) => (
        <div className="text-center">
          {test.isTNR ? '✅' : '❌'}
        </div>
      ),
    },
    {
      key: 'automatisable',
      header: 'Auto',
      sortable: false,
      render: (test: Test) => (
        <div className="text-center">
          {test.isAutomatisable ? '✅' : '❌'}
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
            {editingTest ? 'Modifier le Test' : 'Créer un nouveau Test'}
          </h2>
          <TestForm
            test={editingTest}
            exigences={exigencesWithInfo}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingTest(null)
            }}
            onGenerateAI={handleGenerateAI}
            onImproveAI={handleImproveAI}
          />
        </div>
      )}

      {/* Tableau des Tests */}
      {exigences.length === 0 ? (
        <div className="card">
          <div className="text-center py-8">
            <p className="text-muted mb-4">
              ⚠️ Vous devez d'abord créer une Exigence avant de pouvoir ajouter des Tests.
            </p>
            <a href="/exigences" className="btn btn-primary">
              Aller aux Exigences
            </a>
          </div>
        </div>
      ) : (
        <div ref={listRef}>
          <DataTable
            data={tests}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => {
              setEditingTest(null)
              setShowForm(true)
            }}
            title="Tests"
            emptyMessage="Aucun Test enregistré. Cliquez sur 'Ajouter' pour commencer."
          />
        </div>
      )}

      <TestAIGeneratorModal
        exigence={selectedExigenceForAI}
        onClose={() => setSelectedExigenceForAI(null)}
        onGenerate={handleAIGeneratedTests}
      />

      <AIImprovementModal
        isOpen={showImprovementModal}
        onClose={() => {
          setShowImprovementModal(false)
          setImprovingTest(null)
          setImprovementSuggestions([])
        }}
        item={improvingTest}
        itemType="Test"
        onGetSuggestions={handleImprovementSuggestions}
        onApply={handleApplyImprovements}
        suggestions={improvementSuggestions}
      />
    </div>
  )
}
