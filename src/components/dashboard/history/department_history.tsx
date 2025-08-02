"use client"

import { DepartmentPerformanceData, fetchDepartmentData } from "@/components/server/history/full"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import useGetAlldeps from "@/hooks/useDeps"
import { useState, useEffect } from "react"

// Define the type for a single report
type Report = {
  report_id: number
  employee_id: number
  employee_name: string
  function_id: number
  function_name: string
  hours_worked: number
  comment: string
}

// Define the type for the reports by date object
type ReportsByDate = {
  [date: string]: Report[]
}

// Dummy data for department selection (since the provided data is for one department)

export default function DepartmentActivityDashboard({
  onEmployeeClick,
}: {
  onEmployeeClick?: (employeeId: number, employeeName: string) => void
}) {
      const { deps, loading: depsLoading } = useGetAlldeps()

  const [data, setData] = useState<DepartmentPerformanceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(deps[0]?.id || 0)
// Устанавливаем даты: начальная - неделю назад, конечная - сегодня
const [startDate, setStartDate] = useState<string>(
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
);
const [endDate, setEndDate] = useState<string>(
  new Date().toISOString().split('T')[0]
);
  // Функция для загрузки данных
  const loadDepartmentData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchDepartmentData(selectedDepartmentId, startDate, endDate)
      if (result.data) {
        setData(result.data)
      } else {
        setError(result.error || "Не удалось получить данные")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при монтировании компонента
  useEffect(() => {
   // loadDepartmentData()
  }, [])

  // Обработчик изменения фильтров
  const handleFilterChange = () => {
    loadDepartmentData()
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2  border-secondary mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных отдела...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto my-8">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Ошибка:</strong> {error}
          </div>
          <button onClick={loadDepartmentData} className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-foreground">
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">
            Отдел
          </label>
          <select
            id="department-select"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:bg-base focus:border-blue-500 sm:text-sm"
            value={selectedDepartmentId}
            onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
          >
            {deps.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Начало периода
          </label>
          <input
            type="date"
            id="start-date"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm  focus:border-blue-500 sm:text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            Конец периода
          </label>
          <input
            type="date"
            id="end-date"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm  focus:border-blue-500 sm:text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
        <button
          onClick={handleFilterChange}
          disabled={loading}
          className="px-4 py-2 bg-secondary rounded hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed  "
        >
          {loading ? "Загрузка..." : "Применить фильтры"}
        </button>
      </div>
      </div>
        <div className="text-center text-gray-600">
          <p>Нет данных для отображения</p>
        </div>
      </div>
    )
  }

  const filteredReports = data?.reports_by_date || {}

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Панель активности сотрудников отдела</h1>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-1">
            Отдел
          </label>
          <select
            id="department-select"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:bg-base focus:border-blue-500 sm:text-sm"
            value={selectedDepartmentId}
            onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
          >
            {deps.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Начало периода
          </label>
          <input
            type="date"
            id="start-date"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm  focus:border-blue-500 sm:text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            Конец периода
          </label>
          <input
            type="date"
            id="end-date"
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm  focus:border-blue-500 sm:text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mb-6">
        <button
          onClick={handleFilterChange}
          disabled={loading}
          className="px-4 py-2 bg-secondary rounded hover:bg-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed  "
        >
          {loading ? "Загрузка..." : "Применить фильтры"}
        </button>
      </div>

      {/* Department Summary */}
      <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{data.department_name} - Обзор производительности</h2>
        <p className="text-gray-600">
          Период: {new Date(data.start_date).toLocaleDateString()} - {new Date(data.end_date).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          Общее количество отработанного временени: <span className="font-bold text-gray-800">{data.total_hours ? convertDataToNormalTime(data.total_hours) : 0  } </span>
        </p>
      </div>

      {/* Reports Section */}
      <div className="space-y-6">
        {Object.keys(filteredReports).length === 0 ? (
          <p className="text-gray-600 text-center">Нет отчетов за выбранный период.</p>
        ) : (
          Object.entries(filteredReports).map(([date, reports]) => (
            <div key={date} className="border border-gray-200 rounded-md p-4 bg-white">
            
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Сотрудник
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Функция
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Время
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Комментарий
                      </th>
                        <th
                        scope="col"
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Дата
                      </th>
                    </tr>
                  </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report) => (
                      <tr key={report.report_id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center justify-between">
                            <span>{report.employee_name || "-"}</span>
                            {onEmployeeClick && (
                              <button
                                onClick={() => onEmployeeClick(report.employee_id, report.employee_name || "Неизвестный")}
                                className="ml-2 px-2 py-1 text-xs bg-secondary text-white rounded hover:bg-secondary/80 transition-colors"
                              >
                                Подробнее
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{report.function_name || "-"}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                          {report.hours_worked ? convertDataToNormalTime(Number(report.hours_worked.toFixed(2))) : "0.00"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{report.comment || "-"}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{date || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
