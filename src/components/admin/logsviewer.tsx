"use client"

import { useState, useEffect, useMemo } from "react"

interface LogEntry {
  message: string
}

interface LogsResponse {
  logs: LogEntry[]
}

interface LogsViewerProps {
  host: string
}

const LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] as const
const LOG_TYPES = ["LATEST", ...LOG_LEVELS] as const
type LogLevel = (typeof LOG_LEVELS)[number]
type LogType = (typeof LOG_TYPES)[number]

const LOG_LEVEL_COLORS = {
  DEBUG: "text-gray-600 bg-gray-50 border-gray-200",
  INFO: "text-blue-600 bg-blue-50 border-blue-200",
  WARNING: "text-yellow-600 bg-yellow-50 border-yellow-200",
  ERROR: "text-red-600 bg-red-50 border-red-200",
  CRITICAL: "text-red-800 bg-red-100 border-red-300",
}

const LOG_LEVEL_BADGES = {
  DEBUG: "bg-gray-100 text-gray-800",
  INFO: "bg-blue-100 text-blue-800",
  WARNING: "bg-yellow-100 text-yellow-800",
  ERROR: "bg-red-100 text-red-800",
  CRITICAL: "bg-red-200 text-red-900",
}

const LOG_TYPE_LABELS = {
  LATEST: "Последние",
  DEBUG: "Отладка",
  INFO: "Информация",
  WARNING: "Предупреждения",
  ERROR: "Ошибки",
  CRITICAL: "Критические",
}

function parseLogMessage(message: string) {
  // Парсим сообщение лога: "LEVEL YYYY-MM-DD HH:MM:SS,mmm module message"
  const logPattern =
    /^(DEBUG|INFO|WARNING|ERROR|CRITICAL)\s+(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2},\d{3})\s+(\w+)\s+(.+)$/
  const match = message.match(logPattern)

  if (match) {
    return {
      level: match[1] as LogLevel,
      timestamp: match[2],
      module: match[3],
      content: match[4],
      raw: message,
    }
  }

  // Если не удалось распарсить, пытаемся найти хотя бы уровень
  const levelMatch = message.match(/^(DEBUG|INFO|WARNING|ERROR|CRITICAL)/)
  return {
    level: (levelMatch?.[1] as LogLevel) || "INFO",
    timestamp: "",
    module: "",
    content: message,
    raw: message,
  }
}

