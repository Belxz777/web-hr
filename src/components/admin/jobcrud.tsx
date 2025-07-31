"use client"

import type React from "react"

import { useState } from "react"
import type { Deputy } from "./index"
// works
interface JobFormProps {
  onBack: () => void
  onSubmit: (data: { name: string; pre_positioned: number }) => Promise<void>
  loading?: boolean
}

export default function JobForm({ onBack, onSubmit, loading = false }: JobFormProps) {
  const [jobName, setJobName] = useState("")
  const [selectedLevel, setSelectedLevel] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (jobName.trim()) {
      await onSubmit({
        name: jobName.trim(),
        pre_positioned: selectedLevel,
      })
      setJobName("")
      setSelectedLevel(0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Создание должности</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название должности *</label>
          <input
            type="text"
            placeholder="Введите название должности"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-gray-700">Выбрать новую основную обязанность должности:</label>
            <span className="text-sm text-gray-600">
              <span className="cursor-help relative group">
                <span className="text-gray-500">?</span>
                <span className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  отображаются только compulsory=true
                </span>
              </span>
            </span>
          </div>
    <input 
    type="number"
    value={selectedLevel}
    onChange={(e) => setSelectedLevel(Number(e.target.value))}>
    </input>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          disabled={loading || !jobName.trim()}
        >
          {loading ? "Создание..." : "Создать должность"}
        </button>
      </form>
    </div>
  )
}
