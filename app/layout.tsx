import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import InitSampleData from '@/components/InitSampleData'

export const metadata: Metadata = {
  title: 'Gestion des Besoins et Features',
  description: 'Application de gestion des besoins et features',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50">
            <InitSampleData />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
