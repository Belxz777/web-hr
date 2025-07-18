"use client"

import { DepartmentCard } from "@/components/dashboard/generalStats/DepartmentCard"
import { EmptyState } from "@/components/dashboard/generalStats/EmptyState"
import { DepartmentForStats } from "@/types"

interface DepartmentsGridProps {
  departments: DepartmentForStats[]
  totalDepartments: number
  date: string
}

export const DepartmentsGrid = ({ departments, totalDepartments, date }: DepartmentsGridProps) => {
  const hasData = departments.some(
    (dept) => dept.department_stats.total_hours > 0 || dept.department_stats.employee_count > 0,
  )

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🏢</span>
          Отделы ({totalDepartments})
        </h3>
      </div>

      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <DepartmentCard key={department.department_id} department={department} />
          ))}
        </div>
      ) : (
        <EmptyState date={date} />
      )}
    </div>
  )
}
