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
        statut: 'À faire',
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
      const features = [
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
      const exigences = [
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

      // Déclencher un événement personnalisé pour notifier les pages
      window.dispatchEvent(new Event('storage'))

      showNotification('Données d\'exemple chargées avec succès !', 'success')
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      showNotification('Erreur lors du chargement des données', 'error')
    }
  }

  // Récupérer le numéro de version (hash du commit)
  const version = process.env.NEXT_PUBLIC_VERSION || 'preview'

  return (
    <aside className={`neumorphic-sidebar w-64 text-white min-h-screen p-4 flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className={`text-xl font-bold text-neumorphic ${!isExpanded && 'hidden'}`}>
            MVP Documentation
          </h1>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="neumorphic-button p-2 rounded-full hover:bg-neumorphic-highlight"
          >
            <span>{isExpanded ? '❌' : '☰'}</span>
          </button>
        </div>
      </div>
      
      <nav className="space-y-2 flex-1">
        {/* Bouton de chargement des données */}
        <button
          onClick={loadSampleData}
          className="neumorphic-button w-full flex items-center justify-center gap-2 px-4 py-3 text-left"
        >
          <span>📦</span>
          {isExpanded && <span>Charger données exemple</span>}
        </button>
        
        {/* Séparation */}
        <hr className="border-neumorphic my-3" />
        
        {/* Module Exigence */}
        {isExpanded && (
          <div className="px-4 py-2 text-xs font-medium text-neumorphic-muted uppercase tracking-wider">
            Module Exigence
          </div>
        )}
        
        {/* Séparation */}
        <hr className="border-neumorphic my-2" />
        
        {/* Module Code */}
        {isExpanded && (
          <div className="px-4 py-2 text-xs font-medium text-neumorphic-muted uppercase tracking-wider">
            Module Code
          </div>
        )}
        
        {/* Séparation */}
        <hr className="border-neumorphic my-2" />
        
        {/* Module Test */}
        {isExpanded && (
          <div className="px-4 py-2 text-xs font-medium text-neumorphic-muted uppercase tracking-wider">
            Module Test
          </div>
        )}
        
        {/* Séparation */}
        <hr className="border-neumorphic my-2" />
        
        {/* Module Maintenance */}
        {isExpanded && (
          <div className="px-4 py-2 text-xs font-medium text-neumorphic-muted uppercase tracking-wider">
            Module Maintenance
          </div>
        )}
        
        {/* Séparation */}
        <hr className="border-neumorphic my-2" />
        
        {/* Liens du menu */}
        <Link
          href="/"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/') ? 'active' : ''}`}
        >
          <span>📋</span>
          {isExpanded && <span>Besoins</span>}
        </Link>
        
        <Link
          href="/epics"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/epics') ? 'active' : ''}`}
        >
          <span>🗺️</span>
          {isExpanded && <span>EPICS</span>}
        </Link>
        
        <Link
          href="/features"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/features') ? 'active' : ''}`}
        >
          <span>🚀</span>
          {isExpanded && <span>Features</span>}
        </Link>
        
        <Link
          href="/code"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/code') ? 'active' : ''}`}
        >
          <span>💻</span>
          {isExpanded && <span>Code</span>}
        </Link>
        
        <Link
          href="/exigences"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/exigences') ? 'active' : ''}`}
        >
          <span>📝</span>
          {isExpanded && <span>Exigences</span>}
        </Link>
        
        <Link
          href="/tests"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/tests') ? 'active' : ''}`}
        >
          <span>🧪</span>
          {isExpanded && <span>Tests</span>}
        </Link>
        
        {/* PRD link */}
        <Link
          href="/prd"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/prd') ? 'active' : ''}`}
        >
          <span>📄</span>
          {isExpanded && (
            <span className="flex flex-col">
              <span className="text-xs text-neumorphic-muted">Documentation</span>
              <span>PRD</span>
            </span>
          )}
        </Link>
        
        {/* Matrices link */}
        <Link
          href="/matrices"
          className={`neumorphic-link flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/matrices') ? 'active' : ''}`}
        >
          <span>📊</span>
          {isExpanded && (
            <span className="flex flex-col">
              <span className="text-xs text-neumorphic-muted">Documentation</span>
              <span>Matrices</span>
            </span>
          )}
        </Link>
      </nav>
      
      {/* Numéro de version en bas du menu */}
      <div className="mt-auto pt-4 border-t border-neumorphic">
        <div className="px-4 py-2 text-xs text-neumorphic-muted text-center">
          {isExpanded ? `Version: ${version}` : version.slice(0, 7)}
        </div>
      </div>
      
      {/* Notification pour le chargement des données */}
      {notification && (
        <div
          className={`fixed bottom-4 left-4 p-4 rounded-lg z-50 notification-slide-in ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
    </aside>
  )
}
