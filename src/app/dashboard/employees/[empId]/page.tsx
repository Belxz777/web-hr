"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { useParams } from "next/navigation"
import type { EmployeeDistribution, EmployeeSummary } from "@/types"
import { CircularDiagram } from "@/components/dashboard/CircularDiagram"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import getEmployeeAnalytics from "@/components/server/analysis/employee"
import { DailySummaryGrid } from "@/components/buildIn/GridStats"
import { basicColorsHrs } from "@/store/sets"

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
  const { empId } = useParams()
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
      const date = new Date()
      date.setDate(date.getDate() - 7)
      setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      setEndDate(getCurrentDate())
      setSelectedDate("")
    }
  }

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}.${month}.${year}`
  }

  const totalTime = convertDataToNormalTime(employeeSummary?.summary?.total_hours || 0)
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

  const avgHoursPerReport =
    (employeeSummary?.reports_count || 0) > 0
      ? (employeeSummary?.summary?.total_hours || 0) / (employeeSummary?.reports_count || 1)
      : 0
  const avgTime = convertDataToNormalTime(avgHoursPerReport || 0)

  if (!employeeSummary || !employeeDistribution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col cursor-pointer">
        <Header title="Статистика сотрудника" showPanel={false} />
        <main className="container mx-auto p-4 flex-grow">
          <div className="grid w-full grid-cols-2 bg-card/90 backdrop-blur-sm rounded-xl overflow-hidden border border-border mb-4">
            <button
              onClick={() => handleTabChange("day")}
              className={`py-3 px-4 text-center transition-all duration-200 ${
                activeTab === "day"
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-foreground hover:bg-secondary/20"
              }`}
            >
              За день
            </button>
            <button
              onClick={() => handleTabChange("interval")}
              className={`py-3 px-4 text-center transition-all duration-200 ${
                activeTab === "interval"
                  ? "bg-primary text-primary-foreground font-medium shadow-sm"
                  : "text-foreground hover:bg-secondary/20"
              }`}
            >
              За период
            </button>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border mb-6">
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg m-4">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTab === "day" && (
                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                        <div className="text-foreground font-medium mb-3">Выбор дня</div>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                        />
                        <div className="text-muted-foreground mt-2 text-sm">
                          Выбрано: {formatDisplayDate(selectedDate)}
                        </div>
                      </div>
                    )}
                    {activeTab === "interval" && (
                      <>
                        <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                          <div className="text-foreground font-medium mb-3">Начальная дата</div>
                          <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                          />
                          <div className="text-muted-foreground mt-2 text-sm">
                            Выбрано: {formatDisplayDate(startDate)}
                          </div>
                        </div>
                        <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                          <div className="text-foreground font-medium mb-3">Конечная дата</div>
                          <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate}
                            className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                          />
                          <div className="text-muted-foreground mt-2 text-sm">
                            Выбрано: {formatDisplayDate(endDate)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-foreground text-lg bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                  Пожалуйста выберите дату
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
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col cursor-pointer">
      <Header title="Статистика сотрудника" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <div className="grid w-full grid-cols-2 bg-card/90 backdrop-blur-sm rounded-xl overflow-hidden border border-border mb-4">
          <button
            onClick={() => handleTabChange("day")}
            className={`py-3 px-4 text-center transition-all duration-200 ${
              activeTab === "day"
                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                : "text-foreground hover:bg-secondary/20"
            }`}
          >
            За день
          </button>
          <button
            onClick={() => handleTabChange("interval")}
            className={`py-3 px-4 text-center transition-all duration-200 ${
              activeTab === "interval"
                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                : "text-foreground hover:bg-secondary/20"
            }`}
          >
            За период
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border mb-6">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-primary-foreground">
                    {employeeSummary?.employee?.employee_surname || ""} {employeeSummary?.employee?.employee_name || ""}{" "}
                    {employeeSummary?.employee?.employee_patronymic || ""}
                  </h1>
                  <p className="text-primary-foreground/80">Должность: {employeeSummary?.employee?.job_title || ""}</p>
                  <p className="text-primary-foreground/80">ID: {employeeSummary?.employee?.employee_id || ""}</p>
                </div>
              </div>
            </div>

            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg m-4 cursor-pointer">
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTab === "day" && (
                    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                      <div className="text-foreground font-medium mb-3">Выбор дня</div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                      />
                      <div className="text-muted-foreground mt-2 text-sm">
                        Выбрано: {formatDisplayDate(selectedDate)}
                      </div>
                    </div>
                  )}

                  {activeTab === "interval" && (
                    <>
                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border cursor-pointer">
                        <div className="text-foreground font-medium mb-3">Начальная дата</div>
                        <input
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                        />
                        <div className="text-muted-foreground mt-2 text-sm">
                          Выбрано: {formatDisplayDate(startDate)}
                        </div>
                      </div>

                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                        <div className="text-foreground font-medium mb-3">Конечная дата</div>
                        <input
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          min={startDate}
                          className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                        />
                        <div className="text-muted-foreground mt-2 text-sm">
                          Выбрано: {formatDisplayDate(endDate)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm rounded-xl p-6 text-center border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Общее отработанное время</h3>
                  <div className="text-3xl font-bold text-primary">{totalTime}</div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm rounded-xl p-6 text-center border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Средние показатели</h3>
                  <div className="grid gap-2">
                    <div>
                      <div className="text-xl font-bold text-secondary">{avgTime}</div>
                      <div className="text-xs text-muted-foreground">часов на отчет</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-secondary/20 to-primary/20 backdrop-blur-sm rounded-xl p-6 text-center border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Период</h3>
                  <div className="text-xl font-bold text-foreground">
                    {employeeDistribution.query_params.date
                      ? formatDate(employeeDistribution.query_params.date)
                      : `${formatDate(employeeDistribution.query_params.start_date || "")} - ${formatDate(
                          employeeDistribution.query_params.end_date || "",
                        )}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border mb-6">
            {activeTab === "interval" && <DailySummaryGrid data={employeeSummary?.daily_summary || []} />}
          </div>
          <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border mb-6">
            <div className="p-4 border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
              <h3 className="text-xl font-bold text-foreground">Распределение часов</h3>
            </div>
            <div className="flex justify-center gap-4 p-6">
              <CircularDiagram data={hourDistributionData} title="" showtotal={true} />
              {/* <CircularDiagram data={hourDistributionDataType} title=""  showtotal={false} /> */}
            </div>
          </div>
          <div
            className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border mb-6"
            style={{ maxHeight: "calc(100vh - 400px)", overflowY: "scroll" }}
          >
            <div className="p-4 border-b border-border bg-gradient-to-r from-secondary/10 to-primary/10">
              <h3 className="text-xl font-bold text-foreground">Отчеты</h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Время
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Обязательная?
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Комментарий
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Дата
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(employeeSummary?.reports?.length || 0) === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                          Нет отчетов за выбранный период
                        </td>
                      </tr>
                    ) : (
                      (employeeSummary?.reports || []).map((report: any, index: number) => {
                        const workedHours = convertDataToNormalTime(report.worked_hours || 0)

                        return (
                          <tr key={report.laborCostId} className="hover:bg-secondary/5 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-foreground">
                              {report.function__funcName || report.deputy__deputyName || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-foreground">{workedHours}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {report.compulsory ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                                  Да
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary border border-secondary/30">
                                  Нет
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-foreground">{report.comment || ""}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-foreground">
                              {report.date ? new Date(report.date).toLocaleString("ru-RU") : "N/A"}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mb-6">
            <button
              className="px-6 py-3 bg-card/90 backdrop-blur-sm border border-border text-foreground rounded-xl hover:bg-secondary/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-md"
              onClick={() => window.print()}
            >
              Печать
            </button>
          </div>
        </div>
      </main>
      <UniversalFooter />
      {isLoading && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card/95 backdrop-blur-sm p-8 rounded-xl shadow-xl flex flex-col items-center border border-border">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary/30"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary absolute top-0 left-0"></div>
            </div>
            <p className="text-foreground font-medium">Обновление данных...</p>
          </div>
        </div>
      )}
    </div>
  )
}