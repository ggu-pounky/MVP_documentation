import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'MVP Documentation - Neumorphic Design',
  description: 'Application de gestion des besoins et features avec design neomorphique professionnel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-neumorphic min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6 bg-neumorphic-light">{children}</main>
        </div>
      </body>
    </html>
  )
}
