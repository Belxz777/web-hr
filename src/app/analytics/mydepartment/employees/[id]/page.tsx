"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { useParams, useSearchParams } from "next/navigation"
import type { EmployeeDistribution, EmployeeSummary } from "@/types"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import getEmployeeAnalytics from "@/components/server/analysis/employee"
import { TabSwitcher } from "@/components/analytics/TabSwitcher"
import { DateSelector } from "@/components/analytics/DatePicker"
import { ReportsTable } from "@/components/analytics/employee/ReportsTable"
import { LoadingOverlay } from "@/components/analytics/employee/LoadingOverlay"
import { StatsCards } from "@/components/analytics/employee/StatisticsEmployee"
import { EmployeeHeader } from "@/components/analytics/employee/CommonData"
import { ChartSection } from "@/components/analytics/employee/Chart"
import { DailySummarySection } from "@/components/analytics/employee/Summary"
import { FunctionDistributionSection } from "@/components/analytics/employee/FunctionDestribution"


const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Invalid date"
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getWeekAgoDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function EmployeeDailyStats() {
  const params = useParams()
  const searchParams = useSearchParams()
  const empId = typeof params.id === "string" ? params.id : params.id[0]

  // URL parameters
  const urlDate = searchParams.get("date")
  const urlStartDate = searchParams.get("start_date")
  const urlEndDate = searchParams.get("end_date")

  // State for dates
  const [selectedDate, setSelectedDate] = useState(urlDate || getCurrentDate())
  const [startDate, setStartDate] = useState(urlStartDate || getWeekAgoDate())
  const [endDate, setEndDate] = useState(urlEndDate || getCurrentDate())

  // State for tab
  const [activeTab, setActiveTab] = useState(() => {
    if (urlDate) return "day"
    if (urlStartDate && urlEndDate) return "interval"
    return "day" // Default to day tab
  })

  // Separate states for different data types
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary | null>(null)
  const [employeeDistribution, setEmployeeDistribution] = useState<EmployeeDistribution | null>(null)

  // Loading and error states
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [isLoadingDistribution, setIsLoadingDistribution] = useState(false)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch summary data (default)
  const fetchSummaryData = async () => {
    setIsLoadingSummary(true)
    setError(null)
    try {
      console.log("Fetching summary data...", { empId, activeTab, selectedDate, startDate, endDate })

      let summary
      if (activeTab === "interval") {
        summary = await getEmployeeAnalytics(Number(empId), "default", "period", {
          startDate: startDate,
          endDate: endDate,
        })
      } else {
        summary = await getEmployeeAnalytics(Number(empId), "default", "day", {
          date: selectedDate,
        })
      }

      console.log("Summary data received:", summary)
      setEmployeeSummary(summary)
    } catch (error) {
      console.error("Failed to fetch employee summary:", error)
      setError(`Ошибка загрузки основных данных: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`)
      setEmployeeSummary(null)
    } finally {
      setIsLoadingSummary(false)
    }
  }

  // Fetch distribution data (percentage)
  const fetchDistributionData = async () => {
    setIsLoadingDistribution(true)
    setError(null)
    try {
      console.log("Fetching distribution data...", { empId, activeTab, selectedDate, startDate, endDate })

      let distribution
      if (activeTab === "interval") {
        distribution = await getEmployeeAnalytics(Number(empId), "percentage", "period", {
          startDate: startDate,
          endDate: endDate,
        })
      } else {
        distribution = await getEmployeeAnalytics(Number(empId), "percentage", "day", {
          date: selectedDate,
        })
      }

      console.log("Distribution data received:", distribution)
      setEmployeeDistribution(distribution)
    } catch (error) {
      console.error("Failed to fetch employee distribution:", error)
      setError(`Ошибка загрузки данных распределения: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`)
      setEmployeeDistribution(null)
    } finally {
      setIsLoadingDistribution(false)
    }
  }

  // Fetch both data types
  const fetchAllData = async () => {
    console.log("Starting to fetch all data...")
    await Promise.all([fetchSummaryData(), fetchDistributionData()])
    setHasInitialLoad(true)
    console.log("All data fetching completed")
  }

  // Initial load effect - runs once on component mount
  useEffect(() => {
    console.log("Component mounted, starting initial data fetch...")
    fetchAllData()
  }, []) // Empty dependency array for initial load only

  // Effect for data refetching when parameters change (after initial load)
  useEffect(() => {
    if (hasInitialLoad) {
      console.log("Parameters changed, refetching data...")
      fetchAllData()
    }
  }, [selectedDate, startDate, endDate, activeTab, empId, hasInitialLoad])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Date changed to:", e.target.value)
    setSelectedDate(e.target.value)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Start date changed to:", e.target.value)
    setStartDate(e.target.value)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("End date changed to:", e.target.value)
    setEndDate(e.target.value)
  }

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab)
    setActiveTab(tab)
    // Clear data when switching tabs
    setEmployeeSummary(null)
    setEmployeeDistribution(null)
    setError(null)

    if (tab === "day") {
      setSelectedDate(getCurrentDate())
    } else {
      setStartDate(getWeekAgoDate())
      setEndDate(getCurrentDate())
    }
  }

  // Compute loading state
  const isLoading = isLoadingSummary || isLoadingDistribution

  // Prepare data for display
  const totalTime = convertDataToNormalTime(employeeSummary?.summary?.total_hours || 0)
  const avgHoursPerReport =
    (employeeSummary?.reports_count || 0) > 0
      ? (employeeSummary?.summary?.total_hours || 0) / (employeeSummary?.reports_count || 1)
      : 0
  const avgTime = convertDataToNormalTime(avgHoursPerReport || 0)

  const hourDistributionData = [
    {
      label: "Основные",
      value: employeeSummary?.summary?.compulsory_hours || 0,
      color: "#32CD32",
    },
    {
      label: "Дополнительные",
      value: employeeSummary?.summary?.non_compulsory_hours || 0,
      color: "#F0E68C",
    },
  ]

  const period = employeeDistribution?.time_period?.date
    ? formatDate(employeeDistribution.time_period.date)
    : employeeDistribution?.time_period?.start_date && employeeDistribution?.time_period?.end_date
      ? `${formatDate(employeeDistribution.time_period.start_date)} - ${formatDate(employeeDistribution.time_period.end_date)}`
      : "Период не определен"

  // Show loading state during initial load
  if (!hasInitialLoad && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">
        <Header title="Статистика сотрудника" showPanel={false} />
        <main className="container mx-auto p-6 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center justify-center p-16">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Загрузка данных сотрудника...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Получаем актуальную статистику</p>
                <div className="mt-6 flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <UniversalFooter />
      </div>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">
        <Header title="Статистика сотрудника" showPanel={false} />
        <main className="container mx-auto p-6 flex-grow">
          <div className="max-w-4xl mx-auto">
            <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-8">
                <DateSelector
                  activeTab={activeTab}
                  selectedDate={selectedDate}
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
              </div>
              <div className="flex flex-col items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Ошибка загрузки данных
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null)
                      fetchAllData()
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Попробовать снова
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <UniversalFooter />
      </div>
    )
  }

  // Show no data state if no data after initial load
  if (hasInitialLoad && !employeeSummary && !employeeDistribution && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">
        <Header title="Статистика сотрудника" showPanel={false} />
        <main className="container mx-auto p-6 flex-grow">
          <div className="max-w-4xl mx-auto">
            <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8">
              <div className="p-8">
                <DateSelector
                  activeTab={activeTab}
                  selectedDate={selectedDate}
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
              </div>
              <div className="flex flex-col items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Данные не найдены</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base mb-4">
                    Нет данных для выбранного периода. Попробуйте выбрать другую дату.
                  </p>
                  <button
                    onClick={() => fetchAllData()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Обновить данные
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <UniversalFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      <Header title="Статистика сотрудника" showPanel={false} />
      <main className="container mx-auto p-6 flex-grow">
        <div className="max-w-7xl mx-auto space-y-8">
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Employee Header Card */}
          <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            {employeeSummary?.employee && <EmployeeHeader employee={employeeSummary.employee} />}
            <div className="p-8 border-t border-gray-200 dark:border-gray-700">
              <DateSelector
                activeTab={activeTab}
                selectedDate={selectedDate}
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            </div>
            <StatsCards totalTime={totalTime} avgTime={avgTime} period={period} />
          </div>

          {/* Function Distribution Section */}
          <FunctionDistributionSection
            distribution={employeeDistribution?.distribution}
            totalHours={employeeDistribution?.total_hours || 0}
          />

          {/* Daily Summary for Interval */}
          <DailySummarySection data={employeeSummary?.daily_summary || []} isVisible={activeTab === "interval"} />

          {/* Chart Section */}
          <ChartSection data={hourDistributionData} title="Распределение часов" showTotal={true} />

          {/* Reports Table */}
          <ReportsTable reports={employeeSummary?.reports || []} convertDataToNormalTime={convertDataToNormalTime} />
        </div>
      </main>
      <UniversalFooter />
      <LoadingOverlay isVisible={isLoading && hasInitialLoad} message="Обновление данных..." />
    </div>
  )
}
