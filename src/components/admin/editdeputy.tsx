"use client"

import type React from "react"
import { useState } from "react"
import type { Deputy, Functions } from "./index"

interface EditDeputyFormProps {
  deputy: Deputy
  allFunctions: Functions[]
  onBack: () => void
  onSubmit: (data: { id: number; deputy_functions: number[] }) => Promise<void>
  loading?: boolean
}

export default function EditDeputyForm({
  deputy,
  allFunctions,
  onBack,
  onSubmit,
  loading = false,
}: EditDeputyFormProps) {
  // Получаем ID функций из deputy_functions
  const currentFunctionIds = deputy.deputy_functions.map((f) => f.funcId)
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>(currentFunctionIds)

  const toggleFunctionSelection = (funcId: number) => {
    setSelectedFunctions((prev) => (prev.includes(funcId) ? prev.filter((id) => id !== funcId) : [...prev, funcId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      id: deputy.deputyId,
      deputy_functions: selectedFunctions,
    })
  }

  // Фильтруем функции, которые связаны с этой обязанностью (consistent = deputyId)
  const relatedFunctions = allFunctions.filter((func) => func.consistent === deputy.deputyId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Редактирование обязанности: {deputy.deputyName}</h2>
      </div>

      <div className="p-4 bg-gray-50 border rounded">
        <div className="text-sm text-gray-600">ID: {deputy.deputyId}</div>
        <div className="text-sm text-gray-600">Название: {deputy.deputyName}</div>
        {deputy.deputyDescription && <div className="text-sm text-gray-600">Описание: {deputy.deputyDescription}</div>}
        <div className="text-sm text-gray-600">Статус: {deputy.compulsory ? "Обязательная" : "Необязательная"}</div>
        <div className="text-sm text-gray-600">Текущих функций: {deputy.deputy_functions.length}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Функции данной обязаности:</h3>
          <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded">
            {deputy.deputy_functions.length === 0 ? (
              <div className="text-gray-500 text-sm">Функции не назначены</div>
            ) : (
              deputy.deputy_functions.map((func) => (
                <div key={func.funcId} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <div className="font-medium">{func.funcName}</div>
                    <div className="text-sm text-gray-500">ID: {func.funcId}</div>
                  </div>
                  <div className="text-sm text-green-600">✓ Активна</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Доступные функции (consistent = {deputy.deputyId}):</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded p-3">
            {relatedFunctions.length === 0 ? (
              <div className="text-gray-500 text-sm">
                Нет возможности редактирования. Создайте функции с consistent = {deputy.deputyId}
              </div>
            ) : (
              relatedFunctions.map((func) => (
                <label key={func.funcId} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedFunctions.includes(func.funcId)}
                    onChange={() => toggleFunctionSelection(func.funcId)}
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{func.funcName}</div>
                    <div className="text-sm text-gray-500">
                      ID: {func.funcId} | consistent: {func.consistent}
                    </div>
                  </div>
                  {selectedFunctions.includes(func.funcId) && <div className="text-sm text-green-600">✓ Выбрана</div>}
                </label>
              ))
            )}
          </div>
         
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded"
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
