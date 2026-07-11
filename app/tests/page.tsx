'use client'

import { useState, useEffect, useRef } from 'react'
import TestForm from '@/components/TestForm'
import TestList from '@/components/TestList'
import TestAIGeneratorModal from '@/components/TestAIGeneratorModal'
import AIImprovementModal from '@/components/AIImprovementModal'
import type { Test, TestFormData } from '@/types/test'
import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'

type ExigenceInfo = {
  id: string
  titre: string
  featureTitre: string
  besoinTitre: string
  description?: string
}

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
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
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [selectedExigenceForAI, setSelectedExigenceForAI] = useState<ExigenceInfo | null>(null)
  const [showImprovementModal, setShowImprovementModal] = useState(false)
  const [improvementSuggestions, setImprovementSuggestions] = useState<Suggestion[]>([])
  const [improvingTest, setImprovingTest] = useState<Test | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedTests = localStorage.getItem('tests')
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    const savedBesoins = localStorage.getItem('besoins')
    
    if (savedTests) {
      setTests(JSON.parse(savedTests))
    }
    if (savedExigences) {
      setExigences(JSON.parse(savedExigences))
    }
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
    }
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
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

  // Sauvegarder les tests dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('tests', JSON.stringify(tests))
    }
  }, [tests, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Convertir les exigences en ExigenceInfo avec les titres des features et besoins
  const getExigencesWithInfo = (): ExigenceInfo[] => {
    return exigences.map((exigence) => {
      const feature = features.find((f) => f.id === exigence.featureId)
      const besoin = besoins.find((b) => b.id === feature?.besoinId)
      return {
        id: exigence.id,
        titre: exigence.titre,
        featureTitre: feature?.titre || 'Inconnu',
        besoinTitre: besoin?.titre || 'Inconnu',
        description: exigence.description || undefined,
      }
    })
  }

  // Ouvrir la modale de génération IA pour une exigence
  const openAIGenerator = (exigence: ExigenceInfo) => {
    setSelectedExigenceForAI(exigence)
    setShowAIGenerator(true)
  }

  // Générer des tests à partir des suggestions IA
  const handleGenerateFromAI = (generatedTests: { titre: string; description: string }[]) => {
    if (!selectedExigenceForAI) return

    // Trouver l'exigence correspondante
    const exigence = exigences.find((e) => e.id === selectedExigenceForAI.id)
    if (!exigence) return

    const newTests: Test[] = generatedTests.map((testData) => ({
      id: generateId(),
      titre: testData.titre,
      description: testData.description,
      exigenceId: exigence.id,
      isTNR: false,
      isAutomatisable: true,
      priorite: 'Moyenne',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setTests([...tests, ...newTests])
    showNotification(`${newTests.length} Test(s) généré(s) avec succès !`)
    setShowAIGenerator(false)
    setSelectedExigenceForAI(null)
    setShowForm(false)
  }

  // Ouvrir la modale d'amélioration IA
  const openImprovementModal = (test: Test) => {
    setImprovingTest(test)
    
    // Générer des suggestions d'amélioration
    const suggestions: Suggestion[] = []
    
    // Suggestion pour le titre (si vide ou trop court)
    if (!test.titre || test.titre.length < 10) {
      suggestions.push({
        field: 'titre',
        oldValue: test.titre || '(vide)',
        newValue: `Test de ${test.titre || 'cette fonctionnalité'}`,
        checked: true,
      })
    }
    
    // Suggestion pour la description (format standard)
    if (!test.description || !test.description.includes('Vérifier que')) {
      const newDescription = `Vérifier que le système ${test.titre.toLowerCase()} correctement.
Critères de succès:
1. Le système doit permettre de ${test.titre.toLowerCase()}.
2. Les données doivent être validées avant toute opération.
3. Une confirmation visuelle doit être affichée après chaque action.
4. Les erreurs doivent être gérées et affichées clairement.`
      
      suggestions.push({
        field: 'description',
        oldValue: test.description || '(vide)',
        newValue: newDescription,
        checked: true,
      })
    }
    
    setImprovementSuggestions(suggestions)
    setShowImprovementModal(true)
  }

  // Appliquer les suggestions d'amélioration sélectionnées
  const handleApplyImprovements = (selectedSuggestions: Suggestion[]) => {
    if (!improvingTest) return
    
    // Appliquer les modifications au Test
    setTests(
      tests.map((t) =>
        t.id === improvingTest.id
          ? {
              ...t,
              titre: selectedSuggestions.find((s) => s.field === 'titre' && s.checked)?.newValue || t.titre,
              description: selectedSuggestions.find((s) => s.field === 'description' && s.checked)?.newValue || t.description,
              updated_at: new Date().toISOString(),
            }
          : t
      )
    )
    showNotification('Test amélioré avec succès !')
    setShowImprovementModal(false)
    setImprovingTest(null)
  }

  const handleSubmit = async (data: TestFormData) => {
    try {
      if (editingTest) {
        // Mettre à jour un test existant
        setTests(
          tests.map((t) =>
            t.id === editingTest.id
              ? {
                  ...t,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  isTNR: data.isTNR,
                  isAutomatisable: data.isAutomatisable,
                  priorite: data.priorite,
                  exigenceId: data.exigenceId,
                  updated_at: new Date().toISOString(),
                }
              : t
          )
        )
        showNotification('Test modifié avec succès !')
      } else {
        // Créer un nouveau test
        const newTest: Test = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          isTNR: data.isTNR,
          isAutomatisable: data.isAutomatisable,
          priorite: data.priorite,
          exigenceId: data.exigenceId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setTests([...tests, newTest])
        showNotification('Test créé avec succès !')
        // Scroll vers la liste après création
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="neumorphic-card px-6 py-4">
          <div className="flex items-center gap-2 text-neumorphic">
            <span className="animate-spin">\u23f3</span>
            <span>Chargement...</span>
          </div>
        </div>
      </div>
    )
  }

  const exigencesWithInfo = getExigencesWithInfo()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">Gestion des Tests</h1>
        <p className="text-neumorphic-muted">Créez, modifiez et gérez vos tests projet</p>
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

      {/* Bouton pour ajouter un test */}
      <button
        onClick={() => {
          if (exigences.length === 0) {
            showNotification('Veuillez d\'abord créer une exigence', 'error')
            return
          }
          setEditingTest(null)
          setShowForm(!showForm)
        }}
        disabled={exigences.length === 0}
        className={`neumorphic-button px-6 py-3 flex items-center gap-2 ${exigences.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{showForm ? '\u274c' : '\u2795'}</span>
        <span>{showForm ? 'Annuler' : 'Ajouter un Test'}</span>
      </button>

      {showForm && (
        <div className="neumorphic-card p-6">
          <TestForm
            test={editingTest}
            exigences={exigencesWithInfo}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingTest(null)
            }}
            onGenerateAI={openAIGenerator}
            onImproveAI={openImprovementModal}
          />
        </div>
      )}

      {/* Liste des tests */}
      <div ref={listRef} className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">Liste des Tests</h2>
        <TestList
          tests={tests}
          exigences={exigencesWithInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modale de génération IA */}
      {showAIGenerator && selectedExigenceForAI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neumorphic-card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <TestAIGeneratorModal
              exigence={selectedExigenceForAI}
              onClose={() => {
                setShowAIGenerator(false)
                setSelectedExigenceForAI(null)
              }}
              onGenerate={handleGenerateFromAI}
            />
          </div>
        </div>
      )}

      {/* Modale d'amélioration IA */}
      {showImprovementModal && improvingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="neumorphic-card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <AIImprovementModal
              title={improvingTest.titre}
              suggestions={improvementSuggestions}
              onClose={() => {
                setShowImprovementModal(false)
                setImprovingTest(null)
              }}
              onApply={handleApplyImprovements}
            />
          </div>
        </div>
      )}
    </div>
  )
}
