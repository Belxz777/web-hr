"use client"

import type React from "react"
import { useState } from "react"
import { DateSelector } from "./DatePicker"
import { TabSwitcher } from "./TabSwitcher"

export default function DatePickerContainer() {
  const [activeTab, setActiveTab] = useState("day")
  const [selectedDate, setSelectedDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value)
    // Reset end date if it's before the new start date
    if (endDate && e.target.value > endDate) {
      setEndDate("")
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            <span className="inline-block mr-3">📅</span>
            Выбор даты
          </h1>
          <p className="text-muted-foreground text-lg">Выберите день или интервал дат</p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl shadow-xl p-8">
          <TabSwitcher activeTab={activeTab} onTabChange={handleTabChange} />

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
  )
}
