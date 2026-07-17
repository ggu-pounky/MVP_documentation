'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

type AIImprovementModalProps = {
  isOpen: boolean
  onClose: () => void
  item: any | null
  itemType: string
  onGetSuggestions: (suggestions: Suggestion[]) => void
  onApply: () => void
  suggestions: Suggestion[]
}

// Générer des suggestions d'amélioration basées sur l'item
const generateImprovementSuggestions = (item: any, itemType: string): Suggestion[] => {
  if (!item) return []

  const suggestions: Suggestion[] = []

  // Suggestions pour le titre
  if (item.titre) {
    suggestions.push({
      field: 'titre',
      oldValue: item.titre,
      newValue: `Amélioration: ${item.titre}`,
      checked: false,
    })
  }

  // Suggestions pour la description
  if (item.description) {
    suggestions.push({
      field: 'description',
      oldValue: item.description,
      newValue: `${item.description} (amélioré par IA)`,
      checked: false,
    })
  }

  // Suggestions spécifiques par type
  switch (itemType) {
    case 'EPIC':
      suggestions.push({
        field: 'description',
        oldValue: item.description || '',
        newValue: `EPIC: ${item.titre}. ${item.description || 'Description détaillée à ajouter.'}`,
        checked: true,
      })
      break
    case 'Feature':
      suggestions.push({
        field: 'titre',
        oldValue: item.titre,
        newValue: `Feature: ${item.titre}`,
        checked: true,
      })
      break
    case 'Exigence':
      suggestions.push({
        field: 'titre',
        oldValue: item.titre,
        newValue: `Exigence: ${item.titre}`,
        checked: true,
      })
      break
    case 'Test':
      suggestions.push({
        field: 'titre',
        oldValue: item.titre,
        newValue: `Test: ${item.titre}`,
        checked: true,
      })
      break
  }

  return suggestions
}

export default function AIImprovementModal({
  isOpen,
  onClose,
  item,
  itemType,
  onGetSuggestions,
  onApply,
  suggestions: externalSuggestions,
}: AIImprovementModalProps) {
  const [checkedSuggestions, setCheckedSuggestions] = useState<Suggestion[]>(externalSuggestions)
  const modalRef = useRef<HTMLDivElement>(null)

  // Mettre à jour les suggestions lorsque l'item change
  useEffect(() => {
    if (item && externalSuggestions.length === 0) {
      const generated = generateImprovementSuggestions(item, itemType)
      onGetSuggestions(generated)
      setCheckedSuggestions(generated)
    } else if (externalSuggestions.length > 0) {
      setCheckedSuggestions(externalSuggestions)
    }
  }, [item, itemType, externalSuggestions, onGetSuggestions])

  // Gérer la sélection/désélection d'une suggestion
  const toggleSuggestion = useCallback((index: number) => {
    setCheckedSuggestions((prev) => {
      const newSuggestions = [...prev]
      newSuggestions[index] = {
        ...newSuggestions[index],
        checked: !newSuggestions[index].checked,
      }
      return newSuggestions
    })
  }, [])

  // Appliquer les suggestions sélectionnées
  const handleApply = () => {
    onApply()
    onClose()
  }

  // Sélectionner/désélectionner toutes les suggestions
  const toggleAll = () => {
    const allChecked = checkedSuggestions.every((s) => s.checked)
    setCheckedSuggestions((prev) =>
      prev.map((s) => ({
        ...s,
        checked: !allChecked,
      }))
    )
  }

  // Fermer le modal en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="neumorphic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto" ref={modalRef}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neumorphic">🤖 Amélioration IA</h2>
            <button
              onClick={onClose}
              className="neumorphic-button p-2 hover:bg-red-500/20"
            >
              ❌
            </button>
          </div>

          <div className="mb-4">
            <p className="text-neumorphic-muted">
              {itemType}: <span className="text-neumorphic font-medium">{item?.titre || 'Inconnu'}</span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-neumorphic-muted mb-4">
              L&apos;IA a généré {checkedSuggestions.length} suggestions d&apos;amélioration.
              Sélectionnez celles que vous souhaitez appliquer.
            </p>

            <div className="flex gap-2 mb-4">
              <button
                onClick={toggleAll}
                className="neumorphic-button px-4 py-2 text-sm"
              >
                {checkedSuggestions.every((s) => s.checked) ? 'Désélectionner tout' : 'Tout sélectionner'}
              </button>
            </div>

            <div className="space-y-3">
              {checkedSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`neumorphic-card p-4 ${suggestion.checked ? 'border-l-4 border-green-500' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={suggestion.checked}
                      onChange={() => toggleSuggestion(index)}
                      className="mt-1 w-5 h-5"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-neumorphic">
                          {suggestion.field === 'titre' ? 'Titre' : 'Description'}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${suggestion.checked ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                          {suggestion.checked ? '✅ Sélectionné' : '❌ Non sélectionné'}
                        </span>
                      </div>
                      <div className="text-sm text-neumorphic-muted mt-1">
                        <strong>Ancienne valeur:</strong> {suggestion.oldValue || 'Aucune'}
                      </div>
                      <div className="text-sm text-neumorphic mt-1">
                        <strong>Nouvelle valeur:</strong> {suggestion.newValue}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="neumorphic-button px-6 py-2 bg-gray-500/20 hover:bg-gray-500/40 text-neumorphic-muted"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                className="neumorphic-button px-6 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-300"
              >
                ✅ Appliquer les améliorations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
