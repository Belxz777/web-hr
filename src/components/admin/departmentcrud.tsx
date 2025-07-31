"use client"

import { Department, FunctionItem, Job } from "@/types"


interface DepartmentManagementProps {
  departments: Department[]
  jobs: Job[]
  functions: FunctionItem[]
  onBack: () => void
  onCreateJob: () => void
  onEditDepartment: (id: number) => void
  onDeleteDepartment: (id: number) => void
  onEditJob: (id: number) => void
  onDeleteJob: (id: number) => void
  loading?: boolean
}

export default function DepartmentManagement({
  departments,
  jobs,
  functions,
  onBack,
  onCreateJob,
  onEditDepartment,
  onDeleteDepartment,
  onEditJob,
  onDeleteJob,

  loading = false,
}: DepartmentManagementProps) {
  // const getitemName = (itemId: number) =>
  //   itemes.find((d) => d.itemId === itemId)?.itemName || "Не назначена"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Управление системой</h2>
      </div>

      {/* Отделы */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Отделы</h3>
        <div className="space-y-2">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded"
            >
              <div>
                <div className="font-medium">{dept.name}</div>
                {dept.description && (
                  <div className="text-sm text-gray-600">{dept.description}</div>
                )}
                <div className="text-sm text-gray-500">ID: {dept.id}</div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEditDepartment(dept.id)}
                  className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
                  disabled={loading}
                >
                  Изменить
                </button>
                <button
                  onClick={() => onDeleteDepartment(dept.id)}
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
                  disabled={loading}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Должности */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Должности</h3>
          <button
            onClick={onCreateJob}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
            disabled={loading}
          >
            + Создать должность
          </button>
        </div>
        <div className="space-y-2">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <div className="font-medium">{job.name}</div>
                <div className="text-sm text-gray-500">ID: {job.id}</div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEditJob(job.id)}
                  className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
                  disabled={loading}
                >
                  Изменить
                </button>
                <button
                  onClick={() => onDeleteJob(job.id)}
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
                  disabled={loading}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Вспомогательные обязанности */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Обязанности</h3>
        <div className="space-y-2">
          {functions.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <div className="font-medium">{item.name}</div>
                {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
                
                                <div className="text-sm text-gray-600">
                                  Обязательность: <span className={item.is_main? "text-green-600" : "text-red-600"}>
                                    {item.is_main? "Обязательная" : "Не обязательная"}
                                  </span>
                                </div>
                
                
              </div>
              <div className="space-x-2">
          
                <button
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded"
                  disabled={loading}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
