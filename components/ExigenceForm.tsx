'use client'

import { useState, useEffect } from 'react'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import { statutsExigence } from '@/types/exigence'
import type { Feature } from '@/types/feature'

type FeatureInfo = {
  id: string
  besoinTitre: string
  titre: string
  description?: string
}

type ExigenceFormProps = {
  exigence?: Exigence | null
  features: FeatureInfo[]
  onSubmit: (data: ExigenceFormData) => Promise<void>
  onCancel: () => void
  onImproveAI?: (exigence: Exigence) => void  // Nouvelle prop pour l'amélioration IA
}

// Fonction pour améliorer une description selon les règles IREB
const improveWithIREB = (currentDescription: string, titre: string): string => {
  // Si la description est déjà au format IREB, on la conserve
  if (currentDescription.includes('User Story:') || currentDescription.includes('Critères d\'acceptation:')) {
    return currentDescription
  }

  // Sinon, on génère une description au format IREB
  return `User Story: En tant qu'utilisateur, je veux ${titre.toLowerCase()}, afin de ${getBenefitFromTitre(titre)}.
Critères d'acceptation:
1. Le système doit permettre de ${getActionFromTitre(titre)}.
2. Les données doivent être validées avant ${getActionFromTitre(titre).split(' ')[0]}.
3. Une confirmation visuelle doit être affichée après ${getActionFromTitre(titre).split(' ')[0]}.
4. Les erreurs doivent être gérées et affichées clairement.`
}

// Fonctions utilitaires pour générer des phrases IREB
const getBenefitFromTitre = (titre: string): string => {
  const benefits: Record<string, string> = {
    'Sélectionner': 'choisir une option',
    'Ajouter': 'ajouter un élément',
    'Confirmer': 'valider une action',
    'Valider': 'confirmer une information',
    'Afficher': 'visualiser les données',
    'Gérer': 'gérer les informations',
    'Créer': 'créer un nouvel élément',
    'Modifier': 'modifier une information',
  }
  
  for (const [key, value] of Object.entries(benefits)) {
    if (titre.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return 'répondre à mes besoins'
}

const getActionFromTitre = (titre: string): string => {
  const actions: Record<string, string> = {
    'Sélectionner': 'sélectionner',
    'Ajouter': 'ajouter',
    'Confirmer': 'confirmer',
    'Valider': 'valider',
    'Afficher': 'afficher',
    'Gérer': 'gérer',
    'Créer': 'créer',
    'Modifier': 'modifier',
  }
  
  for (const [key, value] of Object.entries(actions)) {
    if (titre.toLowerCase().includes(key.toLowerCase())) {
      return value + ' ' + titre.toLowerCase()
    }
  }
  return titre.toLowerCase()
}

export default function ExigenceForm({ exigence, features, onSubmit, onCancel, onImproveAI }: ExigenceFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé'>('À faire')
  const [featureId, setFeatureId] = useState('')

  useEffect(() => {
    if (exigence) {
      setTitre(exigence.titre)
      setDescription(exigence.description || '')
      setStatut(exigence.statut)
      setFeatureId(exigence.featureId)
    } else {
      setTitre('')
      setDescription('')
      setStatut('À faire')
      setFeatureId('')
    }
  }, [exigence])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!featureId) {
      alert('Veuillez sélectionner une Feature')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      statut,
      featureId,
    })
  }

  // Trouver la feature sélectionnée
  const selectedFeature = features.find((f) => f.id === featureId)

  // Fonction pour améliorer la description avec IREB
  const handleImproveAI = () => {
    if (exigence && onImproveAI) {
      onImproveAI(exigence)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Feature *</label>
        <select
          value={featureId}
          onChange={(e) => setFeatureId(e.target.value)}
          required
          className="w-full p-2 border rounded"
          disabled={!!exigence} // Désactiver si on modifie une exigence existante
        >
          <option value="">-- Sélectionnez une Feature --</option>
          {features.map((feature) => (
            <option key={feature.id} value={feature.id}>
              {feature.besoinTitre} - {feature.titre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Titre *</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé' | 'Validé')}
          className="w-full p-2 border rounded"
        >
          {statutsExigence.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {exigence ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton Amélioration IA (visible uniquement en mode modification) */}
        {onImproveAI && exigence && (
          <button
            type="button"
            onClick={handleImproveAI}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Amélioration IA
          </button>
        )}
      </div>
    </form>
  )
}
