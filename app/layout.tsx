import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gestion des Besoins',
  description: 'Application simple de gestion des besoins',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}
