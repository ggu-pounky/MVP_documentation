import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'

export const metadata: Metadata = {
  title: 'MVP Documentation - Deployment Dashboard',
  description: 'Tableau de bord de gestion des déploiements avec design moderne',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <TopBar />
            <div className="table-container">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
