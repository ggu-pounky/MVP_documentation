'use client'

import { useState, useEffect, useRef } from 'react'
import TestForm from '@/components/TestForm'
import TestList from '@/components/TestList'
import TestAIGeneratorModal from '@/components/TestAIGeneratorModal'
import type { Test, TestFormData } from '@/types/test'
import type { Besoin } from '@/types/besoin'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'

type ExigenceInfo = {
  id: string
  titre: string
  featureTitre: string
  besoinTitre: string
  description?: string
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [selectedExigenceForAI, setSelectedExigenceForAI] = useState<ExigenceInfo | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedFeatures = localStorage.getItem('features')
    const savedExigences = localStorage.getItem('exigences')
    const savedTests = localStorage.getItem('tests')

    if (savedBesoins) setBesoins(JSON.parse(savedBesoins))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedTests) setTests(JSON.parse(savedTests))

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

  // Ouvrir la modale de génération IA pour une exigence
  const openAIGenerator = (exigence: ExigenceInfo) => {
    setSelectedExigenceForAI(exigence)
    setShowAIGenerator(true)
  }

  // Générer des tests à partir des suggestions IA
  const handleGenerateFromAI = (generatedTests: { titre: string; description: string }[]) => {
    if (!selectedExigenceForAI) return

    const newTests: Test[] = generatedTests.map((testData) => ({
      id: generateId(),
      titre: testData.titre,
      description: testData.description,
      exigenceId: selectedExigenceForAI.id,
      isTNR: false,
      isAutomatisable: false,
      priorite: 'Moyenne',
      statut: 'À faire',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setTests([...tests, ...newTests])
    showNotification(`${newTests.length} test(s) généré(s) avec succès !`)
    setShowAIGenerator(false)
    setSelectedExigenceForAI(null)
    setShowForm(false)
  }

  // Préparer la liste des exigences avec leurs informations complètes
  const exigencesWithInfo = exigences.map((exigence) => {
    const feature = features.find((f) => f.id === exigence.featureId)
    const besoin = besoins.find((b) => b.id === feature?.besoinId)
    return {
      id: exigence.id,
      titre: exigence.titre,
      featureTitre: feature ? feature.titre : 'Inconnu',
      besoinTitre: besoin ? besoin.titre : 'Inconnu',
      description: exigence.description || undefined,
    }
  })

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
                  exigenceId: data.exigenceId,
                  isTNR: data.isTNR,
                  isAutomatisable: data.isAutomatisable,
                  priorite: data.priorite,
                  statut: data.statut,
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
          exigenceId: data.exigenceId,
          isTNR: data.isTNR,
          isAutomatisable: data.isAutomatisable,
          priorite: data.priorite,
          statut: data.statut,
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

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestion des Tests</h1>

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

      {/* Bouton pour ajouter un test (désactivé si aucune exigence) */}
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
        className={`mb-4 px-4 py-2 rounded ${
          exigences.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showForm ? 'Annuler' : 'Ajouter un Test'}
      </button>

      {showForm && (
        <TestForm
          test={editingTest}
          exigences={exigencesWithInfo}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingTest(null)
          }}
          onGenerateAI={openAIGenerator}
        />
      )}

      {/* Liste des tests avec référence pour le scroll */}
      <div ref={listRef}>
        <TestList
          tests={tests}
          exigences={exigencesWithInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modale de génération IA */}
      {showAIGenerator && (
        <TestAIGeneratorModal
          exigence={selectedExigenceForAI}
          onClose={() => {
            setShowAIGenerator(false)
            setSelectedExigenceForAI(null)
          }}
          onGenerate={handleGenerateFromAI}
        />
      )}
    </div>
  )
}
