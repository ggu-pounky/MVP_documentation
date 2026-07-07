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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Suggestions d'amélioration IA</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            L'IA a analysé {title} et propose les améliorations suivantes. 
            Cochez celles que vous souhaitez appliquer.
          </p>

          {/* Liste des suggestions */}
          <div className="space-y-4 mb-6">
            {checkedSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg ${suggestion.checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={suggestion.checked}
                    onChange={() => toggleSuggestion(index)}
                    className="mt-1 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        {suggestion.field === 'titre' ? '📝 Titre' : '📄 Description'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 line-through mb-1">
                      Ancienne valeur : {suggestion.oldValue || '(vide)'}
                    </div>
                    <div className="font-medium">
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
              className="text-sm text-blue-500 hover:underline"
            >
              {checkedSuggestions.every((s) => s.checked) ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                disabled={checkedSuggestions.filter((s) => s.checked).length === 0}
                className={`px-4 py-2 rounded ${
                  checkedSuggestions.filter((s) => s.checked).length === 0
                    ? 'bg-green-200 text-green-400 cursor-not-allowed'
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
