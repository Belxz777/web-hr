"use client"

import { DailySummaryGrid } from "@/components/buildIn/GridStats"

interface DailySummarySectionProps {
  data: any[]
  isVisible: boolean
}

export const DailySummarySection = ({ data, isVisible }: DailySummarySectionProps) => {
  if (!isVisible) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <DailySummaryGrid data={data} />
    </div>
  )
}
