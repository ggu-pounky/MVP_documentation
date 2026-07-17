'use client'

import { useState, useEffect } from 'react'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'
import type { Test } from '@/types/test'

export default function MatricesPage() {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [epics, setEpics] = useState<Epic[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBesoin, setSelectedBesoin] = useState<string>('')
  const [selectedEpic, setSelectedEpic] = useState<string>('')
  const [selectedFeature, setSelectedFeature] = useState<string>('')

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
        <h1 className="text-2xl font-bold text-neumorphic mb-2">🔗 Matrices de Traçabilité</h1>
        <p className="text-neumorphic-muted">Visualisez les liens entre tous les éléments du projet</p>
      </div>

      {/* Matrice de Traçabilité: Besoins → Tout */}
      <div className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">
          📊 Matrice de Traçabilité Complète
        </h2>
        <p className="text-neumorphic-muted mb-4">
          Suivi de la décomposition: Besoins → EPICS → Features → Exigences → Tests
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-neumorphic">
            <thead className="bg-neumorphic-dark">
              <tr>
                <th className="p-3 text-left text-neumorphic-muted">Besoin</th>
                <th className="p-3 text-left text-neumorphic-muted">EPICS</th>
                <th className="p-3 text-left text-neumorphic-muted">Features</th>
                <th className="p-3 text-left text-neumorphic-muted">Exigences</th>
                <th className="p-3 text-left text-neumorphic-muted">Tests</th>
                <th className="p-3 text-left text-neumorphic-muted">Couverture</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, index) => (
                <tr key={index} className="border-t border-neumorphic-border">
                  <td className="p-3">
                    <div className="font-medium">{row.besoin.titre}</div>
                    <div className="text-xs text-neumorphic-muted">{row.besoin.statut}</div>
                  </td>
                  <td className="p-3">{row.total.epics}</td>
                  <td className="p-3">{row.total.features}</td>
                  <td className="p-3">{row.total.exigences}</td>
                  <td className="p-3">{row.total.tests}</td>
                  <td className="p-3">
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        row.total.tests > 0 && row.total.tests >= row.total.exigences
                          ? 'bg-green-500/20 text-green-300'
                          : row.total.tests > 0
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {row.total.tests > 0 && row.total.tests >= row.total.exigences
                        ? '✅ Complète'
                        : row.total.tests > 0
                        ? '⚠️ Partielle'
                        : '❌ Aucune'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matrice de Couverture: Exigences vs Tests */}
      <div className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">
          🛡️ Matrice de Couverture des Tests
        </h2>
        <p className="text-neumorphic-muted mb-4">
          Vérifiez que chaque exigence est couverte par au moins un test
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-neumorphic">
            <thead className="bg-neumorphic-dark">
              <tr>
                <th className="p-3 text-left text-neumorphic-muted">Exigence</th>
                <th className="p-3 text-left text-neumorphic-muted">Feature</th>
                <th className="p-3 text-left text-neumorphic-muted">EPIC</th>
                <th className="p-3 text-left text-neumorphic-muted">Besoin</th>
                <th className="p-3 text-left text-neumorphic-muted">Tests</th>
                <th className="p-3 text-left text-neumorphic-muted">Statut</th>
              </tr>
            </thead>
            <tbody>
              {coverageMatrix.map((row, index) => (
                <tr key={index} className="border-t border-neumorphic-border">
                  <td className="p-3">
                    <div className="font-medium">{row.exigence.titre}</div>
                    <div className="text-xs text-neumorphic-muted">{row.exigence.type}</div>
                  </td>
                  <td className="p-3">{row.feature?.titre || '-'}</td>
                  <td className="p-3">{row.epic?.titre || '-'}</td>
                  <td className="p-3">{row.besoin?.titre || '-'}</td>
                  <td className="p-3">{row.tests.length}</td>
                  <td className="p-3">
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        row.covered
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {row.covered ? '✅ Couverte' : '❌ Non couverte'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques de Couverture */}
      <div className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">
          📈 Statistiques de Couverture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="neumorphic-card p-4 text-center">
            <div className="text-2xl font-bold text-neumorphic">
              {coverageMatrix.filter((r) => r.covered).length}
            </div>
            <div className="text-neumorphic-muted text-sm">Exigences couvertes</div>
            <div className="text-xs text-neumorphic-muted mt-2">
              {Math.round(
                (coverageMatrix.filter((r) => r.covered).length / coverageMatrix.length) * 100
              )}
              % de couverture
            </div>
          </div>
          <div className="neumorphic-card p-4 text-center">
            <div className="text-2xl font-bold text-neumorphic">
              {coverageMatrix.filter((r) => !r.covered).length}
            </div>
            <div className="text-neumorphic-muted text-sm">Exigences non couvertes</div>
            <div className="text-xs text-neumorphic-muted mt-2">
              À prioriser
            </div>
          </div>
          <div className="neumorphic-card p-4 text-center">
            <div className="text-2xl font-bold text-neumorphic">{tests.length}</div>
            <div className="text-neumorphic-muted text-sm">Tests totaux</div>
            <div className="text-xs text-neumorphic-muted mt-2">
              {exigences.length > 0
                ? Math.round((tests.length / exigences.length) * 100)
                : 0}
              % ratio tests/exigences
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
