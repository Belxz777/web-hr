"use client"

import type React from "react"

import { useState } from "react"

interface DepartmentFormProps {
  onBack: () => void
  onSubmit: (data: { name: string; description: string }) => Promise<void>
  loading?: boolean
}

export default function DepartmentForm({ onBack, onSubmit, loading = false }: DepartmentFormProps) {
  const [departmentName, setDepartmentName] = useState("")
  const [departmentDescription, setDepartmentDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (departmentName.trim()) {
      await onSubmit({
        name: departmentName.trim(),
        description: departmentDescription.trim(),
      })
      setDepartmentName("")
      setDepartmentDescription("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Создание отдела</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название отдела *</label>
          <input
            type="text"
            placeholder="Введите название отдела"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание отдела</label>
          <textarea
            placeholder="Введите описание отдела"
            value={departmentDescription}
            onChange={(e) => setDepartmentDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-20"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          disabled={loading || !departmentName.trim()}
        >
          {loading ? "Создание..." : "Создать отдел"}
        </button>
      </form>
    </div>
  )
}
