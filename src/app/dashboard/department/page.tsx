"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import type { DailyStats, Department } from "@/types"
import { DepartmentStatsInDay } from "@/components/dashboard/DepartmentStatsInDay"
import { DepartmentStatsInDayPer } from "@/components/dashboard/DepartmentStatsInDayPer"
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
  const [dataInDayPer, setDataInDayPer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Date states
  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [startDate, setStartDate] = useState(getCurrentDate())
  const [endDate, setEndDate] = useState(getCurrentDate())
  const [   selectedDep, setSelectedDep] = useState<number | null>(null)
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
    <div className="mainProfileDiv">
      <Header title="Аналитика по отделам"  showPanel={false} />

      <div className="p-4">
        <div className="w-full mb-4">
          <div className="grid w-full grid-cols-2 bg-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => handleTabChange("day")}
              className={`py-2 px-4 text-center transition-colors ${activeTab === "day" ? "bg-gray-600 font-medium" : "hover:bg-gray-600/50"}`}
            >
              За день
            </button>
            <button
              onClick={() => handleTabChange("interval")}
              className={`py-2 px-4 text-center transition-colors ${activeTab === "interval" ? "bg-gray-600 font-medium" : "hover:bg-gray-600/50"}`}
            >
              За период
            </button>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg mt-4">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === "day" && (
                  <div className="bg-gray-700 rounded-xl p-4">
                    <div className="text-white font-medium mb-2">Выбор дня</div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <div className="text-gray-400 mt-2 text-sm">Выбрано: {formatDisplayDate(selectedDate)}</div>
                  </div>
                )}

                {activeTab === "interval" && (
                  <>
                    <div className="bg-gray-700 rounded-xl p-4">
                      <div className="text-white font-medium mb-2">Начальная дата</div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                      <div className="text-gray-400 mt-2 text-sm">Выбрано: {formatDisplayDate(startDate)}</div>
                    </div>

                    <div className="bg-gray-700 rounded-xl p-4">
                      <div className="text-white font-medium mb-2">Конечная дата</div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        min={startDate}
                        className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      />
                      <div className="text-gray-400 mt-2 text-sm">Выбрано: {formatDisplayDate(endDate)}</div>
                    </div>
                  </>
                )}

                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="text-white font-medium mb-2">Выбор департамента</div>
                  <select
                    value={selectedDep || ""}
                    onChange={handleDepChange}
                    className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  >
                    {deps.map((dep) => (
                      <option key={dep.departmentId} value={dep.departmentId}>
                        {dep.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={fetchData}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                >
                  Обновить данные
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold m-4">{getTitle()}</h2>

      <main className="px-4 my-8 space-y-8">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</div>
        ) : dataInDay ? (
          <>
            <DepartmentStatsInDay data={dataInDay.department_stats} />
            <DepartmentStatsInDayPer data={dataInDayPer?.distribution} />
            <EmployeeStats data={dataInDay.employee_stats} />
            <TopFunctions data={dataInDayPer?.distribution} />
          </>
        ) : (
          <div className="text-gray-500 text-center py-8">Выберите параметры для загрузки данных</div>
        )}
      </main>

      <UniversalFooter />
    </div>
  )
}
