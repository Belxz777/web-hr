"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Header } from "@/components/ui/header"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { DailyStats, DepartmentDistribution } from "@/types"
import { analyticsDepartments, analyticsDepartmentPercentage } from "@/components/server/analysis/departmentanalysis"

import { TabSwitcher } from "@/components/analytics/TabSwitcher"
import { DateSelector } from "@/components/analytics/DatePicker"
import { formatDisplayDate } from "@/components/utils/format"
import { DataDisplay } from "@/components/analytics/DateDisplay"

const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export default function DepartmentAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const departmentId = Number(params.id)

  const [dataInDay, setDataInDay] = useState<DailyStats | null>(null)
  const [dataInDayPer, setDataInDayPer] = useState<DepartmentDistribution | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldFetch, setShouldFetch] = useState(false)

  const [selectedDate, setSelectedDate] = useState(getCurrentDate())
  const [startDate, setStartDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(getCurrentDate())
  const [activeTab, setActiveTab] = useState("day")

  useEffect(() => {
    if (isNaN(departmentId)) {
      setError("Неверный ID департамента")
      return
    }
    setShouldFetch(true)
  }, [departmentId])

  useEffect(() => {
    if (shouldFetch) {
      fetchData()
    }
  }, [departmentId, selectedDate, startDate, endDate, activeTab, shouldFetch])

  const fetchData = async () => {
    if (isNaN(departmentId)) return

    try {
      setLoading(true)
      setError(null)

      const [data, dataPer] = await Promise.all([
        analyticsDepartments({
          depId: departmentId,
          ...(activeTab === "day" ? { date: selectedDate } : { startDate, endDate })
        }),
        analyticsDepartmentPercentage({
          depId: departmentId,
          ...(activeTab === "day" ? { date: selectedDate } : { startDate, endDate })
        })
      ])

      setDataInDay(data)
      setDataInDayPer(dataPer)
    } catch (err) {
      setError(`Ошибка при загрузке данных: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
      setShouldFetch(false)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    setShouldFetch(true)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    setShouldFetch(true)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
    setShouldFetch(true)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setDataInDay(null)
    setDataInDayPer(null)
    setShouldFetch(false)
  }

  const getTitle = () => {
    if (activeTab === "day") {
      return `Аналитика за ${formatDisplayDate(selectedDate)}`
    } else {
      return `Аналитика за период ${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
    }
  }

  if (isNaN(departmentId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
        <Header title="Аналитика отдела" showPanel={false} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-primary bg-primary/10 border border-primary/20 p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="font-medium">Неверный ID департамента</div>
          </div>
        </main>
        <UniversalFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
      <Header title="Аналитика отдела" showPanel={false} />
      <div className="p-4">
        <div className="w-full mb-4">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl mt-4 shadow-lg">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateSelector
                  activeTab={activeTab}
                  selectedDate={selectedDate}
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={handleDateChange}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
                <TabSwitcher
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="px-4 my-4 space-y-2 flex-grow">
        <DataDisplay
          loading={loading}
          error={error}
          dataInDay={dataInDay}
          dataInDayPer={dataInDayPer}
          title={getTitle()}
        />
      </main>
      <UniversalFooter />
    </div>
  )
}