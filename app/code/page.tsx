'use client'

import { useState, useEffect } from 'react'
import CodeAnalyzer from '@/components/CodeAnalyzer'

export default function CodePage() {
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
        <h1 className="text-2xl font-bold text-neumorphic mb-2">Analyse du Code Source</h1>
        <p className="text-neumorphic-muted">Analysez et visualisez votre code source depuis GitHub</p>
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
        <CodeAnalyzer onError={(error) => showNotification(error, 'error')} />
      </div>
    </div>
  )
}
