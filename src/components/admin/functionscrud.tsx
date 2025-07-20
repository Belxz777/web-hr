"use client"

import type React from "react"

import { useState } from "react"
import type { Deputy } from "./index"

interface FunctionFormProps {
  deputies: Deputy[]
  onBack: () => void
  onSubmit: (data: { funcName: string; consistent: number }) => Promise<void>
  loading?: boolean
}

export default function FunctionForm({ deputies, onBack, onSubmit, loading = false }: FunctionFormProps) {
  const [funcName, setFuncName] = useState("")
  const [consistent, setConsistent] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (funcName.trim() && consistent > 0) {
      await onSubmit({
        funcName: funcName.trim(),
        consistent,
      })
      setFuncName("")
      setConsistent(0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Создание функции </h2>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Состоит в обязанности:*</label>
          <select
            value={consistent}
            onChange={(e) => setConsistent(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading}
          >
            <option value={0}>Выберите обязанность</option>
            {deputies.map((deputy) => (
              <option key={deputy.deputyId} value={deputy.deputyId}>
                {deputy.deputyName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          disabled={loading || !funcName.trim() || consistent === 0}
        >
          {loading ? "Создание..." : "Создать функцию"}
        </button>
      </form>
    </div>
  )
}
