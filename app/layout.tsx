import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestion Agile - Besoins, EPICs & USER STORIES',
  description: 'Application de gestion de projet Agile avec Next.js et Supabase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <div className="flex pt-16 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 bg-[rgb(var(--background-start-rgb))]">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
