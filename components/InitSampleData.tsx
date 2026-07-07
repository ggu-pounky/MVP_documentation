'use client'

import { useEffect } from 'react'
import type { Besoin } from '@/types/besoin'
import type { Epic } from '@/types/epic'
import type { Feature } from '@/types/feature'
import type { Exigence } from '@/types/exigence'

export default function InitSampleData() {
  useEffect(() => {
    // Vérifier si les données existent déjà
    const hasBesoins = localStorage.getItem('besoins')
    const hasEpics = localStorage.getItem('epics')
    const hasFeatures = localStorage.getItem('features')
    const hasExigences = localStorage.getItem('exigences')

    // Si des données existent déjà, ne pas écraser
    if (hasBesoins || hasEpics || hasFeatures || hasExigences) {
      return
    }

    // Générer un ID unique
    const generateId = (): string => {
      return Date.now().toString(36) + Math.random().toString(36).substring(2)
    }

    const now = new Date().toISOString()

    // Besoin
    const besoin: Besoin = {
      id: generateId(),
      titre: 'Automatiser la gestion des réservations pour un hôtel en ligne',
      description: 'Permettre aux clients de réserver, modifier ou annuler une chambre, et aux gestionnaires de suivre les disponibilités en temps réel',
      statut: 'À faire',
      created_at: now,
      updated_at: now,
    }

    // EPICS
    const epics: Epic[] = [
      {
        id: generateId(),
        titre: 'Gestion des réservations clients',
        description: 'Permettre aux clients de réserver, modifier ou annuler une chambre.',
        besoinId: besoin.id,
        statut: 'À faire',
        created_at: now,
        updated_at: now,
      },
      {
        id: generateId(),
        titre: 'Gestion des disponibilités',
        description: 'Permettre aux gestionnaires de suivre et mettre à jour les disponibilités.',
        besoinId: besoin.id,
        statut: 'À faire',
        created_at: now,
        updated_at: now,
      },
      {
        id: generateId(),
        titre: 'Paiement et facturation',
        description: 'Intégrer un système de paiement sécurisé et générer des factures automatiques.',
        besoinId: besoin.id,
        statut: 'À faire',
        created_at: now,
        updated_at: now,
      },
    ]

    // Features
    const features: Feature[] = [
      {
        id: generateId(),
        titre: 'Réservation d’une chambre',
        description: 'Permettre à un client de sélectionner une chambre et de confirmer une réservation.',
        priorite: 'Élevée',
        statut: 'À faire',
        besoinId: besoin.id,
        epicId: epics[0].id,
        created_at: now,
        updated_at: now,
      },
      {
        id: generateId(),
        titre: 'Modification d’une réservation',
        description: 'Permettre à un client de modifier les dates ou le type de chambre.',
        priorite: 'Élevée',
        statut: 'À faire',
        besoinId: besoin.id,
        epicId: epics[0].id,
        created_at: now,
        updated_at: now,
      },
      {
        id: generateId(),
        titre: 'Annulation d’une réservation',
        description: 'Permettre à un client d’annuler une réservation avec remboursement si applicable.',
        priorite: 'Élevée',
        statut: 'À faire',
        besoinId: besoin.id,
        epicId: epics[0].id,
        created_at: now,
        updated_at: now,
      },
    ]

    // Exigences (pour F01 - Réservation d'une chambre)
    const exigences: Exigence[] = [
      {
        id: generateId(),
        titre: 'Sélectionner une chambre disponible',
        description: 'User Story: En tant que client, je veux voir la liste des chambres disponibles pour une date donnée, afin de choisir celle qui me convient. Critères d\'acceptation: 1. Le système affiche les chambres disponibles pour les dates sélectionnées. 2. Les chambres indisponibles sont masquées ou grisées. 3. Les informations affichées incluent: type de chambre, prix, photo, et disponibilité. 4. Le filtre par date fonctionne en temps réel (sans rechargement de page).',
        statut: 'À faire',
        featureId: features[0].id,
        created_at: now,
        updated_at: now,
      },
      {
        id: generateId(),
        titre: 'Ajouter une chambre au panier',
        description: 'User Story: En tant que client, je veux ajouter une chambre à mon panier pour finaliser ma réservation plus tard. Critères d\'acceptation: 1. Le bouton "Ajouter au panier" est visible pour chaque chambre disponible. 2. Le panier affiche le nombre d\'articles et le total mis à jour. 3. Une confirmation visuelle (ex: pop-up) apparaît après l\'ajout.',
        statut: 'À faire',
        featureId: features[0].id,
        created_at: now,
        updated_at: now,
      },
      {
        id: generateId(),
        titre: 'Confirmer la réservation',
        description: 'User Story: En tant que client, je veux confirmer ma réservation en renseignant mes coordonnées et mon moyen de paiement, afin de recevoir une confirmation par email. Critères d\'acceptation: 1. Le formulaire de confirmation inclut: nom, email, numéro de téléphone, et moyen de paiement. 2. Le système valide les champs obligatoires (ex: email valide). 3. Un email de confirmation est envoyé immédiatement après paiement. 4. La chambre devient indisponible pour les autres clients après confirmation.',
        statut: 'À faire',
        featureId: features[0].id,
        created_at: now,
        updated_at: now,
      },
    ]

    // Sauvegarder dans localStorage
    localStorage.setItem('besoins', JSON.stringify([besoin]))
    localStorage.setItem('epics', JSON.stringify(epics))
    localStorage.setItem('features', JSON.stringify(features))
    localStorage.setItem('exigences', JSON.stringify(exigences))
    localStorage.setItem('tests', JSON.stringify([]))
  }, [])

  return null
}
