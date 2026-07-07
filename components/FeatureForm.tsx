'use client'

import { useState, useEffect } from 'react'
import type { Feature, FeatureFormData } from '@/types/feature'
import { priorites, statutsFeature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'

type FeatureFormProps = {
  feature?: Feature | null
  besoins: Besoin[]
  epics?: Epic[]  // Ajout des EPICS pour le sélecteur
  onSubmit: (data: FeatureFormData) => Promise<void>
  onCancel: () => void
  onImproveAI?: (feature: Feature) => void  // Nouvelle prop pour l'amélioration IA
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
    'Réservation': 'réserver une chambre ou un service',
    'Modification': 'modifier mes informations',
    'Annulation': 'annuler une action',
    'Paiement': 'effectuer un paiement sécurisé',
    'Gestion': 'gérer mes données',
    'Affichage': 'visualiser les informations',
    'Création': 'créer un nouvel élément',
    'Validation': 'valider une action',
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
    'Réservation': 'réserver',
    'Modification': 'modifier',
    'Annulation': 'annuler',
    'Paiement': 'effectuer le paiement',
    'Gestion': 'gérer',
    'Affichage': 'afficher',
    'Création': 'créer',
    'Validation': 'valider',
  }
  
  for (const [key, value] of Object.entries(actions)) {
    if (titre.toLowerCase().includes(key.toLowerCase())) {
      return value + ' ' + titre.toLowerCase()
    }
  }
  return titre.toLowerCase()
}

export default function FeatureForm({ feature, besoins, epics = [], onSubmit, onCancel, onImproveAI }: FeatureFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [priorite, setPriorite] = useState<'Faible' | 'Moyenne' | 'Élevée' | 'Critique'>('Moyenne')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé'>('À faire')
  const [besoinId, setBesoinId] = useState('')
  const [epicId, setEpicId] = useState<string | null>(null)

  useEffect(() => {
    if (feature) {
      setTitre(feature.titre)
      setDescription(feature.description || '')
      setPriorite(feature.priorite)
      setStatut(feature.statut)
      setBesoinId(feature.besoinId)
      setEpicId(feature.epicId || null)
    } else {
      setTitre('')
      setDescription('')
      setPriorite('Moyenne')
      setStatut('À faire')
      setBesoinId('')
      setEpicId(null)
    }
  }, [feature])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!besoinId) {
      alert('Veuillez sélectionner un besoin')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      priorite,
      statut,
      besoinId,
      epicId,
    })
  }

  // Filtrer les EPICS par besoin sélectionné
  const epicsForSelectedBesoin = besoinId ? epics.filter((e) => e.besoinId === besoinId) : []

  // Fonction pour améliorer la description avec IREB
  const handleImproveAI = () => {
    if (feature && onImproveAI) {
      onImproveAI(feature)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Besoin *</label>
        <select
          value={besoinId}
          onChange={(e) => {
            setBesoinId(e.target.value)
            setEpicId(null) // Réinitialiser l'EPIC si le besoin change
          }}
          required
          className="w-full p-2 border rounded"
          disabled={!!feature} // Désactiver si on modifie une feature existante
        >
          <option value="">-- Sélectionnez un besoin --</option>
          {besoins.map((besoin) => (
            <option key={besoin.id} value={besoin.id}>
              {besoin.titre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">EPIC (optionnel)</label>
        <select
          value={epicId || ''}
          onChange={(e) => setEpicId(e.target.value || null)}
          className="w-full p-2 border rounded"
          disabled={!besoinId || !!feature} // Désactiver si on modifie une feature existante
        >
          <option value="">-- Aucune EPIC --</option>
          {epicsForSelectedBesoin.map((epic) => (
            <option key={epic.id} value={epic.id}>
              {epic.titre}
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
        <label className="block text-sm font-medium mb-1">Priorité</label>
        <select
          value={priorite}
          onChange={(e) => setPriorite(e.target.value as 'Faible' | 'Moyenne' | 'Élevée' | 'Critique')}
          className="w-full p-2 border rounded"
        >
          {priorites.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Statut</label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé')}
          className="w-full p-2 border rounded"
        >
          {statutsFeature.map((s) => (
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
          {feature ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton Amélioration IA (visible uniquement en mode modification) */}
        {onImproveAI && feature && (
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
