"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import Link from "next/link"
import analyticsDepartmentInDay from "@/components/server/analyticsDepartmentInDay"
import analyticsDepartmentInDayPercentager from "@/components/server/analyticsDepartmentInDayPercentager"
import getAllDepartments from "@/components/server/departments"
import type { DailyStats, Department } from "@/types"
import { DepartmentStatsInDay } from "@/components/dashborad/DepartmentStatsInDay"
import { DepartmentStatsInDayPer } from "@/components/dashborad/DepartmentStatsInDayPer"
import { EmployeeStats } from "@/components/dashborad/EmployeeStats"
import { TopFunctions } from "@/components/dashborad/TopFunctions"


const getCurrentDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function PerDay() {
  const [dataInDay, setDataInDay] = useState<DailyStats | null>(null)
  const [deps, setDeps] = useState<Department[]>([])
  const [dataInDayPer, setDataInDayPer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [selectedDep, setSelectedDep] = useState<number | null>(null)

  // Fetch departments and set the first one as selected
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

  // Fetch data whenever selectedDep or selectedDate changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDep) return

      try {
        setLoading(true)
        setError(null)
        const data = await analyticsDepartmentInDay(selectedDep, selectedDate)
        const dataPer = await analyticsDepartmentInDayPercentager(selectedDate, selectedDep)
        setDataInDay(data)
        setDataInDayPer(dataPer)
      } catch (err) {
        setError("Ошибка при загрузке данных")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedDep, selectedDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleDepChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDep(Number(e.target.value))
  }

  const formatDisplayDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}.${month}.${year}`
  }

  return (
    <div className="mainProfileDiv">
      <Header title="Аналитика за день" showPanel={false} buttons/>

      {/* Navigation tabs */}
   

      {/* Quick navigation buttons */}


      <h2 className="text-xl font-bold m-3">Статистика отдела за {formatDisplayDate(selectedDate)}</h2>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl p-4 m-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          
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

      {/* Statistics display */}
      <main className="my-8 space-y-8">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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
          <div className="text-gray-500 text-center py-8">Нет данных для выбранных параметров</div>
        )}
      </main>

      <UniversalFooter />
    </div>
  )
}
