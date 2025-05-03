"use client"

import { useState } from "react"
import Link from "next/link"

// Типы данных для статистики распределения времени
type TimePeriod = {
  type: "single_day" | "date_range" | "month" | "year"
  date: string | null
  start_date: string | null
  end_date: string | null
}

type HoursPercent = {
  hours: number
  percent: number
}

type ByTypeDistribution = {
  functions: HoursPercent
  deputies: HoursPercent
  compulsory: HoursPercent
  non_compulsory: HoursPercent
  typical: HoursPercent
  non_typical: HoursPercent
}

type FunctionEntry = {
  function_id: number
  function_name: string
  hours: number
  percent: number
  entries_count: number
}

type DeputyEntry = {
  deputy_id: number
  deputy_name: string
  hours: number
  percent: number
  entries_count: number
}

type ByFunctionsDistribution = {
  typical: FunctionEntry[]
  non_typical: FunctionEntry[]
}

type Distribution = {
  by_type: ByTypeDistribution
  by_functions: ByFunctionsDistribution
  by_deputies: DeputyEntry[]
}

type TimeDistribution = {
  time_period: TimePeriod
  total_hours: number
  total_entries: number
  distribution: Distribution
}

// Имитация данных
const timeDistributionData: TimeDistribution = {
  time_period: {
    type: "single_day",
    date: "2025-05-03",
    start_date: null,
    end_date: null,
  },
  total_hours: 12.09,
  total_entries: 4,
  distribution: {
    by_type: {
      functions: {
        hours: 9.42,
        percent: 77.92,
      },
      deputies: {
        hours: 2.67,
        percent: 22.08,
      },
      compulsory: {
        hours: 9.42,
        percent: 77.92,
      },
      non_compulsory: {
        hours: 2.67,
        percent: 22.08,
      },
      typical: {
        hours: 5.75,
        percent: 47.56,
      },
      non_typical: {
        hours: 6.34,
        percent: 52.44,
      },
    },
    by_functions: {
      typical: [
        {
          function_id: 2,
          function_name: "Дискутирование с Медуничкой о методах лечения",
          hours: 3.5,
          percent: 28.95,
          entries_count: 1,
        },
        {
          function_id: 3,
          function_name: "Написание портрета Синеглазки",
          hours: 2.25,  
          percent: 18.61,
          entries_count: 1,
        },
      ],
      non_typical: [
        {
          function_id: 5,
          function_name: "Выращивание арбузов",
          hours: 3.67,
          percent: 30.36,
          entries_count: 1,
        },
      ],
    },
    by_deputies: [
      {
        deputy_id: 7,
        deputy_name: "Подготовка к экспедиции на Луну",
        hours: 2.67,
        percent: 22.08,
        entries_count: 1,
      },
    ],
  },
}

