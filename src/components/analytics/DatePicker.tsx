"use client"

import type React from "react"
import { formatDisplayDate } from "../utils/format"

interface DateSelectorProps {
  activeTab: string
  selectedDate: string
  startDate: string
  endDate: string
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
)

const CalendarRangeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2" />
  </svg>
)

export const DateSelector = ({
  activeTab,
  selectedDate,
  startDate,
  endDate,
  onDateChange,
  onStartDateChange,
  onEndDateChange,
}: DateSelectorProps) => {
  return (
    <div className="space-y-4 cursor-pointer">
      {activeTab === "day" && (
        <div className="group">
          <div className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-foreground font-semibold text-lg">Выберите день</div>
            </div>

            <div className="relative  cursor-pointer">
              <input
                type="date"
                value={selectedDate}
                onChange={onDateChange}
                className="bg-background/80 border-2 border-input text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-all duration-200 hover:border-blue-500/50 text-base font-medium"
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30">
              <div className="text-muted-foreground text-sm font-medium mb-1">Выбранная дата:</div>
              <div className="text-foreground font-semibold">{formatDisplayDate(selectedDate)}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "interval" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="group">
            <div className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <div className="w-5 h-5 text-green-600 flex items-center justify-center font-bold text-lg">📅</div>
                </div>
                <div className="text-foreground font-semibold text-lg">Начальная дата</div>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={onStartDateChange}
                  className="bg-background/80 border-2 border-input text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-full transition-all duration-200 hover:border-green-500/50 text-base font-medium"
                />
              </div>

              <div className="mt-4 p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                <div className="text-muted-foreground text-sm font-medium mb-1">Выбрано:</div>
                <div className="text-foreground font-semibold">{formatDisplayDate(startDate)}</div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-br from-background to-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <div className="w-5 h-5 text-red-600 flex items-center justify-center font-bold text-lg">📆</div>
                </div>
                <div className="text-foreground font-semibold text-lg">Конечная дата</div>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={onEndDateChange}
                  min={startDate}
                  className="bg-background/80 border-2 border-input text-foreground p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-full transition-all duration-200 hover:border-red-500/50 text-base font-medium"
                />
              </div>

              <div className="mt-4 p-3 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-800/30">
                <div className="text-muted-foreground text-sm font-medium mb-1">Выбрано:</div>
                <div className="text-foreground font-semibold">{formatDisplayDate(endDate)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
