"use client"


import { DateSelector } from "./DatePicker"
import { DepartmentSelector } from "./DepartmentPicker"
import { TabSwitcher } from "./TabSwitcher"
import { Department } from "@/types"

interface ControlPanelProps {
  activeTab: string
  selectedDate: string
  startDate: string
  endDate: string
  deps: Department[]
  selectedDep: number | null
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDepChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onTabChange: (value: string) => void
}

export const ControlPanel = ({
  activeTab,
  selectedDate,
  startDate,
  endDate,
  deps,
  selectedDep,
  onDateChange,
  onStartDateChange,
  onEndDateChange,
  onDepChange,
  onTabChange
}: ControlPanelProps) => {
  return (
    <div className="w-full mb-4">
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl mt-4 shadow-lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateSelector
              activeTab={activeTab}
              selectedDate={selectedDate}
              startDate={startDate}
              endDate={endDate}
              onDateChange={onDateChange}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
            />
            <DepartmentSelector
              deps={deps}
              selectedDep={selectedDep}
              onDepChange={onDepChange}
            />
            <TabSwitcher
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}