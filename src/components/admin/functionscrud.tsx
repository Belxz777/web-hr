"use client"

import type React from "react"
import { useState } from "react"

interface FunctionFormProps {
  onBack: () => void
  onSubmit: (data: { name: string; is_main: boolean; description?: string }) => Promise<void>
  loading?: boolean

}

export default function FunctionForm({ onBack, onSubmit, loading = false}: FunctionFormProps) {
  const [funcName, setFuncName] = useState("")
  const [description, setDescription] = useState("")
  const [isMain, setIsMain] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (funcName.trim() ) {
      await onSubmit({
        name: funcName.trim(),
        description,
        is_main: isMain,
      })
      setFuncName("")
      setDescription("")
      setIsMain(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Создание функции</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название функции *</label>
          <input
            type="text"
            placeholder="Введите название функции"
            value={funcName}
            onChange={(e) => setFuncName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание функции</label>
          <textarea
            placeholder="Введите описание функции"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded  bg-transparent"
            rows={3}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип функции *</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isMain}
              onChange={(e) => setIsMain(e.target.checked)}
              className="mr-2"
              disabled={loading}
            />
            <span>Основная?</span>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          disabled={loading || !funcName.trim() }
        >
          {loading ? "Создание..." : "Создать функцию"}
        </button>
      </form> 
    </div>
  )
}
