"use client"

import { useState, useEffect } from "react"
import { fetchEmployeeData, type EmployeePerformanceData } from "@/components/server/history/full"
import { convertDataToNormalTime, formatISODate } from "@/components/utils/convertDataToNormalTime"
import { Symbol } from "@/components/ui/symbol"
import { useRouter } from "next/navigation"
export default function EmployeeDetailDashboard({
  employeeId,
 
}: {
  employeeId: number

}) {
const router = useRouter()
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

  const totalReports = data?.reports_by_date ? Object.values(data.reports_by_date).flat().length : 0
  const workingDays = data?.reports_by_date ? Object.keys(data.reports_by_date).length : 0
  const averageHoursPerDay = workingDays > 0 ? data!.total_hours / workingDays : 0
  const uniqueFunctions = data?.reports_by_date
    ? new Set(
        Object.values(data.reports_by_date)
          .flat()
          .map((report) => report.function_id),
      ).size
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Symbol text="Детальная информация о сотруднике"/>
        {/* <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Детальная информация о сотруднике</h1>
              <p className="text-lg text-gray-600 mt-2">Подробная статистика работы и активности</p>
            </div>
            <button className="px-6 py-3 text-base bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            onClick={()=>
             router.back()
            }>
              ← Назад 
            </button>
          </div>
        </div> */}

        {/* Employee Info Card */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="p-8">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-blue-200">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50">
                          <div className="h-8 w-16 mb-2 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 text-red-500 mx-auto mb-4 flex items-center justify-center">
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
                    onClick={loadEmployeeData}
                    className="px-6 py-3 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium"
                  >
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
                    Попробовать снова
                  </button>
                </div>
              ) : data ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Employee Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {data.employee_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-1">{data.employee_name}</h2>
                        <p className="text-gray-600 text-lg">ID: {data.employee_id}</p>
                        <p className="text-secondary font-semibold text-lg">{data.department_name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="text-3xl font-bold text-secondary">
                            {data.total_hours ? convertDataToNormalTime(data.total_hours) : "0ч 0м"}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Общее время</div>
                      </div>

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
                          <div className="text-3xl font-bold text-secondary">
                            {convertDataToNormalTime(averageHoursPerDay)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Среднее в день</div>
                      </div>

                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <div className="text-3xl font-bold text-secondary">{uniqueFunctions}</div>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">Разных функций</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Фильтры периода</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label htmlFor="start-date" className="block text-base font-medium text-gray-700">
                  Начало периода
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full h-12 px-4 text-base border border-gray-300 rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end-date" className="block text-base font-medium text-gray-700">
                  Конец периода
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full h-12 px-4 text-base border border-gray-300 rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleFilterChange}
                  disabled={loading}
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
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Отчеты по дням</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="h-6 w-48 mb-2 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="text-right">
                        <div className="h-8 w-20 mb-1 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2].map((j) => (
                        <div key={j} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-5 w-40 mb-2 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="border border-red-200 bg-red-50 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="text-red-800">
                    <strong>Ошибка:</strong> {error}
                  </div>
                </div>
              </div>
            ) : !data?.reports_by_date || Object.keys(data.reports_by_date).length === 0 ? (
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
                <p className="text-gray-600 text-lg">Попробуйте изменить период или проверьте данные</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(data.reports_by_date).map(([date, reports]) => (
                  <div
                    key={date}
                    className="border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">
                          {new Date(date).toLocaleDateString("ru-RU", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                        <p className="text-gray-600 text-lg">{reports.length} отчет(ов) за день</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-secondary mb-1">
                          {convertDataToNormalTime(reports.reduce((sum, report) => sum + report.hours_worked, 0))}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">общее время</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reports.map((report, index) => (
                        <div
                          key={report.report_id}
                          className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center text-xl font-bold">
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-900 text-lg mb-1">{report.function_name}</h5>
                            {report.comment ? (
                              <p className="text-gray-600">{report.comment}</p>
                            ) : (
                              <span className="text-gray-400 italic">Без комментария</span>
                            )}
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <div className="inline-flex items-center px-4 py-2 rounded-full text-base font-semibold bg-secondary/10 text-secondary">
                                {convertDataToNormalTime(Number(report.hours_worked))}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">время работы</div>
                            </div>

                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{formatISODate(report.date)}</div>
                              <div className="text-xs text-gray-500">время отправки</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
