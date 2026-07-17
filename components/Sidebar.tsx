'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const isActive = (path: string) => pathname === path

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const loadSampleData = () => {
    try {
      const now = new Date().toISOString()

      // Besoin
      const besoin = {
        id: generateId(),
        titre: 'Automatiser la gestion des réservations pour un hôtel en ligne',
        description: 'Permettre aux clients de réserver, modifier ou annuler une chambre, et aux gestionnaires de suivre les disponibilités en temps réel',
        statut: 'A faire',
        created_at: now,
        updated_at: now,
      }

      // EPICS
      const epics = [
        {
          id: generateId(),
          titre: 'Gestion des réservations clients',
          description: 'Permettre aux clients de réserver, modifier ou annuler une chambre.',
          besoinId: besoin.id,
          statut: 'A faire',
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Gestion des disponibilités',
          description: 'Permettre aux gestionnaires de suivre et mettre à jour les disponibilités.',
          besoinId: besoin.id,
          statut: 'A faire',
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Paiement et facturation',
          description: 'Intégrer un système de paiement sécurisé et générer des factures automatiques.',
          besoinId: besoin.id,
          statut: 'A faire',
          created_at: now,
          updated_at: now,
        },
      ]

      // Features
      const features = [
        {
          id: generateId(),
          titre: 'Réservation d’une chambre',
          description: 'Permettre à un client de sélectionner une chambre et de confirmer une réservation.',
          priorite: 'Elevee',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[0].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Modification d’une réservation',
          description: 'Permettre à un client de modifier les dates ou le type de chambre.',
          priorite: 'Elevee',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[0].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Annulation d’une réservation',
          description: 'Permettre à un client d’annuler une réservation avec remboursement si applicable.',
          priorite: 'Elevee',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[0].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Calendrier des disponibilités',
          description: 'Afficher un calendrier interactif pour visualiser les disponibilités.',
          priorite: 'Moyenne',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[1].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Notifications de disponibilité',
          description: 'Envoyer des notifications aux gestionnaires pour les chambres disponibles.',
          priorite: 'Faible',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[1].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Intégration Stripe',
          description: 'Intégrer Stripe pour les paiements en ligne sécurisés.',
          priorite: 'Elevee',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[2].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Génération de factures',
          description: 'Générer automatiquement des factures après chaque réservation.',
          priorite: 'Moyenne',
          statut: 'A faire',
          besoinId: besoin.id,
          epicId: epics[2].id,
          created_at: now,
          updated_at: now,
        },
      ]

      // Exigences
      const exigences = [
        {
          id: generateId(),
          titre: 'Sélection de chambre',
          description: 'L’utilisateur doit pouvoir sélectionner une chambre parmi celles disponibles.',
          type: 'Fonctionnelle',
          statut: 'A faire',
          featureId: features[0].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Confirmation de réservation',
          description: 'L’utilisateur doit recevoir une confirmation par email après réservation.',
          type: 'Fonctionnelle',
          statut: 'A faire',
          featureId: features[0].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Paiement sécurisé',
          description: 'Le système doit garantir des transactions sécurisées.',
          type: 'Non fonctionnelle',
          statut: 'A faire',
          featureId: features[5].id,
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Facture PDF',
          description: 'Le système doit générer une facture au format PDF.',
          type: 'Technique',
          statut: 'A faire',
          featureId: features[6].id,
          created_at: now,
          updated_at: now,
        },
      ]

      // Tests
      const tests = [
        {
          id: generateId(),
          titre: 'Test de sélection de chambre',
          description: 'Vérifier que l’utilisateur peut sélectionner une chambre disponible.',
          type: 'Unitaire',
          statut: 'A faire',
          exigenceId: exigences[0].id,
          isTNR: false,
          isAutomatisable: true,
          priorite: 'Elevee',
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Test de confirmation email',
          description: 'Vérifier que l’email de confirmation est envoyé après réservation.',
          type: 'Integration',
          statut: 'A faire',
          exigenceId: exigences[1].id,
          isTNR: false,
          isAutomatisable: true,
          priorite: 'Moyenne',
          created_at: now,
          updated_at: now,
        },
        {
          id: generateId(),
          titre: 'Test de paiement Stripe',
          description: 'Vérifier que le paiement via Stripe fonctionne correctement.',
          type: 'E2E',
          statut: 'A faire',
          exigenceId: exigences[2].id,
          isTNR: true,
          isAutomatisable: true,
          priorite: 'Elevee',
          created_at: now,
          updated_at: now,
        },
      ]

      // Sauvegarder dans localStorage
      localStorage.setItem('besoins', JSON.stringify([besoin]))
      localStorage.setItem('epics', JSON.stringify(epics))
      localStorage.setItem('features', JSON.stringify(features))
      localStorage.setItem('exigences', JSON.stringify(exigences))
      localStorage.setItem('tests', JSON.stringify(tests))

      showNotification('Données d\'exemple chargées avec succès !', 'success')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const clearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
      localStorage.removeItem('besoins')
      localStorage.removeItem('epics')
      localStorage.removeItem('features')
      localStorage.removeItem('exigences')
      localStorage.removeItem('tests')
      showNotification('Toutes les données ont été supprimées', 'success')
    }
  }

  return (
    <div className={`neumorphic-sidebar w-64 min-h-screen p-4 transition-all duration-300 ${!isExpanded ? 'w-16' : ''}`}>
      <div className="flex flex-col h-full">
        {/* Logo / Toggle */}
        <div className="flex items-center justify-between mb-8">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-neumorphic">📋 MVP Docs</span>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="neumorphic-button p-2 rounded-lg"
          >
            <span>{isExpanded ? '◀' : '▶'}</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            href="/"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>🎯</span>
              {isExpanded && <span>Besoins</span>}
            </span>
          </Link>

          <Link
            href="/epics"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/epics') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>🏔️</span>
              {isExpanded && <span>EPICS</span>}
            </span>
          </Link>

          <Link
            href="/features"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/features') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>🔧</span>
              {isExpanded && <span>Features</span>}
            </span>
          </Link>

          <Link
            href="/exigences"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/exigences') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>📋</span>
              {isExpanded && <span>Exigences</span>}
            </span>
          </Link>

          <Link
            href="/tests"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/tests') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>🧪</span>
              {isExpanded && <span>Tests</span>}
            </span>
          </Link>

          <Link
            href="/code"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/code') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>💻</span>
              {isExpanded && <span>Code</span>}
            </span>
          </Link>

          <Link
            href="/prd"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/prd') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>📄</span>
              {isExpanded && <span>PRD</span>}
            </span>
          </Link>

          <Link
            href="/matrices"
            className={`neumorphic-link block p-3 rounded-lg ${isActive('/matrices') ? 'active' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span>🔗</span>
              {isExpanded && <span>Matrices</span>}
            </span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-neumorphic-border">
          <button
            onClick={loadSampleData}
            className="neumorphic-button w-full p-3 rounded-lg flex items-center justify-center gap-2"
          >
            <span>📥</span>
            {isExpanded && <span>Charger données exemple</span>}
          </button>
          <button
            onClick={clearAllData}
            className="neumorphic-button w-full p-3 rounded-lg flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/40"
          >
            <span>🗑️</span>
            {isExpanded && <span>Tout supprimer</span>}
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 left-4 neumorphic-card p-4 notification-slide-in z-50 ${
            notification.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  )
}
