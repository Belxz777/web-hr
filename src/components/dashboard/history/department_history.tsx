"use client"

import { type DepartmentPerformanceData, fetchDepartmentData } from "@/components/server/history/full"
import { convertDataToNormalTime, formatDatePretty, formatISODate } from "@/components/utils/convertDataToNormalTime"
import useGetAlldeps from "@/hooks/useDeps"
import { useState, useEffect } from "react"
import Image from "next/image"
import logo from "../../../../public/logo_1_.svg"

// Define the type for a single report
type Report = {
  report_id: number
  employee_id: number
  employee_name: string
  function: {
    id: number
    name: string
  }
  hours_worked: number
  comment: string
  full_date: string
}

// Define grouped reports type
type GroupedReports = {
  [employeeId: number]: {
    employee_name: string
    employee_id: number
    reports: Report[]
    total_hours: number
  }
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
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number>(0)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  // Устанавливаем даты
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  )
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0])

  // Эффект для установки ID первого отдела после загрузки
  useEffect(() => {
    if (deps.length > 0 && selectedDepartmentId === 0) {
      setSelectedDepartmentId(deps[0].id)
    }
  }, [deps, selectedDepartmentId])

  // Функция для загрузки данных
  const loadDepartmentData = async (page: number = currentPage) => {
    if (!selectedDepartmentId) return

    setLoading(true)
    setError(null)

    try {
      const result = await fetchDepartmentData(selectedDepartmentId, startDate, endDate, page, pageSize)

      if (result.data) {
        setData(result.data)
        setCurrentPage(page)
      } else {
        setError(result.error || "Не удалось получить данные")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setLoading(false)
    }
  }

  // Загрузка данных при изменении selectedDepartmentId или дат
  useEffect(() => {
    if (selectedDepartmentId) {
      setCurrentPage(1) // Reset to first page when filters change
      loadDepartmentData(1)
    }
  }, [selectedDepartmentId, startDate, endDate, pageSize])

  // Обработчик изменения фильтров
  const handleFilterChange = () => {
    setCurrentPage(1)
    loadDepartmentData(1)
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    loadDepartmentData(page)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  // Group reports by employee for each date
  const groupReportsByEmployee = (reports: Report[]): GroupedReports => {
    return reports.reduce((acc, report) => {
      if (!acc[report.employee_id]) {
        acc[report.employee_id] = {
          employee_name: report.employee_name,
          employee_id: report.employee_id,
          reports: [],
          total_hours: 0,
        }
      }
      acc[report.employee_id].reports.push(report)
      acc[report.employee_id].total_hours += report.hours_worked
      return acc
    }, {} as GroupedReports)
  }

  const filteredReports = data?.reports_by_date || {}
  const totalReports = Object.values(filteredReports).flat().length
  const workingDays = Object.keys(filteredReports).length

  // Keyboard navigation support
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!data || loading) return

    // Only handle if no input is focused
    if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "SELECT") {
      return
    }

    switch (event.key) {
      case "ArrowLeft":
        if (data.pagination.has_previous) {
          event.preventDefault()
          handlePageChange(data.pagination.current_page - 1)
        }
        break
      case "ArrowRight":
        if (data.pagination.has_next) {
          event.preventDefault()
          handlePageChange(data.pagination.current_page + 1)
        }
        break
      case "Home":
        if (data.pagination.current_page !== 1) {
          event.preventDefault()
          handlePageChange(1)
        }
        break
      case "End":
        if (data.pagination.current_page !== data.pagination.total_pages) {
          event.preventDefault()
          handlePageChange(data.pagination.total_pages)
        }
        break
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [data, loading])

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <Image
            src={logo || "/placeholder.svg"}
            alt="logo"
            width={100}
            height={100}
            onClick={() => {
              window.location.href = "/profile"
            }}
            className="cursor-pointer hover:scale-110 transition-transform duration-300"
            unoptimized
            priority
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Панель активности сотрудников отдела
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Мониторинг производительности и отчетности по отделам
          </p>
        </header>

        {/* Filters Section */}
        <section className="bg-white rounded-lg sm:rounded-xl shadow-lg mb-6 sm:mb-8 border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Фильтры и настройки</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label htmlFor="department-select" className="block text-sm sm:text-base font-medium text-gray-700">
                  Отдел
                </label>
                <select
                  id="department-select"
                  className="block w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary bg-white"
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
                <label htmlFor="start-date" className="block text-sm sm:text-base font-medium text-gray-700">
                  Начало периода
                </label>
                <input
                  type="date"
                  id="start-date"
                  className="block w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="end-date" className="block text-sm sm:text-base font-medium text-gray-700">
                  Конец периода
                </label>
                <input
                  type="date"
                  id="end-date"
                  className="block w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="page-size" className="block text-sm sm:text-base font-medium text-gray-700">
                  Записей на странице
                </label>
                <select
                  id="page-size"
                  className="block w-full h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:border-secondary focus:ring-1 focus:ring-secondary bg-white"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFilterChange}
                  disabled={loading || depsLoading}
                  className="w-full h-10 sm:h-12 text-sm sm:text-base px-4 sm:px-6 bg-secondary text-white rounded-lg sm:rounded-xl hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium touch-manipulation"
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
                      <span className="hidden sm:inline">Загрузка...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Применить фильтры</span>
                      <span className="sm:hidden">Применить</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Department Summary */}
        <section className="bg-white rounded-lg sm:rounded-xl shadow-lg mb-6 sm:mb-8 border border-gray-200">
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                <div className="h-4 w-32 sm:w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-40 sm:w-56 bg-gray-200 rounded"></div>
              </div>
            ) : error ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки данных</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">{error}</p>
                <button
                  onClick={() => loadDepartmentData()}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-secondary text-white rounded-lg sm:rounded-xl hover:bg-secondary/90 transition-colors font-medium text-sm sm:text-base touch-manipulation"
                >
                  Попробовать снова
                </button>
              </div>
            ) : data ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {data.department_name}
                    </h2>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg">
                      <p className="text-gray-700">
                        <span className="font-medium">Период:</span>{" "}
                        <span className="block sm:inline mt-1 sm:mt-0">
                          {new Date(data.start_date).toLocaleDateString("ru-RU")} -{" "}
                          {new Date(data.end_date).toLocaleDateString("ru-RU")}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Общее время:</span>{" "}
                        <span className="font-bold text-secondary whitespace-nowrap">
                          {data.total_hours ? convertDataToNormalTime(data.total_hours) : "0ч 0м"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl border border-white/50 shadow-sm">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary">{totalReports}</div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium">Отчетов на странице</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl border border-white/50 shadow-sm">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary">
                          {data.pagination.total_reports}
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium">Всего отчетов</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  Нет данных для отображения
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">
                  Выберите отдел и период для просмотра отчетов
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced Pagination Controls */}
        {data && data.pagination.total_pages > 1 && (
          <section className="bg-white rounded-lg sm:rounded-xl shadow-lg mb-6 sm:mb-8 border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600 order-2 lg:order-1">
                  Страница {data.pagination.current_page} из {data.pagination.total_pages} (
                  {data.pagination.total_reports} отчетов всего)
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 order-1 lg:order-2">
                  {/* First/Previous buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={data.pagination.current_page === 1 || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      title="Первая страница"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                      </svg>
                      <span className="hidden sm:inline">Первая</span>
                    </button>

                    <button
                      onClick={() => handlePageChange(data.pagination.current_page - 1)}
                      disabled={!data.pagination.has_previous || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      title="Предыдущая страница"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Предыдущая</span>
                    </button>
                  </div>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.pagination.total_pages) }, (_, i) => {
                      let pageNum
                      if (data.pagination.total_pages <= 5) {
                        pageNum = i + 1
                      } else if (data.pagination.current_page <= 3) {
                        pageNum = i + 1
                      } else if (data.pagination.current_page >= data.pagination.total_pages - 2) {
                        pageNum = data.pagination.total_pages - 4 + i
                      } else {
                        pageNum = data.pagination.current_page - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors min-w-[40px] ${
                            pageNum === data.pagination.current_page
                              ? "bg-secondary text-white shadow-md"
                              : "border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                          title={`Страница ${pageNum}`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>

                  {/* Next/Last buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(data.pagination.current_page + 1)}
                      disabled={!data.pagination.has_next || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      title="Следующая страница"
                    >
                      <span className="hidden sm:inline">Следующая</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handlePageChange(data.pagination.total_pages)}
                      disabled={data.pagination.current_page === data.pagination.total_pages || loading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      title="Последняя страница"
                    >
                      <span className="hidden sm:inline">Последняя</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile-friendly pagination summary */}
                <div className="mt-4 lg:hidden">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      {data.pagination.current_page > 1 && (
                        <button
                          onClick={() => handlePageChange(data.pagination.current_page - 1)}
                          className="text-secondary hover:text-secondary/80"
                          disabled={loading}
                        >
                          ← Назад
                        </button>
                      )}
                    </span>
                    <span className="font-medium">
                      {data.pagination.current_page} / {data.pagination.total_pages}
                    </span>
                    <span>
                      {data.pagination.current_page < data.pagination.total_pages && (
                        <button
                          onClick={() => handlePageChange(data.pagination.current_page + 1)}
                          className="text-secondary hover:text-secondary/80"
                          disabled={loading}
                        >
                          Вперед →
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reports Section */}
        <section className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Отчеты по дням</h2>
          </div>
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="space-y-4 sm:space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="h-5 sm:h-6 w-32 sm:w-48 mb-3 sm:mb-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2 sm:space-y-3">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse hidden lg:block"></div>
                            <div className="h-4 bg-gray-200 rounded animate-pulse hidden lg:block"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="border border-gray-300 bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 mr-2 sm:mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div className="text-sm sm:text-base text-gray-800">
                    <strong>Ошибка:</strong> {error}
                  </div>
                </div>
              </div>
            ) : Object.keys(filteredReports).length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 sm:w-16 sm:h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  Нет отчетов за выбранный период
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4">
                  Попробуйте изменить период или выбрать другой отдел
                </p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {Object.entries(filteredReports).map(([date, reports]) => {
                  const groupedReports = groupReportsByEmployee(reports)
                  return (
                    <article
                      key={date}
                      className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <header className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                          {formatDatePretty(date)}
                        </h3>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                          {reports.length} отчет(ов) от {Object.keys(groupedReports).length} сотрудник(ов)
                        </p>
                      </header>

                      {/* Mobile Card View */}
                      <div className="block lg:hidden space-y-4">
                        {Object.values(groupedReports).map((employeeGroup) => (
                          <div key={employeeGroup.employee_id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="min-w-0">
                                  <div className="font-semibold text-gray-900 text-base">
                                    {employeeGroup.employee_name || "Неизвестный"}
                                  </div>
                                  <div className="text-sm text-gray-500">ID: {employeeGroup.employee_id}</div>
                                  <div className="text-sm font-medium text-secondary whitespace-nowrap">
                                    Всего: {convertDataToNormalTime(Number(employeeGroup.total_hours.toFixed(2)))}
                                  </div>
                                </div>
                              </div>
                              {onEmployeeClick && (
                                <button
                                  onClick={() =>
                                    onEmployeeClick(
                                      employeeGroup.employee_id,
                                      employeeGroup.employee_name || "Неизвестный",
                                    )
                                  }
                                  className="px-3 py-1 text-sm bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium touch-manipulation flex-shrink-0"
                                >
                                  Подробнее
                                </button>
                              )}
                            </div>
                            <div className="space-y-3 border-t border-gray-200 pt-3">
                              {employeeGroup.reports.map((report) => (
                                <div key={report.report_id} className="bg-white rounded-lg p-3 border border-gray-100">
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Функция:</span>
                                      <span className="font-medium text-gray-900 text-right">
                                        {report.function.name || "-"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Время:</span>
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary whitespace-nowrap">
                                        {report.hours_worked
                                          ? convertDataToNormalTime(Number(report.hours_worked.toFixed(2)))
                                          : "0ч 0м"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Отправлено:</span>
                                      <span className="text-gray-900 whitespace-nowrap">
                                        {formatISODate(report.full_date) || "-"}
                                      </span>
                                    </div>
                                    {report.comment && (
                                      <div className="pt-2 border-t border-gray-100">
                                        <span className="text-gray-600 text-xs">Комментарий:</span>
                                        <p className="text-gray-700 text-sm mt-1">{report.comment}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden lg:block overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Сотрудник</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Функция</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Время работы</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Комментарий</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Время отправки
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.values(groupedReports).map((employeeGroup) =>
                              employeeGroup.reports.map((report, index) => (
                                <tr key={report.report_id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4">
                                    {index === 0 ? (
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div>
                                            <div className="font-semibold text-gray-900">
                                              {employeeGroup.employee_name || "Неизвестный"}
                                            </div>
                                            <div className="text-sm text-gray-500">ID: {employeeGroup.employee_id}</div>
                                            <div className="text-sm font-medium text-secondary whitespace-nowrap">
                                              Всего:{" "}
                                              {convertDataToNormalTime(Number(employeeGroup.total_hours.toFixed(2)))}
                                            </div>
                                          </div>
                                        </div>
                                        {onEmployeeClick && (
                                          <button
                                            onClick={() =>
                                              onEmployeeClick(
                                                employeeGroup.employee_id,
                                                employeeGroup.employee_name || "Неизвестный",
                                              )
                                            }
                                            className="px-3 py-1 text-sm bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors font-medium"
                                          >
                                            Подробнее
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="pl-4 border-l-2 border-gray-200">
                                        <div className="text-sm text-gray-400">↳ продолжение</div>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{report.function.name || "-"}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-secondary whitespace-nowrap">
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
                                    <div className="text-sm text-gray-600 whitespace-nowrap">
                                      {formatISODate(report.full_date) || "-"}
                                    </div>
                                  </td>
                                </tr>
                              )),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
