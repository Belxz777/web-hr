"use client"

import { Department } from "@/types"

interface DepartmentSelectorProps {
  deps: Department[]
  selectedDep: number | null
  onDepChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const DepartmentSelector = ({
  deps,
  selectedDep,
  onDepChange
}: DepartmentSelectorProps) => {
  return (
    <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-border">
      <div className="text-foreground font-medium mb-3">Выбор департамента</div>
      <select
        value={selectedDep || ""}
        onChange={onDepChange}
        className="bg-background border border-input text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full transition-all duration-200"
      >
        {deps.map((dep) => (
          <option key={dep.departmentId} value={dep.departmentId}>
            {dep.departmentName}
          </option>
        ))}
      </select>
    </div>
  )
}