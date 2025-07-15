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
  const [shouldFetch, setShouldFetch] = useState(false)

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

  useEffect(() => {
    if (selectedDep && shouldFetch) {
      fetchData()
    }
  }, [selectedDep, selectedDate, startDate, endDate, activeTab, shouldFetch])

  const fetchData = async () => {
    if (!selectedDep) return

    try {
      setLoading(true)
      setError(null)

      let data, dataPer

      if (activeTab === "day") {
        data = await analyticsDepartments({
          depId: selectedDep,
          date: selectedDate,
        })
        dataPer = await analyticsDepartmentPercentage({
          depId: selectedDep,
          date: selectedDate,
        })
      } else {
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

  const handleDepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDep(Number(e.target.value))
    setShouldFetch(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setDataInDay(null)
    setDataInDayPer(null)
    setShouldFetch(false)
    if (value === "day") {
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

  const getTitle = () => {
    if (activeTab === "day") {
      return `Аналитика за ${formatDisplayDate(selectedDate)}`
    } else {
      return `Аналитика за период ${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
    }
  }

  if (!dataInDay || !dataInDayPer || !selectedDep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
        <Header title="Аналитика по отделам" showPanel={false} />
        <div className="p-4">
          <div className="w-full mb-4">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl mt-4 shadow-lg">
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTab === "day" && (
                    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                      <div className="text-foreground font-medium mb-2">Выберите день</div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
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
                          className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
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
                          className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
                        />
                        <div className="text-muted-foreground mt-2 text-sm">
                          Выбрано: {formatDisplayDate(endDate)}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                    <div className="text-foreground font-medium mb-3">Выбор департамента</div>
                    <select
                      value={selectedDep || ""}
                      onChange={handleDepChange}
                      className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
                    >
                      {deps.map((dep) => (
                        <option key={dep.departmentId} value={dep.departmentId}>
                          {dep.departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                   <div className="flex items-center justify-between mb-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={activeTab === "interval"}
                          onChange={()=>handleTabChange(activeTab === "interval" ? "day" : "interval")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-2 text-xl font-medium text-foreground">
                          {activeTab === "day" ? "День" : "Интервал"}
                        </span>
                      </label>                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <main className="px-4 my-8 space-y-8 flex-grow">
          <div className="text-muted-foreground text-center py-12 bg-white/80 rounded-xl border border-border">
            <div className="text-lg">Пожалуйста выберите дату</div>
          </div>
        </main>
        <UniversalFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
      <Header title="Аналитика по отделам" showPanel={false} />
      <div className="p-4">
        <div className="w-full mb-4">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl mt-4 shadow-lg">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === "day" && (
                  <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                    <div className="text-foreground font-medium mb-3">Выберите день</div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
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
                        className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
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
                        className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
                      />
                      <div className="text-muted-foreground mt-2 text-sm">
                        Выбрано: {formatDisplayDate(endDate)}
                      </div>
                    </div>
                  </>
                )}
                <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
                  <div className="text-foreground font-medium mb-3">Выбор департамента</div>
                  <select
                    value={selectedDep || ""}
                    onChange={handleDepChange}
                    className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
                  >
                    {deps.map((dep) => (
                      <option key={dep.departmentId} value={dep.departmentId}>
                        {dep.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                 <div className="flex items-center justify-between mb-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={activeTab === "interval"}
                          onChange={()=>handleTabChange(activeTab === "interval" ? "day" : "interval")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-2 text-xl font-medium text-foreground">
                          {activeTab === "day" ? "День" : "Интервал"}
                        </span>
                      </label>                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="px-4 my-4 space-y-2 flex-grow">
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
        ) : (
          <div className="space-y-6">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
              <DepartmentStatsInDay data={dataInDay.department_stats} title={getTitle()}/>
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
        )}
      </main>
      <UniversalFooter />
    </div>
  )
}