'use client'

import { useState } from 'react'
import { ReactNode } from 'react'

type MatrixType = 'exigence-code' | 'code-tests' | 'exigence-tests' | 'complete'

const matrixOptions: { value: MatrixType; label: string }[] = [
  { value: 'exigence-code', label: 'Matrice Exigence - Code' },
  { value: 'code-tests', label: 'Matrice Code - Tests' },
  { value: 'exigence-tests', label: 'Matrice Exigence - Tests' },
  { value: 'complete', label: 'Matrice complète' },
]

// Contenu des matrices (ReactNode pour supporter JSX)
const matrixContent: Record<MatrixType, ReactNode> = {
  'exigence-code': (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Matrice Exigence - Code</h3>
      <p className="text-neumorphic-muted">
        Cette matrice montre la couverture des exigences par le code source.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full neumorphic-card border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Exigence</th>
              <th className="py-2 px-4 border">Code associé</th>
              <th className="py-2 px-4 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">Sélectionner une chambre</td>
              <td className="py-2 px-4 border">RoomSelection.tsx</td>
              <td className="py-2 px-4 border">✅ Couvert</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">Ajouter au panier</td>
              <td className="py-2 px-4 border">CartService.ts</td>
              <td className="py-2 px-4 border">✅ Couvert</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">Confirmer la réservation</td>
              <td className="py-2 px-4 border">BookingConfirm.tsx</td>
              <td className="py-2 px-4 border">✅ Couvert</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  'code-tests': (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Matrice Code - Tests</h3>
      <p className="text-neumorphic-muted">
        Cette matrice montre la couverture du code par les tests.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full neumorphic-card border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Code</th>
              <th className="py-2 px-4 border">Tests associés</th>
              <th className="py-2 px-4 border">Couverture</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">RoomSelection.tsx</td>
              <td className="py-2 px-4 border">RoomSelection.test.tsx</td>
              <td className="py-2 px-4 border">95%</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">CartService.ts</td>
              <td className="py-2 px-4 border">CartService.test.ts</td>
              <td className="py-2 px-4 border">85%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  'exigence-tests': (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Matrice Exigence - Tests</h3>
      <p className="text-neumorphic-muted">
        Cette matrice montre la couverture des exigences par les tests.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full neumorphic-card border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Exigence</th>
              <th className="py-2 px-4 border">Tests associés</th>
              <th className="py-2 px-4 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">Sélectionner une chambre</td>
              <td className="py-2 px-4 border">RoomSelection.test.tsx</td>
              <td className="py-2 px-4 border">✅ Testé</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">Ajouter au panier</td>
              <td className="py-2 px-4 border">CartService.test.tsx</td>
              <td className="py-2 px-4 border">✅ Testé</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  'complete': (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Matrice Complète</h3>
      <p className="text-neumorphic-muted">
        Cette matrice combine toutes les relations entre exigences, code et tests.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full neumorphic-card border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Exigence</th>
              <th className="py-2 px-4 border">Code</th>
              <th className="py-2 px-4 border">Tests</th>
              <th className="py-2 px-4 border">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border">Sélectionner une chambre</td>
              <td className="py-2 px-4 border">RoomSelection.tsx</td>
              <td className="py-2 px-4 border">RoomSelection.test.tsx</td>
              <td className="py-2 px-4 border">✅ Complète</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border">Ajouter au panier</td>
              <td className="py-2 px-4 border">CartService.ts</td>
              <td className="py-2 px-4 border">CartService.test.ts</td>
              <td className="py-2 px-4 border">✅ Complète</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
}

export default function MatricesPage() {
  const [selectedMatrix, setSelectedMatrix] = useState<MatrixType | ''>('')

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Documentation Matrices</h1>

      {/* Sélecteur de matrice */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Sélectionnez une matrice à afficher :
        </label>
        <select
          value={selectedMatrix}
          onChange={(e) => setSelectedMatrix(e.target.value as MatrixType)}
          className="w-full max-w-md p-3 border rounded-lg neumorphic-card"
        >
          <option value="">-- Sélectionnez une matrice --</option>
          {matrixOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Affichage de la matrice sélectionnée */}
      {selectedMatrix && (
        <div className="neumorphic-card p-6 rounded-lg ">
          {matrixContent[selectedMatrix]}
        </div>
      )}

      {/* Message si aucune matrice sélectionnée */}
      {!selectedMatrix && (
        <div className="neumorphic-card p-6 rounded-lg text-center text-neumorphic-muted">
          Sélectionnez une matrice dans la liste déroulante pour l'afficher.
        </div>
      )}
    </div>
  )
}
