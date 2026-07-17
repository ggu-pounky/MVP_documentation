'use client'

import { useState, useEffect } from 'react'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'
import type { Test } from '@/types/test'

export default function PRDPage() {
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

  const getStats = () => {
    const totalBesoins = besoins.length
    const totalEpics = epics.length
    const totalFeatures = features.length
    const totalExigences = exigences.length
    const totalTests = tests.length

    const completedBesoins = besoins.filter((b) => b.statut === 'Termine').length
    const completedEpics = epics.filter((e) => e.statut === 'Termine').length
    const completedFeatures = features.filter((f) => f.statut === 'Termine').length
    const completedExigences = exigences.filter((e) => e.statut === 'Termine' || e.statut === 'Valide').length
    const completedTests = tests.filter((t) => t.statut === 'Termine' || t.statut === 'Valide').length

    const inProgressBesoins = besoins.filter((b) => b.statut === 'En cours').length
    const inProgressEpics = epics.filter((e) => e.statut === 'En cours').length
    const inProgressFeatures = features.filter((f) => f.statut === 'En cours').length

    return {
      total: {
        besoins: totalBesoins,
        epics: totalEpics,
        features: totalFeatures,
        exigences: totalExigences,
        tests: totalTests,
      },
      completed: {
        besoins: completedBesoins,
        epics: completedEpics,
        features: completedFeatures,
        exigences: completedExigences,
        tests: completedTests,
      },
      inProgress: {
        besoins: inProgressBesoins,
        epics: inProgressEpics,
        features: inProgressFeatures,
      },
    }
  }

  const stats = getStats()

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="card">
        <div className="card-header">
          <h1 className="text-xl font-semibold text-gray-800">Product Requirements Document (PRD)</h1>
          <p className="text-muted">Vue d&apos;ensemble du projet et progression</p>
        </div>
      </div>

      {/* Statistiques Générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <div className="text-3xl font-bold text-gray-800">{stats.total.besoins}</div>
          <div className="text-muted text-sm mt-1">Besoins</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-success rounded-full"
              style={{ width: `${getProgressPercentage(stats.completed.besoins, stats.total.besoins)}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-2">
            {getProgressPercentage(stats.completed.besoins, stats.total.besoins)}% complétés
          </div>
        </div>

        <div className="card">
          <div className="text-3xl font-bold text-gray-800">{stats.total.epics}</div>
          <div className="text-muted text-sm mt-1">EPICS</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-success rounded-full"
              style={{ width: `${getProgressPercentage(stats.completed.epics, stats.total.epics)}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-2">
            {getProgressPercentage(stats.completed.epics, stats.total.epics)}% complétés
          </div>
        </div>

        <div className="card">
          <div className="text-3xl font-bold text-gray-800">{stats.total.features}</div>
          <div className="text-muted text-sm mt-1">Features</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-warning rounded-full"
              style={{ width: `${getProgressPercentage(stats.completed.features, stats.total.features)}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-2">
            {getProgressPercentage(stats.completed.features, stats.total.features)}% complétés
          </div>
        </div>

        <div className="card">
          <div className="text-3xl font-bold text-gray-800">{stats.total.exigences}</div>
          <div className="text-muted text-sm mt-1">Exigences</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-primary rounded-full"
              style={{ width: `${getProgressPercentage(stats.completed.exigences, stats.total.exigences)}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-2">
            {getProgressPercentage(stats.completed.exigences, stats.total.exigences)}% complétés
          </div>
        </div>

        <div className="card">
          <div className="text-3xl font-bold text-gray-800">{stats.total.tests}</div>
          <div className="text-muted text-sm mt-1">Tests</div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-purple-500 rounded-full"
              style={{ width: `${getProgressPercentage(stats.completed.tests, stats.total.tests)}%` }}
            />
          </div>
          <div className="text-xs text-muted mt-2">
            {getProgressPercentage(stats.completed.tests, stats.total.tests)}% complétés
          </div>
        </div>
      </div>

      {/* Progression par Type */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Progression par Type</h2>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Besoins', completed: stats.completed.besoins, total: stats.total.besoins },
            { label: 'EPICS', completed: stats.completed.epics, total: stats.total.epics },
            { label: 'Features', completed: stats.completed.features, total: stats.total.features },
            { label: 'Exigences', completed: stats.completed.exigences, total: stats.total.exigences },
            { label: 'Tests', completed: stats.completed.tests, total: stats.total.tests },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-800">{item.label}</span>
                <span className="text-muted">
                  {item.completed}/{item.total} ({getProgressPercentage(item.completed, item.total)}%)
                </span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full">
                <div
                  className="h-4 bg-primary rounded-full"
                  style={{ width: `${getProgressPercentage(item.completed, item.total)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé Textuel */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Résumé du Projet</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-medium mb-2 text-gray-800">📊 Statistiques</h3>
            <p>
              <strong>Total:</strong> {stats.total.besoins + stats.total.epics + stats.total.features + stats.total.exigences + stats.total.tests} éléments
            </p>
            <p>
              <strong>Complétés:</strong> {stats.completed.besoins + stats.completed.epics + stats.completed.features + stats.completed.exigences + stats.completed.tests} (
              {getProgressPercentage(
                stats.completed.besoins + stats.completed.epics + stats.completed.features + stats.completed.exigences + stats.completed.tests,
                stats.total.besoins + stats.total.epics + stats.total.features + stats.total.exigences + stats.total.tests
              )}%)
            </p>
            <p>
              <strong>En cours:</strong> {stats.inProgress.besoins + stats.inProgress.epics + stats.inProgress.features}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-gray-800">🎯 Prochaines Étapes</h3>
            {stats.inProgress.besoins > 0 && (
              <p className="text-success">✅ {stats.inProgress.besoins} besoin(s) en cours de finalisation</p>
            )}
            {stats.inProgress.epics > 0 && (
              <p className="text-success">✅ {stats.inProgress.epics} EPIC(s) en cours de développement</p>
            )}
            {stats.inProgress.features > 0 && (
              <p className="text-success">✅ {stats.inProgress.features} feature(s) en cours d&apos;implémentation</p>
            )}
            {stats.inProgress.besoins === 0 && stats.inProgress.epics === 0 && stats.inProgress.features === 0 && (
              <p className="text-success">🎉 Tous les éléments sont terminés ou à faire !</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
