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

    setShouldFetch(true)
  }, [])

  useEffect(() => {
    if (shouldFetch) {
      fetchData()
    }
  }, [ selectedDate, startDate, endDate, activeTab, shouldFetch])

  const fetchData = async () => {


    try {
      setLoading(true)
      setError(null)

      const [data, dataPer] = await Promise.all([
        analyticsDepartments({
          ...(activeTab === "day" ? { date: selectedDate } : { startDate, endDate })
        }),
        analyticsDepartmentPercentage({
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
    setShouldFetch(true)
  }

  const getTitle = () => {
    if (activeTab === "day") {
      return `Аналитика за ${formatDisplayDate(selectedDate)}`
    } else {
      return `Аналитика за период ${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
    }
  }


  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header title="Аналитика отдела" showPanel={false} />
      <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <span className="inline-block mr-3"></span>
            Выбор даты
          </h1>
          <p className="text-muted-foreground text-lg">Выберите день или интервал дат</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-xl p-8">
          <TabSwitcher
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
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