"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import type { DailyStats, Department, DepartmentDistribution } from "@/types"
import { DepartmentStatsInDay } from "@/components/dashboard/DepartmentStatsInDay"
import { Bytypes } from "@/components/dashboard/typesdist"
import { EmployeeStats } from "@/components/dashboard/EmployeeStats"
import { TopFunctions } from "@/components/dashboard/TopFunctions"
import { analyticsDepartments, analyticsDepartmentPercentage } from "@/components/server/analysis/departmentanalysis"
import getAllDepartments from "@/components/server/admin/departments"

const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function AnalyticsDashboard() {
  const [dataInDay, setDataInDay] = useState<DailyStats | null>(null)
  const [deps, setDeps] = useState<Department[]>([])
  const [dataInDayPer, setDataInDayPer] = useState<DepartmentDistribution | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Date states
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
  const [selectedDep, setSelectedDep] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("day")

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const allDepartments = await getAllDepartments()
        setDeps(allDepartments)
        if (allDepartments.length > 0) {
          setSelectedDep(allDepartments[0].departmentId)
        }
      } catch (err) {
        console.error("Ошибка при загрузке департаментов:", err)
        setError("Ошибка при загрузке департаментов")
      }
    }

    fetchDepartments()
  }, [])

  // Fetch data when department or dates change
  useEffect(() => {
    if (selectedDep) {
      fetchData()
    }
  }, [selectedDep, selectedDate, activeTab])

  const fetchData = async () => {
    if (!selectedDep) return

    try {
      setLoading(true)
      setError(null)

      let data, dataPer

      if (activeTab === "day") {
        // Fetch data for a single day
        data = await analyticsDepartments({
          depId: selectedDep,
          date: selectedDate,
        })
        dataPer = await analyticsDepartmentPercentage({
          depId: selectedDep,
          date: selectedDate,
        })
      } else {
        // Fetch data for a date range
        data = await analyticsDepartments({
          depId: selectedDep,
          startDate: startDate,
          endDate: endDate,
        })
        dataPer = await analyticsDepartmentPercentage({
          depId: selectedDep,
          startDate: startDate,
          endDate: endDate,
        })
      }

      setDataInDay(data)
      setDataInDayPer(dataPer)
    } catch (err) {
      setError(`Ошибка при загрузке данных для ${activeTab} error ${err}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
  }

  const handleDepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDep(Number(e.target.value))
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}.${month}.${year}`
  }

  const getTitle = () => {
    if (activeTab === "day") {
      return `Аналитика за ${formatDisplayDate(selectedDate)}`
    } else {
      return `Аналитика за период ${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
      <Header title="Аналитика по отделам" showPanel={false} />

      <div className="p-4">
        <div className="w-full mb-4">
          <div className="grid w-full grid-cols-2 bg-card/90 backdrop-blur-sm rounded-xl overflow-hidden border border-border">
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

          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl mt-4 shadow-lg">
            <div className="p-6 space-y-4">
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
                    <div className="text-muted-foreground mt-2 text-sm">Выбрано: {formatDisplayDate(selectedDate)}</div>
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
                      <div className="text-muted-foreground mt-2 text-sm">Выбрано: {formatDisplayDate(startDate)}</div>
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
                      <div className="text-muted-foreground mt-2 text-sm">Выбрано: {formatDisplayDate(endDate)}</div>
                    </div>
                  </>
                )}

                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                  <div className="text-foreground font-medium mb-3">Выбор департамента</div>
                  <select
                    value={selectedDep || ""}
                    onChange={handleDepChange}
                    className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all"
                  >
                    {deps.map((dep) => (
                      <option key={dep.departmentId} value={dep.departmentId}>
                        {dep.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={fetchData}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Обновить данные
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <h2 className="text-xl font-bold text-foreground bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border shadow-sm">
          {getTitle()}
        </h2>
      </div>

      <main className="px-4 my-8 space-y-8 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary/30"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary absolute top-0 left-0"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-primary bg-primary/10 border border-primary/20 p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="font-medium">{error}</div>
          </div>
        ) : dataInDay && selectedDep ? (
          <div className="space-y-6">   
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
              <DepartmentStatsInDay data={dataInDay.department_stats} />
            </div>
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
              {dataInDayPer?.distribution && <TopFunctions data={dataInDayPer.distribution} />}
            </div>
            
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
                {dataInDayPer?.distribution && <Bytypes data={dataInDayPer.distribution} />}
            </div>
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
              <EmployeeStats data={dataInDay.employee_stats} />
            </div>
         
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-12 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
            <div className="text-lg">Выберите параметры для загрузки данных</div>
          </div>
        )}
      </main>

      <UniversalFooter />
    </div>
  )
}