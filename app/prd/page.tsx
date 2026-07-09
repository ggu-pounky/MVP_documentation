'use client'

import { useState } from 'react'
import PRDView from '@/components/PRDView'

export default function PRDPage() {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Afficher une notification temporaire
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="neumorphic-card p-6">
        <h1 className="text-2xl font-bold text-neumorphic mb-2">Documentation PRD</h1>
        <p className="text-neumorphic-muted">Product Requirements Document - Spécifications produit complètes</p>
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

      {/* Contenu principal */}
      <div className="neumorphic-card p-6">
        <PRDView />
      </div>
    </div>
  )
}
