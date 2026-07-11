'use client'

import { useState } from 'react'

type Suggestion = {
  field: 'titre' | 'description'
  oldValue: string
  newValue: string
  checked: boolean
}

type AIImprovementModalProps = {
  title: string
  suggestions: Suggestion[]
  onClose: () => void
  onApply: (selectedSuggestions: Suggestion[]) => void
}

export default function AIImprovementModal({ title, suggestions, onClose, onApply }: AIImprovementModalProps) {
  const [checkedSuggestions, setCheckedSuggestions] = useState<Suggestion[]>(suggestions)

  // Gérer la sélection/désélection d'une suggestion
  const toggleSuggestion = (index: number) => {
    setCheckedSuggestions((prev) => {
      const newSuggestions = [...prev]
      newSuggestions[index] = {
        ...newSuggestions[index],
        checked: !newSuggestions[index].checked,
      }
      return newSuggestions
    })
  }

  // Appliquer les suggestions sélectionnées
  const handleApply = () => {
    const selected = checkedSuggestions.filter((s) => s.checked)
    onApply(selected)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="neumorphic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neumorphic">Suggestions d'amélioration IA</h2>
            <button
              onClick={onClose}
              className="text-neumorphic-muted hover:text-neumorphic text-2xl"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-neumorphic-muted mb-6">
            L'IA a analysé <span className="font-medium text-neumorphic">{title}</span> et propose les améliorations suivantes. 
            Cochez celles que vous souhaitez appliquer.
          </p>

          {/* Liste des suggestions */}
          <div className="space-y-4 mb-6">
            {checkedSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${
                  suggestion.checked 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-neumorphic-border bg-neumorphic-bg-light'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={suggestion.checked}
                    onChange={() => toggleSuggestion(index)}
                    className="mt-1 w-4 h-4 accent-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neumorphic-muted">
                        {suggestion.field === 'titre' ? '📝 Titre' : '📄 Description'}
                      </span>
                    </div>
                    <div className="text-sm text-neumorphic-muted line-through mb-1">
                      Ancienne valeur : {suggestion.oldValue || '(vide)'}
                    </div>
                    <div className="font-medium text-neumorphic">
                      Nouvelle valeur : {suggestion.newValue}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={toggleAll}
              className="text-sm text-blue-400 hover:underline"
            >
              {checkedSuggestions.every((s) => s.checked) ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-neumorphic-bg-light text-neumorphic-muted rounded hover:bg-neumorphic-border"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                disabled={checkedSuggestions.filter((s) => s.checked).length === 0}
                className={`px-4 py-2 rounded ${
                  checkedSuggestions.filter((s) => s.checked).length === 0
                    ? 'bg-green-900/30 text-green-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                Valider ({checkedSuggestions.filter((s) => s.checked).length} sélectionnée(s))
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
