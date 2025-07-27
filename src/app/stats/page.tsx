"use client"

import { useState, useEffect } from "react"
import type { BackendStatus } from "@/types"
import { host } from "@/types"
import { Header } from "@/components/ui/header"
import { Symbol } from "@/components/ui/symbol"
import LogsViewer from "@/components/admin/logsviewer"
import { getLogs } from "@/components/server/admin/getlogs"

export default function SystemStatusPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    return `${days}д ${hours}ч ${minutes}м ${secs}с`
  }

  const fetchBackendStatus = async () => {
    try {
      const response = await fetch("/api/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "no-cors",
      })
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`)
      }
      const data = await response.json()
      setBackendStatus(data)
      setError(null)
    } catch (err) {
      console.error("Ошибка при получении данных:", err)
      setError(err instanceof Error ? err.message : "Произошла ошибка при получении данных")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

const fetchLogs = async (type: string) => {
  try {
    const data  = await getLogs(type)
    setLogs(data)
  }
  catch (err) {
    console.error("Ошибка при получении данных:", err)
    setError(err instanceof Error ? err.message : "Произошла ошибка при получении данных")
  }
}
  useEffect(() => {
    fetchBackendStatus()
  }, [])

  const refreshData = () => {
    setIsRefreshing(true)
    fetchBackendStatus()
  }

  const MetricBar = ({
    label,
    value,
    max = 100,
    unit = "%",
  }: { label: string; value: number; max?: number; unit?: string }) => {
    const percentage = (value / max) * 100

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-[#6D6D6D]">{label}</span>
          <span className="text-sm font-semibold text-[#000000]">
            {value}
            {unit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              percentage > 80 ? "bg-[#FF0000]" : percentage > 60 ? "bg-yellow-500" : "bg-[#249BA2]"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm text-center max-w-md w-full mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#249BA2] mx-auto mb-6"></div>
          <p className="text-[#6D6D6D] text-lg animate-pulse">Загрузка данных о состоянии системы...</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#249BA2] h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#000000]">
    <Symbol text="Мониторинг работы системы" />

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-4 text-[#000000]">Состояние бэкенда</h2>
            {backendStatus && (
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${backendStatus.is_running ? "bg-[#249BA2]" : "bg-[#FF0000]"} mr-2`}
                ></div>
                <span className="text-[#6D6D6D]">{backendStatus.is_running ? "Работает" : "Не работает"}</span>
              </div>
            )}
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-[#249BA2] hover:bg-[#1e8a90] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Обновление...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Обновить данные
              </>
            )}
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-[#FF0000] p-4 rounded-xl mb-6">
            <h3 className="font-bold mb-2">Ошибка соединения с бэкендом</h3>
            <p>{error}</p>
            <p className="mt-2 text-sm">Убедитесь, что бэкенд запущен и доступен по адресу: {host}</p>
          </div>
        ) : backendStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#000000]">
                <svg className="w-5 h-5 mr-2 text-[#249BA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
                Информация о бэкенде
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#6D6D6D] mr-4">Адрес:</span>
                  <span className="text-[#000000] font-medium">{host}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D6D6D]">Статус:</span>
                  <span className={backendStatus.is_running ? "text-[#249BA2]" : "text-[#FF0000]"}>
                    {backendStatus.is_running ? "Работает" : "Не работает"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D6D6D]">Время работы:</span>
                  <span className="text-[#000000] font-medium">{formatUptime(backendStatus.uptime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D6D6D]">Активные соединения:</span>
                  <span className="text-[#000000] font-medium">{backendStatus.active_connections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6D6D6D]">Последнее обновление:</span>
                  <span className="text-[#000000] font-medium">
                    {new Date(backendStatus.last_updated).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#000000]">
                <svg className="w-5 h-5 mr-2 text-[#249BA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Системные метрики
              </h3>
              <div className="space-y-4">
                <MetricBar label="Использование CPU" value={backendStatus.cpu_usage} />
                <MetricBar label="Использование памяти" value={backendStatus.memory_usage} />

                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-medium mb-2 text-[#000000]">Сводка</h4>
                  <p className="text-sm text-[#6D6D6D]">
                    Бэкенд работает стабильно{" "}
                    {backendStatus.memory_usage > 80
                      ? " Высокое использование памяти!"
                      : backendStatus.memory_usage > 60
                        ? " Умеренное использование памяти."
                        : " Низкое использование памяти."}
                    {backendStatus.cpu_usage > 80
                      ? " Высокая нагрузка на CPU!"
                      : backendStatus.cpu_usage > 60
                        ? " Умеренная нагрузка на CPU."
                        : " Низкая нагрузка на CPU."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {backendStatus && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-[#000000]">
              <svg className="w-5 h-5 mr-2 text-[#249BA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Данные в формате JSON
            </h3>
            <pre className="bg-gray-50 border border-gray-200 p-4 rounded-xl overflow-x-auto text-sm text-[#000000]">
              {JSON.stringify(backendStatus, null, 2)}
            </pre>
          </div>
        )}
        {/* {
           <LogsViewer />
        } */}
      </main>
    </div>
  )
}
