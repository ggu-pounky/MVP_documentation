'use client'

import { useState, useEffect, useRef } from 'react'
import ExigenceForm from '@/components/ExigenceForm'
import ExigenceList from '@/components/ExigenceList'
import type { Exigence, ExigenceFormData } from '@/types/exigence'
import type { Feature } from '@/types/feature'
import type { Besoin } from '@/types/besoin'

type FeatureInfo = {
  id: string
  besoinTitre: string
  titre: string
  description?: string
}

export default function ExigencesPage() {
  const [exigences, setExigences] = useState<Exigence[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExigence, setEditingExigence] = useState<Exigence | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  const loadData = () => {
    const savedExigences = localStorage.getItem('exigences')
    const savedFeatures = localStorage.getItem('features')
    const savedBesoins = localStorage.getItem('besoins')
    
    if (savedExigences) {
      setExigences(JSON.parse(savedExigences))
    }
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
    }
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
    // Écouter les changements de localStorage
    const handleStorageChange = () => loadData()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Sauvegarder les exigences dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('exigences', JSON.stringify(exigences))
    }
  }, [exigences, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Convertir les features en FeatureInfo avec le titre du besoin
  const getFeaturesWithBesoinInfo = (): FeatureInfo[] => {
    return features.map((feature) => {
      const besoin = besoins.find((b) => b.id === feature.besoinId)
      return {
        id: feature.id,
        besoinTitre: besoin?.titre || 'Inconnu',
        titre: feature.titre,
        description: feature.description || undefined,
      }
    })
  }

  const handleSubmit = async (data: ExigenceFormData) => {
    try {
      if (editingExigence) {
        // Mettre à jour une exigence existante
        setExigences(
          exigences.map((e) =>
            e.id === editingExigence.id
              ? {
                  ...e,
                  titre: data.titre,
                  description: data.description,
                  statut: data.statut,
                  featureId: data.featureId,
                  updated_at: new Date().toISOString(),
                }
              : e
          )
        )
        showNotification('Exigence modifiée avec succès !')
      } else {
        // Créer une nouvelle exigence
        const newExigence: Exigence = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          statut: data.statut,
          featureId: data.featureId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setExigences([...exigences, newExigence])
        showNotification('Exigence créée avec succès !')
        // Scroll vers la liste après création
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingExigence(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setExigences(exigences.filter((e) => e.id !== id))
      showNotification('Exigence supprimée avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (exigence: Exigence) => {
    setEditingExigence(exigence)
    setShowForm(true)
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

  const featuresWithInfo = getFeaturesWithBesoinInfo()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">Gestion des Exigences</h1>
        <p className="text-neumorphic-muted">Créez, modifiez et gérez vos exigences projet</p>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`neumorphic-card p-4 notification-slide-in ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Bouton pour ajouter une exigence */}
      <button
        onClick={() => {
          if (features.length === 0) {
            showNotification('Veuillez d\'abord créer une feature', 'error')
            return
          }
          setEditingExigence(null)
          setShowForm(!showForm)
        }}
        disabled={features.length === 0}
        className={`neumorphic-button px-6 py-3 flex items-center gap-2 ${features.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>{showForm ? '\u274c' : '\u2795'}</span>
        <span>{showForm ? 'Annuler' : 'Ajouter une Exigence'}</span>
      </button>

      {showForm && (
        <div className="neumorphic-card p-6">
          <ExigenceForm
            exigence={editingExigence}
            features={featuresWithInfo}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingExigence(null)
            }}
          />
        </div>
      )}

      {/* Liste des exigences */}
      <div ref={listRef} className="neumorphic-card p-6">
        <h2 className="text-lg font-semibold text-neumorphic mb-4">Liste des Exigences</h2>
        <ExigenceList
          exigences={exigences}
          features={featuresWithInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
