"use client"

import { CircularDiagram } from "@/components/dashboard/CircularDiagram"

interface ChartData {
  label: string
  value: number
  color: string
}

interface ChartSectionProps {
  data: ChartData[]
  title: string
  showTotal?: boolean
}

export const ChartSection = ({ data, title, showTotal = true }: ChartSectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-xl">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="flex justify-center gap-4 p-6">
        <CircularDiagram data={data} title="" showtotal={showTotal} />
      </div>
    </div>
  )
}
