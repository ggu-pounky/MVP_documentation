'use client'

import { useState } from 'react'

type Column<T> = {
  key: string
  header: string
  render: (item: T) => React.ReactNode
  sortable?: boolean
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
  onAdd?: () => void
  title: string
  emptyMessage: string
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  title,
  emptyMessage,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = [...data]
  if (sortConfig) {
    sortedData.sort((a, b) => {
      const aValue = (a as any)[sortConfig.key]
      const bValue = (b as any)[sortConfig.key]
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(data.map((item) => item.id))
    }
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return '↕'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="btn btn-primary btn-sm">
            ➕ Ajouter
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {onEdit && (
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === data.length && data.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.key} onClick={() => column.sortable && handleSort(column.key)}>
                    <div className="flex items-center gap-1">
                      <span>{column.header}</span>
                      {column.sortable && <span>{getSortIcon(column.key)}</span>}
                    </div>
                  </th>
                ))}
                {onEdit && (
                  <th style={{ width: '120px' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                  {onEdit && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`}>{column.render(item)}</td>
                  ))}
                  {onEdit && (
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="btn btn-secondary btn-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(item.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
