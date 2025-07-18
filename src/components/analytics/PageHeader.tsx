"use client"

import type React from "react"
import { DateSelector } from "./DatePicker"
import { formatDisplayDate } from "../utils/format"


interface PageHeaderProps {
  title: string
  date: string
  selectedDate: string
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string | null
}


export const PageHeader = ({ title, date, selectedDate, onDateChange, error }: PageHeaderProps) => {
  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-foreground mb-4 md:mb-0">
          {title} за {formatDisplayDate(date)}
        </h2>
        <DateSelector selectedDate={selectedDate} onDateChange={onDateChange} activeTab={""} startDate={""} endDate={""} onStartDateChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                  throw new Error("Function not implemented.")
              } } onEndDateChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                  throw new Error("Function not implemented.")
              } } />
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <span className="text-red-600 dark:text-red-300 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}
