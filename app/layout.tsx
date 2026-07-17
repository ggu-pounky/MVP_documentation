import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { migrateAllLocalStorageData } from '@/utils/dataMigration'

export const metadata: Metadata = {
  title: 'MVP Documentation - Neumorphic Design',
  description: 'Application de gestion des besoins, épics, features et exigences avec design neomorphique professionnel',
}

// Appliquer la migration des données au chargement initial
if (typeof window !== 'undefined') {
  migrateAllLocalStorageData()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased bg-neumorphic min-h-screen dark:bg-neumorphic dark:text-neumorphic">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 bg-neumorphic-light dark:bg-neumorphic-light">
            <div className="neumorphic-card p-6 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
// Force redeploy: 1783754037
