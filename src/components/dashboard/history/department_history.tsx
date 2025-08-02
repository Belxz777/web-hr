"use client"

import { type DepartmentPerformanceData, fetchDepartmentData } from "@/components/server/history/full"
import { convertDataToNormalTime, formatDatePretty, formatISODate } from "@/components/utils/convertDataToNormalTime"
import useGetAlldeps from "@/hooks/useDeps"
import { useState, useEffect } from "react"
import { Symbol } from "@/components/ui/symbol"
// Define the type for a single report
type Report = {
  report_id: number
  employee_id: number
  employee_name: string
  function_id: number
  function_name: string
  hours_worked: number
  comment: string
  date: string
}

// Define the type for the reports by date object
type ReportsByDate = {
  [date: string]: Report[]
}

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
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0])

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

  const filteredReports = data?.reports_by_date || {}
  const totalReports = Object.values(filteredReports).flat().length
  const workingDays = Object.keys(filteredReports).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {/* <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Панель активности сотрудников отдела</h1>
          <p className="text-lg text-gray-600">Мониторинг производительности и отчетности по отделам</p>
        </header> */}
        <Symbol text="Панель активности сотрудников отдела"/>

        {/* Filters Section */}
        <section className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Фильтры и настройки</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label htmlFor="department-select" className="block text-base font-medium text-gray-700">
                  Отдел
                </label>
                <select
                  id="department-select"
                  className="block w-full h-12 px-4 text-base border border-gray-300 rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary bg-white"
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
                  disabled={depsLoading}
                >
                  {depsLoading ? (
                    <option>Загрузка отделов...</option>
                  ) : (
                    deps.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="start-date" className="block text-base font-medium text-gray-700">
                  Начало периода
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="block w-full h-12 px-4 text-base border border-gray-300 rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="end-date" className="block text-base font-medium text-gray-700">
                  Конец периода
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="block w-full h-12 px-4 text-base border border-gray-300 rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFilterChange}
                  disabled={loading || depsLoading}
                  className="w-full h-12 text-base px-6 bg-secondary text-white rounded-xl hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 inline animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Загрузка...
                    </>
                  ) : (
                    "Применить фильтры"
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Department Summary */}
        <section className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="p-8">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-56 bg-gray-200 rounded"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 text-gray-400 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки данных</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={loadDepartmentData}
                  className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium"
                >
                  Попробовать снова
                </button>
              </div>
            ) : data ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.department_name}</h2>
                    <div className="space-y-3 text-lg">
                      <p className="text-gray-700">
                        <span className="font-medium">Период:</span>{" "}
                        {new Date(data.start_date).toLocaleDateString("ru-RU")} -{" "}
                        {new Date(data.end_date).toLocaleDateString("ru-RU")}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Общее время:</span>{" "}
                        <span className="font-bold text-secondary">
                          {data.total_hours ? convertDataToNormalTime(data.total_hours) : "0ч 0м"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="text-3xl font-bold text-secondary">{totalReports}</div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Всего отчетов</div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="text-3xl font-bold text-secondary">{workingDays}</div>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Рабочих дней</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Нет данных для отображения</h3>
                <p className="text-gray-600 text-lg">Выберите отдел и период для просмотра отчетов</p>
              </div>
            )}
          </div>
        </section>

        {/* Reports Section */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Отчеты по дням</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-6">
                    <div className="h-6 w-48 mb-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="border border-gray-300 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="text-gray-800">
                    <strong>Ошибка:</strong> {error}
                  </div>
                </div>
              </div>
            ) : Object.keys(filteredReports).length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Нет отчетов за выбранный период</h3>
                <p className="text-gray-600 text-lg">Попробуйте изменить период или выбрать другой отдел</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(filteredReports).map(([date, reports]) => (
                  <article
                    key={date}
                    className="border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <header className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{formatDatePretty(date)}</h3>
                      <p className="text-gray-600 text-lg">{reports.length} отчет(ов) за день</p>
                    </header>

                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Сотрудник</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Функция</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Время работы</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Комментарий</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Время отправки</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {reports.map((report) => (
                            <tr key={report.report_id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {/* <div className="w-10 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                                      {report.employee_name
                                        ? report.employee_name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                        : "?"}
                                    </div> */}
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {report.employee_name || "Неизвестный"}
                                      </div>
                                      <div className="text-sm text-gray-500">ID: {report.employee_id}</div>
                                    </div>
                                  </div>
                                  {onEmployeeClick && (
                                    <button
                                      onClick={() =>
                                        onEmployeeClick(report.employee_id, report.employee_name || "Неизвестный")
                                      }
                                      className="px-3 py-1 ml-2 text-sm bg-secondary text-white  hover:bg-secondary/90 transition-colors font-medium rounded-xl"
                                    >
                                      Подробнее
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{report.function_name || "-"}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-3 rounded-full text-sm font-semibold  text-secondary">
                                  {report.hours_worked
                                    ? convertDataToNormalTime(Number(report.hours_worked.toFixed(2)))
                                    : "0ч 0м"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="max-w-xs">
                                  {report.comment ? (
                                    <p className="text-gray-700 text-sm">{report.comment}</p>
                                  ) : (
                                    <span className="text-gray-400 italic text-sm">Без комментария</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600">{formatISODate(report.date) || "-"}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
