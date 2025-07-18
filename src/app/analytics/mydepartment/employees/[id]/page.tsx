"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { useParams } from "next/navigation"
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

// Импорт компонентов

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

export default function EmployeeDailyStats() {
const params = useParams()
  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  })
  const [endDate, setEndDate] = useState(getCurrentDate())
  const [employeeSummary, setEmployeeSummary] = useState<EmployeeSummary>()
  const [activeTab, setActiveTab] = useState("day")
  const [employeeDistribution, setEmployeeDistribution] = useState<EmployeeDistribution>()
  const empId = typeof params.id === 'string' ? params.id : params.id[0]
  const [isLoading, setIsLoading] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === "interval") {
        const [summary, distribution] = await Promise.all([
          getEmployeeAnalytics(Number(empId), "default", "period", {
            startDate: startDate,
            endDate: endDate,
          }),
          getEmployeeAnalytics(Number(empId), "percentage", "period", {
            startDate: startDate,
            endDate: endDate,
          }),
        ])
        setEmployeeSummary(summary)
        setEmployeeDistribution(distribution)
      } else {
        const [summary, distribution] = await Promise.all([
          getEmployeeAnalytics(Number(empId), "default", "day", {
            date: selectedDate,
          }),
          getEmployeeAnalytics(Number(empId), "percentage", "day", {
            
            date: selectedDate,
          }),
        ])
        setEmployeeSummary(summary)
        setEmployeeDistribution(distribution)
      }
    } catch (error) {
      console.error("Failed to fetch employee data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (shouldFetch) {
      fetchData()
    }
  }, [selectedDate, startDate, endDate, activeTab, empId, shouldFetch])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setShouldFetch(true)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    if (endDate) {
      setShouldFetch(true)
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
    if (startDate) {
      setShouldFetch(true)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setEmployeeSummary(undefined)
    setEmployeeDistribution(undefined)
    setShouldFetch(false)
    if (tab === "day") {
      setSelectedDate(getCurrentDate())
      setStartDate("")
      setEndDate("")
    } else {
      setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])
      setEndDate(getCurrentDate())
      setSelectedDate("")
    }
  }

  // Подготовка данных
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

  const period = employeeDistribution?.query_params?.date
    ? formatDate(employeeDistribution.query_params.date)
    : `${formatDate(employeeDistribution?.query_params?.start_date || "")} - ${formatDate(
        employeeDistribution?.query_params?.end_date || "",
      )}`

  // Если данных нет, показываем форму выбора даты
  if (!employeeSummary || !employeeDistribution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">
        <Header title="Статистика сотрудника" showPanel={false} />
        <main className="container mx-auto p-4 flex-grow">
          <div className="max-w-4xl mx-auto">
            <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="p-6">
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

              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-gray-600 dark:text-gray-400 text-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  Пожалуйста, выберите дату (загрузка произойдет после выбора даты)
                </p>
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
      <main className="container mx-auto p-4 flex-grow">
        <div className="max-w-6xl mx-auto">
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <EmployeeHeader employee={employeeSummary.employee || {}} />

            <div className="p-6">
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

          <DailySummarySection data={employeeSummary?.daily_summary || []} isVisible={activeTab === "interval"} />

          <ChartSection data={hourDistributionData} title="Распределение часов" showTotal={true} />

          <ReportsTable reports={employeeSummary?.reports || []} convertDataToNormalTime={convertDataToNormalTime} />

        </div>
      </main>
      <UniversalFooter />
      <LoadingOverlay isVisible={isLoading} message="Обновление данных..." />
    </div>
  )
}
