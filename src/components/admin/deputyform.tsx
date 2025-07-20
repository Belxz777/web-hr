"use client"

import type React from "react"

import { useState } from "react"
import { set } from "zod"
// works 
interface DeputyFormProps {
  onBack: () => void
  onSubmit: (data: { deputyName: string,compulsory:boolean }) => Promise<void>
  loading?: boolean
}
type DeputySend  = {
deputyName: string
compulsory: boolean
}
export default function DeputyForm({ onBack, onSubmit, loading = false }: DeputyFormProps) {
  const [deputy, setDeputy] = useState<DeputySend>({
    deputyName: "",
    compulsory: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (deputy.deputyName.trim()) {
      await onSubmit({
          deputyName: deputy.deputyName.trim(),
          compulsory: deputy.compulsory
      })
      setDeputy({...deputy, deputyName: ""})
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Создание обязанности</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название обязанности *</label>
          <input
            type="text"
            placeholder="Введите название обязанности"
            value={deputy.deputyName}
            onChange={(e) =>  setDeputy({...deputy, deputyName: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading}
          />
          
                    <div className="flex items-center mt-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer"
                        checked={deputy.compulsory}
                        onChange={(e) => setDeputy({...deputy, compulsory: e.target.checked})}
                         />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">Обязательная</span>
                      </label>
                    </div>
          
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
          disabled={loading || !deputy.deputyName.trim()}
        >
          {loading ? "Создание..." : "Создать обязанность"}
        </button>
      </form>
    </div>
  )
}
