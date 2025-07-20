"use client"

import { useState } from "react"
import type { Deputy, Functions } from "./index"

interface DeputyManagementProps {
  deputy: Deputy
  functions: Functions[]
  onBack: () => void
  onAddFunction: (name: string) => void
  onDeleteFunction: (funcId: number) => void
}

export default function DeputyManagement({
  deputy,
  functions,
  onBack,
  onAddFunction,
  onDeleteFunction,
}: DeputyManagementProps) {
  const [newFunctionName, setNewFunctionName] = useState("")

  const handleAddFunction = () => {
    if (newFunctionName.trim()) {
      onAddFunction(newFunctionName.trim())
      setNewFunctionName("")
    }
  }

  // Получаем функции, которые принадлежат этой обязанности (consistent = deputyId)
  const deputyFunctions = functions.filter((func) => func.consistent === deputy.deputyId)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600">
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Управление обязанностью: {deputy.deputyName}</h2>
      </div>

      <div className="p-3 bg-gray-50 border">
        <div className="text-sm text-gray-600">ID: {deputy.deputyId}</div>
        <div className="text-sm text-gray-600">Описание: {deputy.deputyDescription}</div>
        <div className="text-sm text-gray-600">Статус: {deputy.compulsory ? "Обязательная" : "Необязательная"}</div>
        <div className="text-sm text-gray-600">Функций в deputy_functions: {deputy.deputy_functions.length}</div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold">Добавить функцию (Functions):</h3>
        <input
          type="text"
          placeholder="Название функции (funcName)"
          value={newFunctionName}
          onChange={(e) => setNewFunctionName(e.target.value)}
          className="w-full p-2 border border-gray-300"
        />
        <button onClick={handleAddFunction} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700">
          Добавить функцию
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">Функции (consistent = {deputy.deputyId}):</h3>
        {deputyFunctions.map((func) => (
          <div key={func.funcId} className="flex items-start justify-between p-3 border border-gray-200">
            <div>
              <div className="font-medium">{func.funcName}</div>
              <div className="text-sm text-gray-600">funcId: {func.funcId}</div>
              <div className="text-sm text-gray-600">consistent: {func.consistent}</div>
            
            </div>
            <button
              onClick={() => onDeleteFunction(func.funcId)}
              className="px-2 py-1 text-sm bg-red-100 hover:bg-red-200"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
