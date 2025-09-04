"use client"

import useGetAlldeps from "@/hooks/useDeps"
import { useState } from "react"

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [department, setDepartment] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

  const { deps, loading: depsLoading } = useGetAlldeps()

  const handleDownload = async () => {
    if (!startDate || !endDate || !department) {
      alert("Пожалуйста, заполните все поля")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Дата начала не может быть позже даты окончания")
      return
    }

    setIsDownloading(true)

    try {
      const response = await fetch("/api/reports/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          department,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `report_${department}_${startDate}_${endDate}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error("Ошибка при скачивании отчета")
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("Произошла ошибка при скачивании отчета")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <h1 className="text-xl font-semibold text-center text-gray-900">Скачивание отчета</h1>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Дата начала
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border cursor-pointer border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2  bg-muted "
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                Дата окончания
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 bg-muted text-basic"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Отдел
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={depsLoading}
                className="w-full px-3 py-2 border  border-secondary rounded-md shadow-sm focus:outline-none focus:ring-2  focus:border-secondary-foreground disabled:bg-gray-100"
              >
                <option value="">Выберите отдел</option>
                {deps &&
                  deps.map((dept, index) => (
                    <option key={index} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
              </select>
              {depsLoading && <p className="text-sm text-gray-500">Загрузка отделов...</p>}
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading || !startDate || !endDate || !department}
              className="w-full  bg-secondary disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isDownloading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Скачивание...
                </div>
              ) : (
                "Скачать отчет"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
