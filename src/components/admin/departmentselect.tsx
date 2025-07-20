"use client"

import type { Department } from "./index"

interface DepartmentSelectorProps {
  departments: Department[]
  onBack: () => void
  onSelectDepartment: (departmentId: number) => void
}

export default function DepartmentSelector({ departments, onBack, onSelectDepartment }: DepartmentSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600">
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Выбор отдела</h2>
      </div>
      <div className="space-y-2">
        {departments.map((dept) => (
          <button
            key={dept.departmentId}
            onClick={() => onSelectDepartment(dept.departmentId)}
            className="w-full p-3 text-left border border-gray-300 hover:bg-gray-50"
          >
            {dept.departmentName}
          </button>
        ))}
      </div>
    </div>
  )
}
