"use client"

import type React from "react"
import { useState } from "react"
import type { Job, Deputy } from "./index"

interface EditJobFormProps {
  job: Job
  deputies: Deputy[]
  onBack: () => void
  onSubmit: (data: { id: number; deputy: number }) => Promise<void>
  loading?: boolean
}

export default function EditJobForm({ job, deputies, onBack, onSubmit, loading = false }: EditJobFormProps) {
  const [selectedDeputy, setSelectedDeputy] = useState(job.deputy || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      id: job.jobId,
      deputy: selectedDeputy,
    })
  }

  const currentDeputyName = deputies.find((d) => d.deputyId === job.deputy)?.deputyName || "Не назначена"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Редактирование должности: {job.jobName}</h2>
      </div>

      <div className="p-4 bg-gray-50 border rounded">
        <div className="text-sm text-gray-600">ID: {job.jobId}</div>
        <div className="text-sm text-gray-600">Названиe должности: {job.jobName}</div>
        <div className="text-sm text-gray-600">Текущая основная обязанность: {currentDeputyName}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <select
            value={selectedDeputy}
            onChange={(e) => setSelectedDeputy(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value={0}>Не назначена</option>
            {deputies.filter(deputy => deputy.compulsory).map((deputy) => (
              <option key={deputy.deputyId} value={deputy.deputyId}>
                {deputy.deputyName}
                {deputy.deputyDescription && ` - ${deputy.deputyDescription}`}
              </option>
            ))}
          </select>
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
