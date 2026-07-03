'use client'

import { useState, useEffect } from 'react'
import BesoinForm from '@/components/BesoinForm'
import BesoinList from '@/components/BesoinList'
import type { Besoin, BesoinFormData } from '@/types/besoin'

export default function Home() {
  const [besoins, setBesoins] = useState<Besoin[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBesoin, setEditingBesoin] = useState<Besoin | null>(null)

  const API_URL = 'http://localhost:8000/besoins'

  useEffect(() => {
    fetchBesoins()
  }, [])

  const fetchBesoins = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setBesoins(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: BesoinFormData) => {
    try {
      if (editingBesoin) {
        // Update existing besoin
        const response = await fetch(`${API_URL}/${editingBesoin.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const updatedBesoin = await response.json()
        setBesoins(besoins.map(b => b.id === editingBesoin.id ? updatedBesoin : b))
      } else {
        // Create new besoin
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        const newBesoin = await response.json()
        setBesoins([...besoins, newBesoin])
      }
      setShowForm(false)
      setEditingBesoin(null)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setBesoins(besoins.filter(b => b.id !== id))
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleEdit = (besoin: Besoin) => {
    setEditingBesoin(besoin)
    setShowForm(true)
  }

  if (loading) return <div className="p-4">Chargement...</div>

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Gestion des Besoins</h1>
        
        <button
          onClick={() => {
            setEditingBesoin(null)
            setShowForm(!showForm)
          }}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? 'Annuler' : 'Ajouter un besoin'}
        </button>

        {showForm && (
          <BesoinForm
            besoin={editingBesoin}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingBesoin(null)
            }}
          />
        )}

        <BesoinList
          besoins={besoins}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  )
}
