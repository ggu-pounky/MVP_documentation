'use client'

import { useState, useEffect, useRef } from 'react'
import type { Besoin } from '@/types/besoin'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'
import type { PRDEditableData } from '@/types/prd'

export default function PRDPage() {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [loading, setLoading] = useState(true)
  const [editableData, setEditableData] = useState<PRDEditableData>({
    titre: 'Product Requirements Document (PRD)',
    description: 'Ce document décrit les exigences pour le produit en développement.',
    objectifs: [
      'Répondre aux besoins utilisateurs identifiés',
      'Livrer une solution scalable et maintenable',
      'Assurer une expérience utilisateur fluide',
    ],
    publicCible: 'Tous les utilisateurs finaux du produit',
    hypotheses: [
      'Les utilisateurs ont besoin d\'une solution simple pour gérer leurs tâches',
      'La solution proposée résout un problème critique',
    ],
    metriquesSucces: [
      'Taux d\'adoption de 80% dans les 3 premiers mois',
      'Réduction de 50% du temps passé sur les tâches cibles',
      'Score de satisfaction utilisateur > 4.5/5',
    ],
  })
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const prdRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedFeatures = localStorage.getItem('features')
    const savedExigences = localStorage.getItem('exigences')
    const savedPRDEditable = localStorage.getItem('prd_editable')

    if (savedBesoins) setBesoins(JSON.parse(savedBesoins))
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures))
    if (savedExigences) setExigences(JSON.parse(savedExigences))
    if (savedPRDEditable) setEditableData(JSON.parse(savedPRDEditable))

    setLoading(false)
  }, [])

  // Sauvegarder les données modifiables dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('prd_editable', JSON.stringify(editableData))
    }
  }, [editableData, loading])

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Générer le contenu du PRD
  const generatePRDContent = () => {
    // Organiser les données par Besoin → Features → Exigences
    const besoinsWithFeatures = besoins.map((besoin) => {
      const besoinFeatures = features.filter((f) => f.besoinId === besoin.id)
      const featuresWithExigences = besoinFeatures.map((feature) => {
        const featureExigences = exigences.filter((e) => e.featureId === feature.id)
        return { feature, exigences: featureExigences }
      })
      return { besoin, features: featuresWithExigences }
    })

    return {
      editableData,
      besoinsWithFeatures,
    }
  }

  // Télécharger le PRD en Markdown
  const downloadPRD = () => {
    const { editableData, besoinsWithFeatures } = generatePRDContent()

    let markdownContent = `# ${editableData.titre}\n\n`
    markdownContent += `## Description\n${editableData.description}\n\n`

    markdownContent += `## Objectifs\n`
    editableData.objectifs.forEach((objectif, index) => {
      markdownContent += `${index + 1}. ${objectif}\n`
    })
    markdownContent += '\n'

    markdownContent += `## Public Cible\n${editableData.publicCible}\n\n`

    markdownContent += `## Hypothèses\n`
    editableData.hypotheses.forEach((hypothese, index) => {
      markdownContent += `${index + 1}. ${hypothese}\n`
    })
    markdownContent += '\n'

    markdownContent += `## Métriques de Succès\n`
    editableData.metriquesSucces.forEach((metrique, index) => {
      markdownContent += `${index + 1}. ${metrique}\n`
    })
    markdownContent += '\n'

    markdownContent += `## Besoins, Features et Exigences\n\n`
    besoinsWithFeatures.forEach(({ besoin, features: featuresWithExigences }) => {
      markdownContent += `### ${besoin.titre}\n\n`
      markdownContent += `**Statut:** ${besoin.statut}\n`
      markdownContent += `**Description:** ${besoin.description || '-'}\n\n`

      featuresWithExigences.forEach(({ feature, exigences: featureExigences }) => {
        markdownContent += `#### Feature: ${feature.titre}\n\n`
        markdownContent += `- **Priorité:** ${feature.priorite}\n`
        markdownContent += `- **Statut:** ${feature.statut}\n`
        markdownContent += `- **Description:** ${feature.description || '-'}\n\n`

        if (featureExigences.length > 0) {
          markdownContent += `**Exigences:**\n`
          featureExigences.forEach((exigence) => {
            markdownContent += `- [ ] ${exigence.titre} (Statut: ${exigence.statut})\n`
            if (exigence.description) {
              markdownContent += `  - ${exigence.description}\n`
            }
          })
          markdownContent += '\n'
        }
      })
    })

    // Créer un blob et déclencher le téléchargement
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PRD_${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showNotification('PRD téléchargé avec succès !')
  }

  // Mettre à jour un champ modifiable
  const handleEditableChange = (field: keyof PRDEditableData, value: string | string[]) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Ajouter un élément à une liste
  const handleAddToList = (field: 'objectifs' | 'hypotheses' | 'metriquesSucces') => {
    setEditableData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }))
  }

  // Mettre à jour un élément d'une liste
  const handleUpdateListItem = (field: 'objectifs' | 'hypotheses' | 'metriquesSucces', index: number, value: string) => {
    setEditableData((prev) => {
      const newList = [...prev[field]]
      newList[index] = value
      return { ...prev, [field]: newList }
    })
  }

  // Supprimer un élément d'une liste
  const handleRemoveFromList = (field: 'objectifs' | 'hypotheses' | 'metriquesSucces', index: number) => {
    setEditableData((prev) => {
      const newList = prev[field].filter((_, i) => i !== index)
      return { ...prev, [field]: newList }
    })
  }

  if (loading) return <div className="p-4">Chargement...</div>

  const { besoinsWithFeatures } = generatePRDContent()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Requirements Document (PRD)</h1>
        <button
          onClick={downloadPRD}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          📥 Télécharger PRD
        </button>
      </div>

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

      <div ref={prdRef} className="bg-white p-6 rounded shadow">
        {/* Section Titre */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Titre du PRD</label>
          <input
            type="text"
            value={editableData.titre}
            onChange={(e) => handleEditableChange('titre', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Section Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={editableData.description}
            onChange={(e) => handleEditableChange('description', e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Section Objectifs */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Objectifs</label>
            <button
              onClick={() => handleAddToList('objectifs')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {editableData.objectifs.map((objectif, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={objectif}
                  onChange={(e) => handleUpdateListItem('objectifs', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder={`Objectif ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveFromList('objectifs', index)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section Public Cible */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Public Cible</label>
          <textarea
            value={editableData.publicCible}
            onChange={(e) => handleEditableChange('publicCible', e.target.value)}
            className="w-full p-2 border rounded"
            rows={2}
          />
        </div>

        {/* Section Hypothèses */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Hypothèses</label>
            <button
              onClick={() => handleAddToList('hypotheses')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {editableData.hypotheses.map((hypothese, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={hypothese}
                  onChange={(e) => handleUpdateListItem('hypotheses', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder={`Hypothèse ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveFromList('hypotheses', index)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section Métriques de Succès */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Métriques de Succès</label>
            <button
              onClick={() => handleAddToList('metriquesSucces')}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              + Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {editableData.metriquesSucces.map((metrique, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={metrique}
                  onChange={(e) => handleUpdateListItem('metriquesSucces', index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder={`Métrique ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveFromList('metriquesSucces', index)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section Besoins, Features et Exigences (non modifiable) */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Besoins, Features et Exigences</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ces données sont générées automatiquement à partir des Besoins, Features et Exigences existants.
          </p>

          {besoinsWithFeatures.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
              <p>Aucun besoin, feature ou exigence enregistré.</p>
              <p className="mt-2 text-sm">
                Créez des besoins, features et exigences pour générer le contenu du PRD.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {besoinsWithFeatures.map(({ besoin, features: featuresWithExigences }) => (
                <div key={besoin.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{besoin.titre}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Statut:</strong> {besoin.statut}
                  </p>
                  {besoin.description && (
                    <p className="text-sm text-gray-600 mb-4"><strong>Description:</strong> {besoin.description}</p>
                  )}

                  <h4 className="font-medium mt-4 mb-2">Features:</h4>
                  {featuresWithExigences.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucune feature pour ce besoin.</p>
                  ) : (
                    <div className="space-y-4 pl-4">
                      {featuresWithExigences.map(({ feature, exigences: featureExigences }) => (
                        <div key={feature.id} className="border-l-2 border-gray-200 pl-4">
                          <h5 className="font-medium">{feature.titre}</h5>
                          <p className="text-sm text-gray-600">
                            <strong>Priorité:</strong> {feature.priorite} | <strong>Statut:</strong> {feature.statut}
                          </p>
                          {feature.description && (
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                          )}

                          <h6 className="font-medium mt-2 mb-1">Exigences:</h6>
                          {featureExigences.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Aucune exigence pour cette feature.</p>
                          ) : (
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {featureExigences.map((exigence) => (
                                <li key={exigence.id}>
                                  {exigence.titre} (<span className="text-gray-500">{exigence.statut}</span>)
                                  {exigence.description && (
                                    <p className="text-xs text-gray-500 mt-1 pl-4">{exigence.description}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