export default function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedLogType, setSelectedLogType] = useState<LogType>("INFO")
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(new Set(LOG_LEVELS))
  const [searchQuery, setSearchQuery] = useState("")
  const [showRawFormat, setShowRawFormat] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  // Функция для получения логов
  const fetchLogs = async (logType: LogType = selectedLogType) => {
    setIsLoading(true)
    setError(null)

    try {
      let url: string
      if (logType === "LATEST") {
        url = `/api/stats/logs`
      } else {
        url = `/api/stats/logs?level=${logType.toLowerCase()}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: LogsResponse = await response.json()
      setLogs(data.logs || [])
      setLastFetch(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки логов")
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  // Загружаем логи при изменении типа
  useEffect(() => {
    fetchLogs(selectedLogType)
  }, [selectedLogType])

  // Автообновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs()
    }, 30000)

    return () => clearInterval(interval)
  }, [selectedLogType])

  // Парсим и фильтруем логи
  const parsedLogs = useMemo(() => {
    return logs.map((log, index) => ({
      id: index,
      ...parseLogMessage(log.message),
    }))
  }, [logs])

  const filteredLogs = useMemo(() => {
    return parsedLogs.filter((log) => {
      const levelMatch = selectedLevels.has(log.level)
      const searchMatch =
        searchQuery === "" ||
        log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase())

      return levelMatch && searchMatch
    })
  }, [parsedLogs, selectedLevels, searchQuery])

  // Статистика по уровням
  const levelStats = useMemo(() => {
    const stats: Record<LogLevel, number> = {
      DEBUG: 0,
      INFO: 0,
      WARNING: 0,
      ERROR: 0,
      CRITICAL: 0,
    }

    parsedLogs.forEach((log) => {
      stats[log.level]++
    })

    return stats
  }, [parsedLogs])

  const toggleLevel = (level: LogLevel) => {
    const newSelected = new Set(selectedLevels)
    if (newSelected.has(level)) {
      newSelected.delete(level)
    } else {
      newSelected.add(level)
    }
    setSelectedLevels(newSelected)
  }

  const toggleAllLevels = () => {
    if (selectedLevels.size === LOG_LEVELS.length) {
      setSelectedLevels(new Set())
    } else {
      setSelectedLevels(new Set(LOG_LEVELS))
    }
  }
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    
    try {
        // Разбираем формат "2025-07-20 17:15:05,839"
        const [datePart, timePart] = timestamp.split(" ");
        const [time, ms] = timePart.split(",");
        const [hours, minutes, seconds] = time.split(":");
        
        // Создаем дату в локальном времени
        const date = new Date(
            parseInt(datePart.split("-")[0]), // год
            parseInt(datePart.split("-")[1]) - 1, // месяц (0-11)
            parseInt(datePart.split("-")[2]), // день
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds),
            parseInt(ms)
        );
        
        // Форматируем для русской локали
        return date.toLocaleString("ru-RU", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/,/g, '');
        
    } catch (error) {
        console.error("Ошибка форматирования времени:", error);
        return timestamp;
    }
};
  const handleRefresh = () => {
    fetchLogs()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center text-[#000000]">
          <svg className="w-5 h-5 mr-2 text-[#249BA2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Системные логи
          <span className="ml-2 text-sm text-[#6D6D6D]">
            ({filteredLogs.length} из {parsedLogs.length})
          </span>
        </h3>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center px-3 py-1 bg-[#249BA2] hover:bg-[#1e8a90] text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
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
              Загрузка...
            </>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Обновить
            </>
          )}
        </button>
      </div>

      {/* Выбор типа логов */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Тип логов:</label>
        <div className="flex flex-wrap gap-2">
          {LOG_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedLogType(type)}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                selectedLogType === type
                  ? "bg-[#249BA2] text-white border-[#249BA2]"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {LOG_TYPE_LABELS[type]}
              {type !== "LATEST" && levelStats[type] > 0 && ` (${levelStats[type]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Информация о последнем обновлении */}
      {lastFetch && (
        <div className="mb-4 text-sm text-[#6D6D6D]">
          Последнее обновление: {lastFetch.toLocaleString("ru-RU")} | Источник:{" "}
          <code className="bg-gray-100 px-1 rounded text-xs">
            {selectedLogType === "LATEST"
              ? `/api/stats/logs`
              : `/api/stats/logs?level=${selectedLogType.toLowerCase()}`}
          </code>
        </div>
      )}

      {/* Ошибка загрузки */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Ошибка загрузки логов:</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Фильтры по уровням (только для "Последние") */}
      {selectedLogType === "LATEST" && parsedLogs.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Фильтр по уровням:</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAllLevels}
              className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {selectedLevels.size === LOG_LEVELS.length ? "Снять все" : "Выбрать все"}
            </button>

            {LOG_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                  selectedLevels.has(level)
                    ? LOG_LEVEL_BADGES[level] + " border-transparent"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {level} ({levelStats[level]})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Поиск и настройки */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Поиск по содержимому или модулю..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#249BA2] focus:border-[#249BA2] text-sm"
          />
        </div>
        <button
          onClick={() => setShowRawFormat(!showRawFormat)}
          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
            showRawFormat
              ? "bg-[#249BA2] text-white border-[#249BA2]"
              : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {showRawFormat ? "Форматированный" : "Сырой формат"}
        </button>
      </div>

      {/* Список логов */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading && logs.length === 0 ? (
          <div className="text-center py-8 text-[#6D6D6D]">
            <svg
              className="animate-spin mx-auto h-8 w-8 text-[#249BA2] mb-2"
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
            Загрузка логов...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-[#6D6D6D]">
            {parsedLogs.length === 0 ? (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Логи не найдены
              </div>
            ) : (
              "Нет логов, соответствующих фильтрам"
            )}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className={`p-3 rounded-lg border ${LOG_LEVEL_COLORS[log.level]} transition-colors`}>
              {showRawFormat ? (
                <div className="font-mono text-sm whitespace-pre-wrap break-all">{log.raw}</div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${LOG_LEVEL_BADGES[log.level]}`}>
                        {log.level}
                      </span>
                      {log.module && (
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">{log.module}</span>
                      )}
                    </div>
                    {log.timestamp && <span className="text-xs text-[#6D6D6D]">{formatTimestamp(log.timestamp)}</span>}
                  </div>
                  <div className="text-sm font-mono break-all">{log.content}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Сводка */}
      {parsedLogs.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-[#6D6D6D]">
            <span>
              Всего записей: {parsedLogs.length} | Показано: {filteredLogs.length}
            </span>
            <span>
              Критических: {levelStats.CRITICAL} | Ошибок: {levelStats.ERROR} | Предупреждений: {levelStats.WARNING}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
