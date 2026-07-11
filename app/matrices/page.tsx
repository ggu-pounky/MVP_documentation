'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Exigence } from '@/types/exigence'
import type { Test } from '@/types/test'
import type { Feature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'

type MatrixType = 'exigence-code' | 'code-tests' | 'exigence-tests' | 'complete'

const matrixOptions: { value: MatrixType; label: string }[] = [
  { value: 'exigence-code', label: 'Matrice Exigence - Code' },
  { value: 'code-tests', label: 'Matrice Code - Tests' },
  { value: 'exigence-tests', label: 'Matrice Exigence - Tests' },
  { value: 'complete', label: 'Matrice complète' },
]

export default function MatricesPage() {
  const [selectedMatrix, setSelectedMatrix] = useState<MatrixType | ''>('')
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedExigences = localStorage.getItem('exigences')
    const savedTests = localStorage.getItem('tests')
    const savedFeatures = localStorage.getItem('features')
    const savedBesoins = localStorage.getItem('besoins')
    
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedTests) setTests(JSON.parse(savedTests))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    if (savedBesoins) setBesoins(JSON.parse(savedBesoins))
    setLoading(false)
  }, [])

  // Fonction pour obtenir le titre complet d'une exigence
  const getExigenceTitle = (exigence: Exigence): string => {
    const feature = features.find((f) => f.id === exigence.featureId)
    const besoin = besoins.find((b) => b.id === feature?.besoinId)
    return `${besoin?.titre || '?'} → ${feature?.titre || '?'} → ${exigence.titre}`
  }

  // Fonction pour obtenir le titre complet d'un test
  const getTestTitle = (test: Test): string => {
    const exigence = exigences.find((e) => e.id === test.exigenceId)
    return exigence ? getExigenceTitle(exigence) : test.titre
  }

  // Calculer la couverture des exigences par les tests
  const calculateExigenceTestCoverage = (): { exigence: Exigence; tests: Test[]; covered: boolean }[] => {
    return exigences.map((exigence) => {
      const relatedTests = tests.filter((t) => t.exigenceId === exigence.id)
      return {
        exigence,
        tests: relatedTests,
        covered: relatedTests.length > 0,
      }
    })
  }

  // Calculer le pourcentage de couverture
  const calculateCoveragePercentage = (): number => {
    const coverageData = calculateExigenceTestCoverage()
    const coveredCount = coverageData.filter((item) => item.covered).length
    const totalCount = coverageData.length
    return totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0
  }

  // Matrice Exigence-Tests
  const ExigenceTestsMatrix = () => {
    const coverageData = calculateExigenceTestCoverage()
    const coveragePercent = calculateCoveragePercentage()

    if (exigences.length === 0 || tests.length === 0) {
      return (
        <div className="space-y-4">
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
            <p className="text-yellow-400">
              ⚠️ Aucune donnée disponible. Veuillez d'abord créer des exigences et des tests.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Métrique de couverture */}
        <div className="bg-neumorphic-bg-light rounded-lg p-4 border border-neumorphic-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neumorphic">Couverture des Exigences par les Tests</h3>
              <p className="text-sm text-neumorphic-muted">
                Pourcentage d'exigences ayant au moins un test associé
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-400">{coveragePercent}%</div>
              <div className="text-sm text-neumorphic-muted">
                {coverageData.filter((item) => item.covered).length} / {coverageData.length} exigences couvertes
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-neumorphic-bg-dark rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${coveragePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tableau de la matrice */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-neumorphic-border rounded-lg">
            <thead>
              <tr className="bg-neumorphic-bg-dark">
                <th className="py-3 px-4 border border-neumorphic-border text-left text-neumorphic font-medium">
                  Exigence
                </th>
                {tests.map((test) => (
                  <th key={test.id} className="py-3 px-4 border border-neumorphic-border text-center text-neumorphic font-medium">
                    <Link
                      href={`/tests#${test.id}`}
                      className="hover:text-blue-400 transition-colors"
                      title={getTestTitle(test)}
                    >
                      {test.titre.length > 15 ? `${test.titre.substring(0, 12)}...` : test.titre}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coverageData.map(({ exigence, tests: relatedTests }) => (
                <tr key={exigence.id} className="border-t border-neumorphic-border">
                  <td className="py-3 px-4 border border-neumorphic-border text-neumorphic">
                    <Link
                      href={`/exigences#${exigence.id}`}
                      className="hover:text-blue-400 transition-colors"
                      title={getExigenceTitle(exigence)}
                    >
                      {getExigenceTitle(exigence).length > 20 
                        ? `${getExigenceTitle(exigence).substring(0, 17)}...` 
                        : getExigenceTitle(exigence)}
                    </Link>
                  </td>
                  {tests.map((test) => {
                    const hasLink = relatedTests.some((t) => t.id === test.id)
                    return (
                      <td key={test.id} className="py-2 px-4 border border-neumorphic-border text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            hasLink
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                          title={hasLink ? 'Test associé' : 'Aucun test associé'}
                        >
                          {hasLink ? '✓' : '✗'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Légende */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">✓</span>
            <span className="text-neumorphic-muted">= Test associé à l'exigence</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">✗</span>
            <span className="text-neumorphic-muted">= Aucun test associé</span>
          </div>
        </div>

        {/* Liste détaillée des associations */}
        <div className="mt-6 bg-neumorphic-bg-light rounded-lg p-4 border border-neumorphic-border">
          <h3 className="text-lg font-semibold text-neumorphic mb-4">
            Détail des associations Exigence → Tests
          </h3>
          <div className="space-y-4">
            {coverageData.map(({ exigence, tests: relatedTests }) => (
              <div key={exigence.id} className="border border-neumorphic-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📋</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-neumorphic mb-2">
                      <Link
                        href={`/exigences#${exigence.id}`}
                        className="hover:text-blue-400"
                      >
                        {getExigenceTitle(exigence)}
                      </Link>
                    </h4>
                    {relatedTests.length > 0 ? (
                      <div className="ml-4 mt-2">
                        <p className="text-sm text-neumorphic-muted mb-2">
                          Tests associés ({relatedTests.length}):
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {relatedTests.map((test) => (
                            <li key={test.id} className="text-neumorphic">
                              <Link
                                href={`/tests#${test.id}`}
                                className="hover:text-blue-400"
                              >
                                {test.titre}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400 ml-4 mt-2">
                        ⚠️ Aucune test associé à cette exigence
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Matrice Exigence-Code (à implémenter plus tard)
  const ExigenceCodeMatrix = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neumorphic">Matrice Exigence - Code</h3>
      <p className="text-neumorphic-muted">
        Cette matrice montre la couverture des exigences par le code source.
      </p>
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-400">
          ⚠️ Fonctionnalité à implémenter. Analysez d'abord votre code via l'onglet "Code".
        </p>
      </div>
    </div>
  )

  // Matrice Code-Tests (à implémenter plus tard)
  const CodeTestsMatrix = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neumorphic">Matrice Code - Tests</h3>
      <p className="text-neumorphic-muted">
        Cette matrice montre la couverture du code par les tests.
      </p>
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-400">
          ⚠️ Fonctionnalité à implémenter. Analysez d'abord votre code via l'onglet "Code".
        </p>
      </div>
    </div>
  )

  // Matrice Complète (à implémenter plus tard)
  const CompleteMatrix = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-neumorphic">Matrice Complète</h3>
      <p className="text-neumorphic-muted">
        Cette matrice combine toutes les relations entre exigences, code et tests.
      </p>
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
        <p className="text-yellow-400">
          ⚠️ Fonctionnalité à implémenter.
        </p>
      </div>
    </div>
  )

  // Rendu de la matrice sélectionnée
  const renderMatrix = () => {
    switch (selectedMatrix) {
      case 'exigence-tests':
        return <ExigenceTestsMatrix />
      case 'exigence-code':
        return <ExigenceCodeMatrix />
      case 'code-tests':
        return <CodeTestsMatrix />
      case 'complete':
        return <CompleteMatrix />
      default:
        return null
    }
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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neumorphic">Documentation Matrices</h1>

      {/* Sélecteur de matrice */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-neumorphic">
          Sélectionnez une matrice à afficher :
        </label>
        <select
          value={selectedMatrix}
          onChange={(e) => setSelectedMatrix(e.target.value as MatrixType)}
          className="w-full max-w-md p-3 border rounded-lg bg-neumorphic-bg-light text-neumorphic"
        >
          <option value="">-- Sélectionnez une matrice --</option>
          {matrixOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-neumorphic-bg-light">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Affichage de la matrice sélectionnée */}
      {selectedMatrix && (
        <div className="neumorphic-card p-6 rounded-lg">
          {renderMatrix()}
        </div>
      )}

      {/* Message si aucune matrice sélectionnée */}
      {!selectedMatrix && (
        <div className="neumorphic-card p-6 rounded-lg text-center text-neumorphic-muted">
          Sélectionnez une matrice dans la liste déroulante pour l'afficher.
        </div>
      )}
    </div>
  )
}
