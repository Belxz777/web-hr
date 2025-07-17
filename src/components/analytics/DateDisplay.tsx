"use client"

import { DepartmentStatsInDay } from "@/components/dashboard/DepartmentStatsInDay"
import { TopFunctions } from "@/components/dashboard/TopFunctions"
import { Bytypes } from "@/components/dashboard/typesdist"
import { EmployeeStats } from "@/components/dashboard/EmployeeStats"
import { DailyStats, DepartmentDistribution } from "@/types"

interface DataDisplayProps {
  loading: boolean
  error: string | null
  dataInDay: DailyStats | null
  dataInDayPer: DepartmentDistribution | null
  title: string
}

export const DataDisplay = ({
  loading,
  error,
  dataInDay,
  dataInDayPer,
  title
}: DataDisplayProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary/30"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary absolute top-0 left-0"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-primary bg-primary/10 border border-primary/20 p-6 rounded-xl text-center backdrop-blur-sm">
        <div className="font-medium">{error}</div>
      </div>
    )
  }

  if (!dataInDay || !dataInDayPer) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <DepartmentStatsInDay data={dataInDay.department_stats} title={title}/>
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
  )
}