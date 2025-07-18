"use client"

import { Department, DepartmentForStats, DepartmentsData } from "@/types"



interface DepartmentsTableProps {
  departments: DepartmentForStats[]
}

export const DepartmentsTable = ({ departments }: DepartmentsTableProps) => {
  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-2xl border border-border shadow-sm mb-6 overflow-hidden">
      <div className="p-6 border-b border-border bg-gradient-to-r from-muted/50 to-muted/30">
        <h3 className="text-xl font-bold text-foreground">Таблица отделов</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Название отдела
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Всего часов
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Основные функции
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Дополнительные обязанности
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Сотрудников
              </th>
            </tr>
        </thead>
          <tbody className="bg-card divide-y divide-border">
            {departments.map((department) => (
              <tr key={department.department_id} className="hover:bg-muted/20 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">
                  {department.department_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                  {department.department_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                  {department.department_stats.total_hours.toFixed(1)} ч
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {department.department_stats.function_hours.toFixed(1)} ч
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                    {department.department_stats.deputy_hours.toFixed(1)} ч
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👥</span>
                    {department.department_stats.employee_count}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
