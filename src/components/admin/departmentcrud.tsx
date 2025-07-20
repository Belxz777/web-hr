"use client"

import type { Department, Job, Deputy } from "./index"

interface DepartmentManagementProps {
  departments: Department[]
  jobs: Job[]
  deputies: Deputy[]
  onBack: () => void
  onCreateJob: () => void
  onEditDepartment: (departmentId: number) => void
  onDeleteDepartment: (departmentId: number) => void
  onEditJob: (jobId: number) => void
  onDeleteJob: (jobId: number) => void
  onManageDeputy: (deputyId: number) => void
  onDeleteDeputy: (deputyId: number) => void
  loading?: boolean
}

export default function DepartmentManagement({
  departments,
  jobs,
  deputies,
  onBack,
  onCreateJob,
  onEditDepartment,
  onDeleteDepartment,
  onEditJob,
  onDeleteJob,
  onManageDeputy,
  onDeleteDeputy,
  loading = false,
}: DepartmentManagementProps) {
  const getDeputyName = (deputyId: number) =>
    deputies.find((d) => d.deputyId === deputyId)?.deputyName || "Не назначена"

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
              key={dept.departmentId}
              className="flex items-center justify-between p-3 border border-gray-200 rounded"
            >
              <div>
                <div className="font-medium">{dept.departmentName}</div>
                {dept.departmentDescription && (
                  <div className="text-sm text-gray-600">{dept.departmentDescription}</div>
                )}
                <div className="text-sm text-gray-500">ID: {dept.departmentId}</div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEditDepartment(dept.departmentId)}
                  className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
                  disabled={loading}
                >
                  Изменить
                </button>
                <button
                  onClick={() => onDeleteDepartment(dept.departmentId)}
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
            <div key={job.jobId} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <div className="font-medium">{job.jobName}</div>
                <div className="text-sm text-gray-600">Обязанность: {getDeputyName(job.deputy)}</div>
                <div className="text-sm text-gray-500">ID: {job.jobId}</div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => onEditJob(job.jobId)}
                  className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
                  disabled={loading}
                >
                  Изменить
                </button>
                <button
                  onClick={() => onDeleteJob(job.jobId)}
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
          {deputies.map((deputy) => (
            <div key={deputy.deputyId} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <div className="font-medium">{deputy.deputyName}</div>
                {deputy.deputyDescription && <div className="text-sm text-gray-600">{deputy.deputyDescription}</div>}
                
                                <div className="text-sm text-gray-600">
                                  Обязательность: <span className={deputy.compulsory ? "text-green-600" : "text-red-600"}>
                                    {deputy.compulsory ? "Обязательная" : "Не обязательная"}
                                  </span>
                                </div>
                
                <div className="text-sm text-gray-500">
                  Функций: {deputy.deputy_functions.length} | ID: {deputy.deputyId}
                </div>
              </div>
              <div className="space-x-2">
                {
                  deputy.compulsory && (
                    <button
                      onClick={() => onManageDeputy(deputy.deputyId)}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded"
                      disabled={loading}
                    >
                      Изменить
                    </button>
                  )
                }
                <button
                  onClick={() => onDeleteDeputy(deputy.deputyId)}
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
