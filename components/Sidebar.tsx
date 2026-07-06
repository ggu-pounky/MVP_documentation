'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">MVP Documentation</h1>
      </div>
      <nav className="space-y-2 flex-1">
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isActive('/') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <span>📜</span>
          <span>Besoins</span>
        </Link>
        <Link
          href="/epics"
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isActive('/epics') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <span>📜</span>
          <span>EPICS</span>
        </Link>
        <Link
          href="/features"
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isActive('/features') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <span>🚀</span>
          <span>Features</span>
        </Link>
        <Link
          href="/exigences"
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isActive('/exigences') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <span>📋</span>
          <span>Exigences</span>
        </Link>
        <Link
          href="/tests"
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isActive('/tests') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <span>🧪</span>
          <span>Tests</span>
        </Link>
        {/* PRD link moved up - removed mt-auto to bring it higher */}
        <Link
          href="/prd"
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            isActive('/prd') ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <span>📄</span>
          <span>PRD</span>
        </Link>
      </nav>
    </aside>
  )
}
