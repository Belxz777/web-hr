"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { host } from "@/types"
import { Header } from "@/components/ui/header"
import { useRouter } from "next/navigation"

// Типы для данных о состоянии системы
type BackendStatus = {
  is_running: boolean
  uptime: number
  memory_usage: number
  cpu_usage: number
  active_connections: number
  error_count: number
  requests_per_minute: number
  last_updated: string
}

export default function SystemStatusPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  // Функция для форматирования времени работы
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    return `${days}д ${hours}ч ${minutes}м ${secs}с`
  }

  // Функция для получения данных о состоянии бэкенда
  const fetchBackendStatus = async () => {
    try {
      const response = await fetch("/api/stats", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        mode: 'no-cors',
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

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchBackendStatus()
  }, [])

  // Функция для обновления данных
  const refreshData = () => {
    setIsRefreshing(true)
    fetchBackendStatus()
  }

  // Компонент для отображения метрики с прогресс-баром
  const MetricBar = ({
    label,
    value,
    max = 100,
    unit = "%",
  }: { label: string; value: number; max?: number; unit?: string }) => {
    const percentage = (value / max) * 100

    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">{label}</span>
          <span className="text-sm text-gray-400">
            {value}
            {unit}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${percentage > 80 ? "bg-red-500" : percentage > 60 ? "bg-yellow-500" : "bg-green-500"
              }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl text-center max-w-md w-full mx-4">
          {/* Улучшенный лоадер с плавной анимацией */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-6"></div>
          
          {/* Текст с анимацией пульсации для лучшего UX */}
          <p className="text-gray-300 text-lg animate-pulse">
            Загрузка данных о состоянии системы...
          </p>
          
          {/* Дополнительный прогресс-бар */}
          <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <Header title="Состояние системы" position={5} showPanel={false} />
      <div className="flex w-full">
        <button onClick={() => router.back()} className="flex m-3 items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{`<- Вернуться к админ-панели`}</button>
      </div>
      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-4">Состояние бэкенда</h2>
            {backendStatus && (
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${backendStatus.is_running ? "bg-green-500" : "bg-red-500"} mr-2`}
                ></div>
                <span>{backendStatus.is_running ? "Работает" : "Не работает"}</span>
              </div>
            )}
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-red-600 text-white p-4 rounded-xl mb-6">
            <h3 className="font-bold mb-2">Ошибка соединения с бэкендом </h3>
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Убедитесь, что бэкенд запущен и доступен по адресу: ${host}
            </p>
          </div>
        ) : backendStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Статус бэкенда */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="text-gray-400 mr-4">Адрес:  </span>
                  <span className="text-gray-300">{host}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Статус:</span>
                  <span className={backendStatus.is_running ? "text-green-500" : "text-red-500"}>
                    {backendStatus.is_running ? "Работает" : "Не работает"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Время работы:</span>
                  <span>{formatUptime(backendStatus.uptime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Активные соединения:</span>
                  <span>{backendStatus.active_connections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Количество ошибок:</span>
                  <span className={backendStatus.error_count > 0 ? "text-red-500" : "text-green-500"}>
                    {backendStatus.error_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Запросов в минуту:</span>
                  <span>{backendStatus.requests_per_minute}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Последнее обновление:</span>
                  <span>{new Date(backendStatus.last_updated).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Системные метрики */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium mb-2">Сводка</h4>
                  <p className="text-sm text-gray-300">
                    Бэкенд работает стабильно{" "}
                    {backendStatus.error_count === 0 ? "без ошибок" : `с ${backendStatus.error_count} ошибками`}.
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

        {/* JSON представление данных */}
        {backendStatus && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Данные в формате JSON
            </h3>
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
              {JSON.stringify(backendStatus, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}

