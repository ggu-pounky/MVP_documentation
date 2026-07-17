'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function TopBar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  // Déterminer la page active pour le titre
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Besoins'
      case '/epics':
        return 'EPICS'
      case '/features':
        return 'Features'
      case '/exigences':
        return 'Exigences'
      case '/tests':
        return 'Tests'
      case '/code':
        return 'Code'
      case '/prd':
        return 'PRD'
      case '/matrices':
        return 'Matrices'
      default:
        return 'Deployments'
    }
  }

  // Filtres spécifiques selon la page
  const getFilters = () => {
    const baseFilters = [
      {
        id: 'branch',
        label: 'All Branches',
        options: ['main', 'preview', 'develop'],
      },
      {
        id: 'author',
        label: 'All Authors',
        options: ['All Authors', 'User 1', 'User 2'],
      },
    ]

    // Ajouter des filtres spécifiques selon la page
    if (pathname === '/tests') {
      baseFilters.push({
        id: 'status',
        label: 'All Status',
        options: ['All', 'A faire', 'En cours', 'Termine', 'Annule', 'Valide'],
      })
    }

    return baseFilters
  }

  const filters = getFilters()

  return (
    <header className="top-bar">
      {/* Titre de la page */}
      <div className="page-title">
        <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
      </div>

      {/* Champ de recherche */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Find"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Filtres */}
      <div className="filters">
        {filters.map((filter) => (
          <select key={filter.id} className="filter-select">
            <option value="">{filter.label}</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ))}

        {/* Filtre de date */}
        <button className="date-range-btn">
          <span>📅</span>
          <span>Select Date Range</span>
        </button>
      </div>

      {/* Badge de statut */}
      <div className="status-badge-container">
        <span className="label">Status</span>
        <span className="status-badge error">6/7</span>
      </div>

      {/* Icône de notifications */}
      <div className="notifications">
        <span>🔔</span>
      </div>
    </header>
  )
}
