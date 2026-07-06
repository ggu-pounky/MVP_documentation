'use client'

import { useState, useEffect, useRef } from 'react'
import FeatureForm from '@/components/FeatureForm'
import FeatureList from '@/components/FeatureList'
import FeatureAIGeneratorModal from '@/components/FeatureAIGeneratorModal'
import type { Feature, FeatureFormData } from '@/types/feature'
import type { Besoin } from '@/types/besoin'

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [selectedBesoinForAI, setSelectedBesoinForAI] = useState<Besoin | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedBesoins = localStorage.getItem('besoins')
    const savedFeatures = localStorage.getItem('features')
    
    if (savedBesoins) {
      setBesoins(JSON.parse(savedBesoins))
    }
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures))
    }
    setLoading(false)
  }, [])

  // Sauvegarder les features dans localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('features', JSON.stringify(features))
    }
  }, [features, loading])

  // Générer un ID unique
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Ouvrir la modale de génération IA pour un besoin spécifique
  const openAIGenerator = (besoin: Besoin) => {
    setSelectedBesoinForAI(besoin)
    setShowAIGenerator(true)
  }

  // Générer des features à partir des suggestions IA
  const handleGenerateFromAI = (generatedFeatures: { titre: string; description: string }[]) => {
    if (!selectedBesoinForAI) return

    const newFeatures: Feature[] = generatedFeatures.map((featureData) => ({
      id: generateId(),
      titre: featureData.titre,
      description: featureData.description,
      priorite: 'Moyenne', // Priorité par défaut
      statut: 'À faire',   // Statut par défaut
      besoinId: selectedBesoinForAI.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    setFeatures([...features, ...newFeatures])
    showNotification(`${newFeatures.length} Feature(s) générée(s) avec succès !`)
    setShowAIGenerator(false)
    setSelectedBesoinForAI(null)
  }

  const handleSubmit = async (data: FeatureFormData) => {
    try {
      if (editingFeature) {
        // Mettre à jour une feature existante
        setFeatures(
          features.map((f) =>
            f.id === editingFeature.id
              ? {
                  ...f,
                  titre: data.titre,
                  description: data.description,
                  priorite: data.priorite,
                  statut: data.statut,
                  besoinId: data.besoinId,
                  updated_at: new Date().toISOString(),
                }
              : f
          )
        )
        showNotification('Feature modifiée avec succès !')
      } else {
        // Créer une nouvelle feature
        const newFeature: Feature = {
          id: generateId(),
          titre: data.titre,
          description: data.description,
          priorite: data.priorite,
          statut: data.statut,
          besoinId: data.besoinId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setFeatures([...features, newFeature])
        showNotification('Feature créée avec succès !')
        // Scroll vers la liste après création
        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
      setShowForm(false)
      setEditingFeature(null)
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setFeatures(features.filter((f) => f.id !== id))
      showNotification('Feature supprimée avec succès !')
    } catch (error) {
      console.error('Erreur:', error)
      showNotification('Une erreur est survenue', 'error')
    }
  }

  const handleEdit = (feature: Feature) => {
    setEditingFeature(feature)
    setShowForm(true)
  }

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Features</h1>
        {/* Bouton Génération IA (visible si des besoins existent) */}
        {besoins.length > 0 && (
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                const besoinId = e.target.value
                if (besoinId) {
                  const besoin = besoins.find((b) => b.id === besoinId)
                  if (besoin) openAIGenerator(besoin)
                }
              }}
              defaultValue=""
              className="p-2 border rounded"
            >
              <option value="" disabled>
                Génération IA pour...
              </option>
              {besoins.map((besoin) => (
                <option key={besoin.id} value={besoin.id}>
                  {besoin.titre}
                </option>
              ))}
            </select>
          </div>
        )}
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

      {/* Bouton pour ajouter une feature (désactivé si aucun besoin) */}
      <button
        onClick={() => {
          if (besoins.length === 0) {
            showNotification('Veuillez d\'abord créer un besoin', 'error')
            return
          }
          setEditingFeature(null)
          setShowForm(!showForm)
        }}
        disabled={besoins.length === 0}
        className={`mb-4 px-4 py-2 rounded ${
          besoins.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showForm ? 'Annuler' : 'Ajouter une Feature'}
      </button>

      {showForm && (
        <FeatureForm
          feature={editingFeature}
          besoins={besoins}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setEditingFeature(null)
          }}
        />
      )}

      {/* Liste des features avec référence pour le scroll */}
      <div ref={listRef}>
        <FeatureList
          features={features}
          besoins={besoins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modale de génération IA */}
      {showAIGenerator && (
        <FeatureAIGeneratorModal
          besoin={selectedBesoinForAI}
          onClose={() => {
            setShowAIGenerator(false)
            setSelectedBesoinForAI(null)
          }}
          onGenerate={handleGenerateFromAI}
        />
      )}
    </div>
  )
}
