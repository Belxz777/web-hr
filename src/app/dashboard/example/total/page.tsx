"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

// Типы данных для статистики
type TimePeriod = {
  type: "single_day" | "date_range" | "month" | "year"
  date: string | null
  start_date: string | null
  end_date: string | null
}

type DepartmentStats = {
  total_hours: number
  function_hours: number
  deputy_hours: number
  employee_count: number
}

type EmployeeStats = {
  employee_id: number
  total_hours: number
  function_hours: number
  deputy_hours: number
}

type DepartmentStatistics = {
  department_id: string
  time_period: TimePeriod
  department_stats: DepartmentStats
  employee_stats: EmployeeStats[]
}

// Имитация данных сотрудников для отображения имен
const employees = [
  { id: 1, name: "Иван Иванов" },
  { id: 2, name: "Мария Петрова" },
  { id: 3, name: "Алексей Смирнов" },
]

// Имитация данных отделов
const departments = [
  { id: "1", name: "IT отдел" },
  { id: "2", name: "Отдел дизайна" },
  { id: "3", name: "Отдел управления проектами" },
]

// Имитация запроса к API
const fetchDepartmentStats = async (departmentId: string): Promise<DepartmentStatistics> => {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Возвращаем тестовые данные
  return {
    department_id: departmentId,
    time_period: {
      type: "single_day",
      date: "2025-05-03",
      start_date: null,
      end_date: null,
    },
    department_stats: {
      total_hours: 9.84,
      function_hours: 7.17,
      deputy_hours: 2.67,
      employee_count: 1,
    },
    employee_stats: [
      {
        employee_id: 1,
        total_hours: 9.84,
        function_hours: 7.17,
        deputy_hours: 2.67,
      },
    ],
  }
}

// Компонент круговой диаграммы
const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <svg width="200" height="200" viewBox="0 0 100 100">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100
        const angle = (percentage / 100) * 360
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

