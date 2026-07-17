'use client'

import { useState, useEffect } from 'react'
import DataTable from '@/components/DataTable'
import type { Exigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'

type CodeFunction = {
  id: string
  name: string
  description: string
  file: string
  line: number
  codeSnippet?: string
}

export default function CodePage() {
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [codeFunctions, setCodeFunctions] = useState<CodeFunction[]>([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const handleAddCodeFunction = () => {
    const newFunction: CodeFunction = {
      id: generateId(),
      name: 'newFunction',
      description: 'Description de la nouvelle fonction',
      file: 'src/file.ts',
      line: 1,
      codeSnippet: 'function newFunction() { }',
    }
    setCodeFunctions([...codeFunctions, newFunction])
    showNotification('Fonction ajoutée avec succès !')
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

  // Définir les colonnes du tableau
  const columns = [
    {
      key: 'name',
      header: 'Nom',
      sortable: true,
      render: (func: CodeFunction) => (
        <div className="font-medium text-gray-800">{func.name}</div>
      ),
    },
    {
      key: 'file',
      header: 'Fichier',
      sortable: true,
      render: (func: CodeFunction) => (
        <div className="text-gray-600 text-sm">
          {func.file}:{func.line}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      sortable: false,
      render: (func: CodeFunction) => (
        <div className="text-gray-600 text-sm">
          {func.description}
        </div>
      ),
    },
    {
      key: 'code',
      header: 'Code',
      sortable: false,
      render: (func: CodeFunction) => (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {func.codeSnippet}
        </pre>
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

      {/* Tableau des fonctions de code */}
      <div>
        <DataTable
          data={codeFunctions}
          columns={columns}
          onAdd={handleAddCodeFunction}
          title="Fonctions de Code"
          emptyMessage="Aucune fonction de code enregistrée. Cliquez sur 'Ajouter' pour commencer."
        />
      </div>

      {codeFunctions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-800">Matching Code ↔ Exigences</h2>
          </div>
          <div className="space-y-3">
            {codeFunctions.map((func) => {
              const randomExigence = exigences[Math.floor(Math.random() * exigences.length)]
              const randomFeature = features[Math.floor(Math.random() * features.length)]
              return (
                <div key={func.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{func.name}</div>
                      <div className="text-sm text-gray-500">{func.file}:{func.line}</div>
                      <div className="text-sm text-gray-600 mt-1">{func.description}</div>
                    </div>
                    <div className="flex gap-2">
                      {randomExigence && (
                        <span className="env-badge">
                          {randomFeature?.titre || 'Feature'} &gt; {randomExigence.titre}
                        </span>
                      )}
                      <span className="status-badge in-table ready">
                        Matché
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
