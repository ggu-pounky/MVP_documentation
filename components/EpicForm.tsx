'use client'

import { useState, useEffect } from 'react'
import type { Epic, EpicFormData } from '@/types/epic'
import { statutsEpic } from '@/types/epic'
import type { Besoin } from '@/types/besoin'

type EpicFormProps = {
  epic?: Epic | null
  besoins: Besoin[]
  onSubmit: (data: EpicFormData) => Promise<void>
  onCancel: () => void
  onImproveAI?: (epic: Epic) => void  // Nouvelle prop pour l'amélioration IA
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
    'Gestion des réservations': 'simplifier la gestion des réservations',
    'Gestion des disponibilités': 'optimiser l\'utilisation des ressources',
    'Paiement et facturation': 'faciliter les transactions financières',
    'Authentification': 'sécuriser l\'accès à l\'application',
    'Catalogue': 'visualiser les produits disponibles',
    'Panier': 'finaliser mes achats',
    'Commande': 'suivre mes achats',
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
    'Gestion': 'gérer',
    'Création': 'créer',
    'Modification': 'modifier',
    'Suppression': 'supprimer',
    'Affichage': 'afficher',
    'Validation': 'valider',
    'Paiement': 'effectuer le paiement',
    'Réservation': 'réserver',
  }
  
  for (const [key, value] of Object.entries(actions)) {
    if (titre.toLowerCase().includes(key.toLowerCase())) {
      return value + ' ' + titre.toLowerCase()
    }
  }
  return titre.toLowerCase()
}

export default function EpicForm({ epic, besoins, onSubmit, onCancel, onImproveAI }: EpicFormProps) {
  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [statut, setStatut] = useState<'À faire' | 'En cours' | 'Terminé' | 'Annulé'>('À faire')
  const [besoinId, setBesoinId] = useState('')

  useEffect(() => {
    if (epic) {
      setTitre(epic.titre)
      setDescription(epic.description || '')
      setStatut(epic.statut)
      setBesoinId(epic.besoinId)
    } else {
      setTitre('')
      setDescription('')
      setStatut('À faire')
      setBesoinId('')
    }
  }, [epic])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!besoinId) {
      alert('Veuillez sélectionner un besoin')
      return
    }
    await onSubmit({
      titre,
      description: description || null,
      statut,
      besoinId,
    })
  }

  // Fonction pour améliorer la description avec IREB
  const handleImproveAI = () => {
    if (epic && onImproveAI) {
      onImproveAI(epic)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Besoin *</label>
        <select
          value={besoinId}
          onChange={(e) => setBesoinId(e.target.value)}
          required
          className="w-full p-2 border rounded"
          disabled={!!epic} // Désactiver si on modifie une EPIC existante
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
          onChange={(e) => setStatut(e.target.value as 'À faire' | 'En cours' | 'Terminé' | 'Annulé')}
          className="w-full p-2 border rounded"
        >
          {statutsEpic.map((s) => (
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
          {epic ? 'Modifier' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
        {/* Bouton Amélioration IA (visible uniquement en mode modification) */}
        {onImproveAI && epic && (
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