// Компонент столбчатой диаграммы
const BarChart = ({ data }: { data: { label: string; values: { value: number; color: string }[] }[] }) => {
  const maxValue = Math.max(...data.flatMap((item) => item.values.map((v) => v.value)))
  const barWidth = 30
  const barGap = 10
  const groupGap = 40
  const chartHeight = 200
  const chartWidth = data.length * (barWidth * data[0].values.length + groupGap)

  return (
    <svg width={chartWidth} height={chartHeight + 50} className="mt-4">
      {/* Ось Y */}
      <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#6b7280" strokeWidth="1" />

      {/* Ось X */}
      <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#6b7280" strokeWidth="1" />

      {data.map((group, groupIndex) => (
        <g key={groupIndex} transform={`translate(${groupIndex * (group.values.length * barWidth + groupGap)}, 0)`}>
          {group.values.map((item, itemIndex) => {
            const barHeight = (item.value / maxValue) * chartHeight
            return (
              <g key={itemIndex} transform={`translate(${itemIndex * barWidth}, 0)`}>
                <rect
                  y={chartHeight - barHeight}
                  width={barWidth - 2}
                  height={barHeight}
                  fill={item.color}
                  rx="2"
                  ry="2"
                />
                <text
                  x={barWidth / 2 - 1}
                  y={chartHeight - barHeight - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                >
                  {item.value.toFixed(2)}
                </text>
              </g>
            )
          })}
          <text
            x={(group.values.length * barWidth) / 2}
            y={chartHeight + 20}
            textAnchor="middle"
            fill="white"
            fontSize="12"
          >
            {group.label}
          </text>
        </g>
      ))}

      {/* Легенда */}
      <g transform={`translate(10, ${chartHeight + 40})`}>
        {data[0].values.map((item, index) => (
          <g key={index} transform={`translate(${index * 120}, 0)`}>
            <rect width="10" height="10" fill={item.color} />
            <text x="15" y="9" fill="white" fontSize="10">
              {index === 0 ? "Функциональные часы" : index === 1 ? "Часы заместителя" : "Общие часы"}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function DepartmentStatsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [departmentId, setDepartmentId] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [statistics, setStatistics] = useState<DepartmentStatistics | null>(null)

  // Загрузка данных при изменении ID отдела
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchDepartmentStats(departmentId)
        setStatistics(data)
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [departmentId])

  // Получение названия отдела по ID
  const getDepartmentName = (id: string) => {
    const department = departments.find((dept) => dept.id === id)
    return department ? department.name : `Отдел ID: ${id}`
  }

  // Получение имени сотрудника по ID
  const getEmployeeName = (id: number) => {
    const employee = employees.find((emp) => emp.id === id)
    return employee ? employee.name : `Сотрудник ID: ${id}`
  }

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Не указана"
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Подготовка данных для круговой диаграммы
  const getPieChartData = (stats: DepartmentStats) => [
    { label: "Функциональные часы", value: stats.function_hours, color: "#ef4444" },
    { label: "Часы заместителя", value: stats.deputy_hours, color: "#3b82f6" },
  ]

  // Подготовка данных для столбчатой диаграммы
  const getBarChartData = (employeeStats: EmployeeStats[]) => {
    return employeeStats.map((stat) => ({
      label: getEmployeeName(stat.employee_id),
      values: [
        { value: stat.function_hours, color: "#ef4444" },
        { value: stat.deputy_hours, color: "#3b82f6" },
        { value: stat.total_hours, color: "#10b981" },
      ],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Статистика отдела</h1>
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
                <Link href="/statistics" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Общая статистика
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
          <h2 className="text-xl font-bold mb-4">Выбор отдела</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-400 mb-2">
                Отдел
              </label>
              <select
                id="departmentId"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <svg
              className="animate-spin h-10 w-10 text-red-500"
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
          </div>
        ) : statistics ? (
          <>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">
                Статистика отдела: {getDepartmentName(statistics.department_id)}
              </h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Период:</h3>
                {statistics.time_period.type === "single_day" ? (
                  <p>Дата: {formatDate(statistics.time_period.date)}</p>
                ) : statistics.time_period.type === "date_range" ? (
                  <p>
                    С {formatDate(statistics.time_period.start_date)} по {formatDate(statistics.time_period.end_date)}
                  </p>
                ) : (
                  <p>Период: {statistics.time_period.type}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Общая статистика отдела</h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Общее количество часов:</dt>
                        <dd>{statistics.department_stats.total_hours.toFixed(2)} ч</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Функциональные часы:</dt>
                        <dd>{statistics.department_stats.function_hours.toFixed(2)} ч</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Часы заместителя:</dt>
                        <dd>{statistics.department_stats.deputy_hours.toFixed(2)} ч</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-400">Количество сотрудников:</dt>
                        <dd>{statistics.department_stats.employee_count}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">Распределение часов</h3>
                    <PieChart data={getPieChartData(statistics.department_stats)} />
                    <div className="mt-4 flex justify-center gap-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 mr-2"></div>
                        <span className="text-sm">Функциональные</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                        <span className="text-sm">Заместителя</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Статистика по сотрудникам</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Сотрудник
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Общие часы
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Функциональные часы
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Часы заместителя
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {statistics.employee_stats.map((employee) => (
                      <tr key={employee.employee_id}>
                        <td className="px-6 py-4 whitespace-nowrap">{getEmployeeName(employee.employee_id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.total_hours.toFixed(2)} ч</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.function_hours.toFixed(2)} ч</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.deputy_hours.toFixed(2)} ч</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Визуализация часов по сотрудникам</h3>
                <div className="overflow-x-auto">
                  <BarChart data={getBarChartData(statistics.employee_stats)} />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">JSON данные</h2>
              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-300">
                {JSON.stringify(statistics, null, 2)}
              </pre>
            </div>
          </>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <p className="text-center text-gray-400">Выберите отдел для просмотра статистики</p>
          </div>
        )}
      </main>
    </div>
  )
}