// Компонент круговой диаграммы
const PieChart = ({ data }: { data: { label: string; value: number; percent: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <svg width="200" height="200" viewBox="0 0 100 100">
      {data.map((item, index) => {
        const angle = (item.percent / 100) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle
        currentAngle = endAngle

        const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
        const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
        const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
        const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

        const largeArcFlag = angle > 180 ? 1 : 0

        const pathData = [`M 50 50`, `L ${startX} ${startY}`, `A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY}`, `Z`].join(
          " ",
        )

        return <path key={index} d={pathData} fill={item.color} />
      })}
      <circle cx="50" cy="50" r="25" fill="#1f2937" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10">
        {total.toFixed(2)} ч
      </text>
    </svg>
  )
}

// Компонент горизонтальной столбчатой диаграммы с процентами
const HorizontalBarChart = ({
  data,
}: {
  data: { label: string; value: number; percent: number; color: string }[]
}) => {
  const chartWidth = 300
  const barHeight = 30
  const gap = 15
  const chartHeight = data.length * (barHeight + gap)

  return (
    <svg width={chartWidth + 150} height={chartHeight} className="mt-4">
      {data.map((item, index) => {
        const barWidth = (item.percent / 100) * chartWidth
        return (
          <g key={index} transform={`translate(0, ${index * (barHeight + gap)})`}>
            <rect width={barWidth} height={barHeight} fill={item.color} rx="4" ry="4" />
            <text
              x={barWidth + 10}
              y={barHeight / 2}
              dominantBaseline="middle"
              fill="white"
              fontSize="12"
            >{`${item.value.toFixed(2)} ч (${item.percent.toFixed(2)}%)`}</text>
            <text x="0" y={barHeight + 12} dominantBaseline="middle" fill="white" fontSize="10" className="font-medium">
              {item.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Компонент для отображения процентного индикатора
const PercentageBar = ({ percent, color }: { percent: number; color: string }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
  )
}

export default function TimeDistributionPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "functions" | "deputies" | "json">("overview")

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Не указана"
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Подготовка данных для круговой диаграммы по типам
  const getTypesPieChartData = () => [
    {
      label: "Функциональные",
      value: timeDistributionData.distribution.by_type.functions.hours,
      percent: timeDistributionData.distribution.by_type.functions.percent,
      color: "#ef4444",
    },
    {
      label: "Заместители",
      value: timeDistributionData.distribution.by_type.deputies.hours,
      percent: timeDistributionData.distribution.by_type.deputies.percent,
      color: "#3b82f6",
    },
  ]

  // Подготовка данных для круговой диаграммы по обязательности
  const getCompulsoryPieChartData = () => [
    {
      label: "Обязательные",
      value: timeDistributionData.distribution.by_type.compulsory.hours,
      percent: timeDistributionData.distribution.by_type.compulsory.percent,
      color: "#10b981",
    },
    {
      label: "Необязательные",
      value: timeDistributionData.distribution.by_type.non_compulsory.hours,
      percent: timeDistributionData.distribution.by_type.non_compulsory.percent,
      color: "#f59e0b",
    },
  ]

  // Подготовка данных для круговой диаграммы по типичности
  const getTypicalPieChartData = () => [
    {
      label: "Типичные",
      value: timeDistributionData.distribution.by_type.typical.hours,
      percent: timeDistributionData.distribution.by_type.typical.percent,
      color: "#8b5cf6",
    },
    {
      label: "Нетипичные",
      value: timeDistributionData.distribution.by_type.non_typical.hours,
      percent: timeDistributionData.distribution.by_type.non_typical.percent,
      color: "#ec4899",
    },
  ]

  // Подготовка данных для горизонтальной диаграммы функций
  const getFunctionsBarChartData = () => {
    const typicalFunctions = timeDistributionData.distribution.by_functions.typical.map((func) => ({
      label: func.function_name,
      value: func.hours,
      percent: func.percent,
      color: "#8b5cf6",
    }))

    const nonTypicalFunctions = timeDistributionData.distribution.by_functions.non_typical.map((func) => ({
      label: func.function_name,
      value: func.hours,
      percent: func.percent,
      color: "#ec4899",
    }))

    return [...typicalFunctions, ...nonTypicalFunctions].sort((a, b) => b.percent - a.percent)
  }

  // Подготовка данных для горизонтальной диаграммы заместителей
  const getDeputiesBarChartData = () => {
    return timeDistributionData.distribution.by_deputies.map((deputy) => ({
      label: deputy.deputy_name,
      value: deputy.hours,
      percent: deputy.percent,
      color: "#3b82f6",
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Распределение времени</h1>
        <nav className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Дашборд
                </Link>
              </li>
              <li>
                <Link href="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Админ панель
                </Link>
              </li>
              <li>
                <Link href="/department-stats" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Статистика отдела
                </Link>
              </li>
              <li>
                <Link href="/system-status" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Состояние системы
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center text-gray-300 hover:text-white">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться к админ-панели
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Распределение времени</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Период:</h3>
            {timeDistributionData.time_period.type === "single_day" ? (
              <p>Дата: {formatDate(timeDistributionData.time_period.date)}</p>
            ) : timeDistributionData.time_period.type === "date_range" ? (
              <p>
                С {formatDate(timeDistributionData.time_period.start_date)} по{" "}
                {formatDate(timeDistributionData.time_period.end_date)}
              </p>
            ) : (
              <p>Период: {timeDistributionData.time_period.type}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Общая информация</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-400">Общее количество часов:</dt>
                  <dd>{timeDistributionData.total_hours.toFixed(2)} ч</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Общее количество записей:</dt>
                  <dd>{timeDistributionData.total_entries}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "overview" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Общий обзор
            </button>
            <button
              onClick={() => setActiveTab("functions")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "functions" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Функции
            </button>
            <button
              onClick={() => setActiveTab("deputies")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "deputies" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Заместители
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === "json" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              JSON данные
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-6">Общий обзор распределения времени</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">По типу</h3>
                <div className="flex justify-center">
                  <PieChart data={getTypesPieChartData()} />
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 mr-2"></div>
                    <span className="text-sm">Функциональные</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                    <span className="text-sm">Заместители</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">По обязательности</h3>
                <div className="flex justify-center">
                  <PieChart data={getCompulsoryPieChartData()} />
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 mr-2"></div>
                    <span className="text-sm">Обязательные</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
                    <span className="text-sm">Необязательные</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">По типичности</h3>
                <div className="flex justify-center">
                  <PieChart data={getTypicalPieChartData()} />
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 mr-2"></div>
                    <span className="text-sm">Типичные</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-pink-500 mr-2"></div>
                    <span className="text-sm">Нетипичные</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Распределение по типу</h3>
                <dl className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <dt className="text-gray-400">Функциональные:</dt>
                      <dd>
                        {timeDistributionData.distribution.by_type.functions.hours.toFixed(2)} ч (
                        {timeDistributionData.distribution.by_type.functions.percent.toFixed(2)}%)
                      </dd>
                    </div>
                    <PercentageBar
                      percent={timeDistributionData.distribution.by_type.functions.percent}
                      color="bg-red-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <dt className="text-gray-400">Заместители:</dt>
                      <dd>
                        {timeDistributionData.distribution.by_type.deputies.hours.toFixed(2)} ч (
                        {timeDistributionData.distribution.by_type.deputies.percent.toFixed(2)}%)
                      </dd>
                    </div>
                    <PercentageBar
                      percent={timeDistributionData.distribution.by_type.deputies.percent}
                      color="bg-blue-500"
                    />
                  </div>
                </dl>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Распределение по обязательности</h3>
                <dl className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <dt className="text-gray-400">Обязательные:</dt>
                      <dd>
                        {timeDistributionData.distribution.by_type.compulsory.hours.toFixed(2)} ч (
                        {timeDistributionData.distribution.by_type.compulsory.percent.toFixed(2)}%)
                      </dd>
                    </div>
                    <PercentageBar
                      percent={timeDistributionData.distribution.by_type.compulsory.percent}
                      color="bg-green-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <dt className="text-gray-400">Необязательные:</dt>
                      <dd>
                        {timeDistributionData.distribution.by_type.non_compulsory.hours.toFixed(2)} ч (
                        {timeDistributionData.distribution.by_type.non_compulsory.percent.toFixed(2)}%)
                      </dd>
                    </div>
                    <PercentageBar
                      percent={timeDistributionData.distribution.by_type.non_compulsory.percent}
                      color="bg-yellow-500"
                    />
                  </div>
                </dl>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Распределение по типичности</h3>
                <dl className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <dt className="text-gray-400">Типичные:</dt>
                      <dd>
                        {timeDistributionData.distribution.by_type.typical.hours.toFixed(2)} ч (
                        {timeDistributionData.distribution.by_type.typical.percent.toFixed(2)}%)
                      </dd>
                    </div>
                    <PercentageBar
                      percent={timeDistributionData.distribution.by_type.typical.percent}
                      color="bg-purple-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <dt className="text-gray-400">Нетипичные:</dt>
                      <dd>
                        {timeDistributionData.distribution.by_type.non_typical.hours.toFixed(2)} ч (
                        {timeDistributionData.distribution.by_type.non_typical.percent.toFixed(2)}%)
                      </dd>
                    </div>
                    <PercentageBar
                      percent={timeDistributionData.distribution.by_type.non_typical.percent}
                      color="bg-pink-500"
                    />
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "functions" && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-6">Распределение по функциям</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Визуализация распределения по функциям</h3>
              <div className="overflow-x-auto">
                <HorizontalBarChart data={getFunctionsBarChartData()} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Типичные функции</h3>
                <div className="space-y-4">
                  {timeDistributionData.distribution.by_functions.typical.map((func) => (
                    <div key={func.function_id} className="border-b border-gray-600 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium mb-2">{func.function_name}</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Часы:</dt>
                          <dd>{func.hours.toFixed(2)} ч</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Процент:</dt>
                          <dd>{func.percent.toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Количество записей:</dt>
                          <dd>{func.entries_count}</dd>
                        </div>
                      </dl>
                      <div className="mt-2">
                        <PercentageBar percent={func.percent} color="bg-purple-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Нетипичные функции</h3>
                <div className="space-y-4">
                  {timeDistributionData.distribution.by_functions.non_typical.map((func) => (
                    <div key={func.function_id} className="border-b border-gray-600 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium mb-2">{func.function_name}</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Часы:</dt>
                          <dd>{func.hours.toFixed(2)} ч</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Процент:</dt>
                          <dd>{func.percent.toFixed(2)}%</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-400">Количество записей:</dt>
                          <dd>{func.entries_count}</dd>
                        </div>
                      </dl>
                      <div className="mt-2">
                        <PercentageBar percent={func.percent} color="bg-pink-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "deputies" && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-6">Распределение по заместителям</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Визуализация распределения по заместителям</h3>
              <div className="overflow-x-auto">
                <HorizontalBarChart data={getDeputiesBarChartData()} />
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Детали по заместителям</h3>
              <div className="space-y-4">
                {timeDistributionData.distribution.by_deputies.map((deputy) => (
                  <div key={deputy.deputy_id} className="border-b border-gray-600 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-medium mb-2">{deputy.deputy_name}</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Часы:</dt>
                        <dd>{deputy.hours.toFixed(2)} ч</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Процент:</dt>
                        <dd>{deputy.percent.toFixed(2)}%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Количество записей:</dt>
                        <dd>{deputy.entries_count}</dd>
                      </div>
                    </dl>
                    <div className="mt-2">
                      <PercentageBar percent={deputy.percent} color="bg-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "json" && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4">JSON данные</h2>
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
              {JSON.stringify(timeDistributionData, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  )
}
