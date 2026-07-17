'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/DataTable'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'
import type { Test } from '@/types/test'
import { getStatutDisplay } from '@/utils/statutDisplay'

export default function MatricesPage() {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = () => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedEpics = localStorage.getItem('epics')
    const savedFeatures = localStorage.getItem('features')
    const savedExigences = localStorage.getItem('exigences')
    const savedTests = localStorage.getItem('tests')
    if (savedBesoins) setBesoins(JSON.parse(savedBesoins))
    if (savedEpics) setEpics(JSON.parse(savedEpics))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedTests) setTests(JSON.parse(savedTests))
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    const handleStorageChange = () => loadData()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Matrice de traçabilité: Besoins → EPICS → Features → Exigences → Tests
  const getTraceabilityMatrix = () => {
    return besoins.map((besoin) => {
      const besoinEpics = epics.filter((e) => e.besoinId === besoin.id)
      const epicFeatures = features.filter((f) => besoinEpics.some((e) => e.id === f.epicId))
      const featureExigences = exigences.filter((e) => epicFeatures.some((f) => f.id === e.featureId))
      const exigenceTests = tests.filter((t) => featureExigences.some((e) => e.id === t.exigenceId))

      return {
        besoin,
        epics: besoinEpics,
        features: epicFeatures,
        exigences: featureExigences,
        tests: exigenceTests,
        total: {
          epics: besoinEpics.length,
          features: epicFeatures.length,
          exigences: featureExigences.length,
          tests: exigenceTests.length,
        },
      }
    })
  }

  const matrix = getTraceabilityMatrix()

  // Matrice de couverture: Exigences vs Tests
  const getCoverageMatrix = () => {
    return exigences.map((exigence) => {
      const exigenceTests = tests.filter((t) => t.exigenceId === exigence.id)
      const feature = features.find((f) => f.id === exigence.featureId)
      const epic = epics.find((e) => e.id === feature?.epicId)
      const besoin = besoins.find((b) => b.id === epic?.besoinId)

      return {
        exigence,
        feature,
        epic,
        besoin,
        tests: exigenceTests,
        covered: exigenceTests.length > 0,
      }
    })
  }

  const coverageMatrix = getCoverageMatrix()

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

  // Colonnes pour la matrice de traçabilité
  const traceabilityColumns = [
    {
      key: 'besoin',
      header: 'Besoin',
      sortable: true,
      render: (row: any) => (
        <div className="font-medium text-gray-800">{row.besoin.titre}</div>
      ),
    },
    {
      key: 'epics',
      header: 'EPICS',
      sortable: true,
      render: (row: any) => (
        <span className="env-badge">{row.total.epics}</span>
      ),
    },
    {
      key: 'features',
      header: 'Features',
      sortable: true,
      render: (row: any) => (
        <span className="env-badge">{row.total.features}</span>
      ),
    },
    {
      key: 'exigences',
      header: 'Exigences',
      sortable: true,
      render: (row: any) => (
        <span className="env-badge">{row.total.exigences}</span>
      ),
    },
    {
      key: 'tests',
      header: 'Tests',
      sortable: true,
      render: (row: any) => (
        <span className="env-badge">{row.total.tests}</span>
      ),
    },
    {
      key: 'coverage',
      header: 'Couverture',
      sortable: false,
      render: (row: any) => (
        <span className={`status-badge in-table ${
          row.total.tests > 0 && row.total.tests >= row.total.exigences
            ? 'ready'
            : row.total.tests > 0
            ? 'processing'
            : 'error'
        }`}>
          {row.total.tests > 0 && row.total.tests >= row.total.exigences
            ? '✅ Complète'
            : row.total.tests > 0
            ? '⚠️ Partielle'
            : '❌ Aucune'}
        </span>
      ),
    },
  ]

  // Colonnes pour la matrice de couverture
  const coverageColumns = [
    {
      key: 'exigence',
      header: 'Exigence',
      sortable: true,
      render: (row: any) => (
        <div className="font-medium text-gray-800">{row.exigence.titre}</div>
      ),
    },
    {
      key: 'feature',
      header: 'Feature',
      sortable: true,
      render: (row: any) => (
        <div className="text-gray-600 text-sm">{row.feature?.titre || '-'}</div>
      ),
    },
    {
      key: 'epic',
      header: 'EPIC',
      sortable: true,
      render: (row: any) => (
        <div className="text-gray-600 text-sm">{row.epic?.titre || '-'}</div>
      ),
    },
    {
      key: 'besoin',
      header: 'Besoin',
      sortable: true,
      render: (row: any) => (
        <div className="text-gray-600 text-sm">{row.besoin?.titre || '-'}</div>
      ),
    },
    {
      key: 'tests',
      header: 'Tests',
      sortable: true,
      render: (row: any) => (
        <span className="env-badge">{row.tests.length}</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: false,
      render: (row: any) => (
        <span className={`status-badge in-table ${row.covered ? 'ready' : 'error'}`}>
          {row.covered ? '✅ Couverte' : '❌ Non couverte'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="card">
        <div className="card-header">
          <h1 className="text-xl font-semibold text-gray-800">Matrices de Traçabilité</h1>
          <p className="text-muted">Visualisez les liens entre tous les éléments du projet</p>
        </div>
      </div>

      {/* Matrice de Traçabilité */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Matrice de Traçabilité Complète</h2>
          <p className="text-muted text-sm">
            Suivi de la décomposition: Besoins → EPICS → Features → Exigences → Tests
          </p>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            data={matrix}
            columns={traceabilityColumns}
            title=""
            emptyMessage="Aucune donnée disponible."
          />
        </div>
      </div>

      {/* Matrice de Couverture */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Matrice de Couverture des Tests</h2>
          <p className="text-muted text-sm">
            Vérifiez que chaque exigence est couverte par au moins un test
          </p>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            data={coverageMatrix}
            columns={coverageColumns}
            title=""
            emptyMessage="Aucune donnée disponible."
          />
        </div>
      </div>

      {/* Statistiques de Couverture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800">
            {coverageMatrix.filter((r) => r.covered).length}
          </div>
          <div className="text-muted text-sm">Exigences couvertes</div>
          <div className="text-xs text-muted mt-2">
            {Math.round(
              (coverageMatrix.filter((r) => r.covered).length / coverageMatrix.length) * 100
            )}
            % de couverture
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800">
            {coverageMatrix.filter((r) => !r.covered).length}
          </div>
          <div className="text-muted text-sm">Exigences non couvertes</div>
          <div className="text-xs text-muted mt-2">À prioriser</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-800">{tests.length}</div>
          <div className="text-muted text-sm">Tests totaux</div>
          <div className="text-xs text-muted mt-2">
            {exigences.length > 0
              ? Math.round((tests.length / exigences.length) * 100)
              : 0}
            % ratio tests/exigences
          </div>
        </div>
      </div>
    </div>
  )
}
