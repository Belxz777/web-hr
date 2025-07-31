"use client"

import { useState, useEffect } from "react"
import { fetchEmployeeData, type EmployeePerformanceData } from "@/components/server/history/full"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import { Symbol } from "@/components/ui/symbol"
export default function EmployeeDetailDashboard({
  employeeId,
 
}: {
  employeeId: number

}) {
const [data, setData] = useState<EmployeePerformanceData | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Устанавливаем даты: начальная - неделю назад, конечная - сегодня
const [startDate, setStartDate] = useState<string>(
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
);
const [endDate, setEndDate] = useState<string>(
  new Date().toISOString().split('T')[0]
);
  // Функция для загрузки данных сотрудника
  const loadEmployeeData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchEmployeeData(employeeId, startDate, endDate)
      if (result.data) {
        setData(result.data)
      } else {
        setError(result.error || "Не удалось получить данные сотрудника")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при монтировании компонента или изменении employeeId
  useEffect(() => {
    if (employeeId) {
      loadEmployeeData()
    }
  }, [employeeId])

  // Обработчик изменения фильтров
  const handleFilterChange = () => {
    loadEmployeeData()
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto my-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Детальная информация о сотруднике</h1>
          <button
    
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Назад к отделу
          </button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка данных сотрудника...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-6xl mx-auto my-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Детальная информация о сотруднике</h1>
          <button

            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Назад к отделу
          </button>
        </div>
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong>Ошибка:</strong> {error}
          </div>
          <button
            onClick={loadEmployeeData}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-foreground transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto my-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Детальная информация о сотруднике</h1>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Назад к отделу
          </button>
        </div>
        <div className="text-center text-gray-600">
          <p>Нет данных для отображения</p>
        </div>
      </div>
    )
  }

// Calculate total reports
const totalReports = data?.reports_by_date ? Object.values(data.reports_by_date).flat().length : 0;

// Calculate average hours per day
const workingDays = data?.reports_by_date ? Object.keys(data.reports_by_date).length : 0;
const averageHoursPerDay = workingDays > 0 ? data.total_hours / workingDays : 0;

// Calculate total functions worked
const uniqueFunctions = data?.reports_by_date 
  ? new Set(
      Object.values(data.reports_by_date)
        .flat()
        .map((report) => report.function_id),
    ).size
  : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto my-8">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Детальная информация о сотруднике</h1>
          <p className="text-gray-600 mt-1">Подробная статистика работы и активности</p>
        </div>
      </div>

      {/* Employee Info Card */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-xl mb-8 border border-blue-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Basic Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                {data.employee_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{data.employee_name}</h2>
                <p className="text-gray-600">ID: {data.employee_id}</p>
                <p className="text-gray-600 font-medium">{data.department_name}</p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                <div className="text-2xl font-bold text-secondary">{data.total_hours ? convertDataToNormalTime(data.total_hours) : 0}</div>
                <div className="text-sm text-gray-600">Общее время</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                <div className="text-2xl font-bold text-green-600">{totalReports}</div>
                <div className="text-sm text-gray-600">Всего отчетов</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                <div className="text-2xl font-bold text-secondary">{convertDataToNormalTime(averageHoursPerDay)}</div>
                <div className="text-sm text-gray-600">Среднее в день</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-white/50">
                <div className="text-2xl font-bold text-secondary">{uniqueFunctions}</div>
                <div className="text-sm text-gray-600">Разных фукнций</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Фильтры периода</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
              Начало периода
            </label>
            <input
              type="date"
              id="start-date"
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
              Конец периода
            </label>
            <input
              type="date"
              id="end-date"
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFilterChange}
              disabled={loading}
              className="w-full px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Загрузка..." : "Применить фильтры"}
            </button>
          </div>
        </div>
      </div>

      {/* Reports Section */}
     <div className="space-y-6">
  <h3 className="text-xl font-semibold text-gray-800">Отчеты по дням</h3>
  {!data?.reports_by_date || Object.keys(data.reports_by_date).length === 0 ? (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <p className="text-gray-600 text-lg">Нет отчетов за выбранный период</p>
      <p className="text-gray-500 text-sm mt-1">Попробуйте изменить период или проверьте данные</p>
    </div>
  ) : (
    Object.entries(data.reports_by_date).map(([date, reports]) => (

            <div
              key={date}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {new Date(date).toLocaleDateString("ru-RU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>
                  <p className="text-gray-600 mt-1">{reports.length} отчет(ов) за день</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-secondary">
                    {convertDataToNormalTime(reports.reduce((sum, report) => sum + report.hours_worked, 0))}
                  </div>
                  <div className="text-sm text-gray-500">общее время</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Функция</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Время</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Комментарий</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reports.map((report, index) => (
                      <tr key={report.report_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center text-xs font-medium ">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{report.function_name}</div>
                              <div className="text-xs text-gray-500">Айди функции: {report.function_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {convertDataToNormalTime(Number(report.hours_worked))}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            {report.comment ? (
                              <p className="text-gray-700 text-sm">{report.comment}</p>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Без комментария</span>
                            )}
                          </div>
                        </td>
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
