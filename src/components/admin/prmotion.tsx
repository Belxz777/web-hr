"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Employee, Department } from "./index"
import {promotion ,makehead } from "../server/admin/promotion"

interface PromotionsViewProps {
  onBack: () => void
  departments: Department[]
  loading?: boolean
}

const POSITION_LEVELS = [
  { level: 1, name: "Сотрудник отдела" },
  { level: 2, name: "Руководитель группы сотрудников" },
  { level: 3, name: "Начальник отдела" },
  { level: 4, name: "Директор отдела" },
  { level: 5, name: "Администратор" },
]

export default function PromotionsView({ onBack, departments, loading = false }: PromotionsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<number>(0)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [promotionAction, setPromotionAction] = useState<"promote" | "demote" | "head" | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Используем useRef для хранения таймера дебаунса
  const debounceTimer = useRef<NodeJS.Timeout>()

  const fetchEmployees = async (query: string, departmentId?: number) => {
    if (!query.trim()) {
      setEmployees([])
      return
    }

    setSearchLoading(true)
    setError(null)

    try {
      const apiUrl = new URL("/api/users/quicksearch", window.location.origin)
      apiUrl.searchParams.append("search", query.trim())

      if (departmentId && departmentId > 0) {
        apiUrl.searchParams.append("department_id", String(departmentId))
      }

      const response = await fetch(apiUrl.toString(), {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Ошибка сервера")
      }

      const data = await response.json()
      setEmployees(data.users || data || [])
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      setEmployees([])
    } finally {
      setSearchLoading(false)
    }
  }

  // Оптимизированная версия дебаунса с использованием useRef
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    
    // Очищаем предыдущий таймер
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    // Устанавливаем новый таймер
    debounceTimer.current = setTimeout(() => {
      fetchEmployees(value, selectedDepartment)
    }, 900)
  }, [selectedDepartment])

  useEffect(() => {
    return () => {
      // Очищаем таймер при размонтировании компонента
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const getPositionName = (level: number) => {
    return POSITION_LEVELS.find((p) => p.level === level)?.name || `Уровень ${level}`
  }

  const canPromote = (employee: Employee) => employee.position < 5
  const canDemote = (employee: Employee) => employee.position > 1
  const canMakeHead = (employee: Employee) => employee.position >= 2 && employee.position < 5

  const handlePromoteEmployee = async (employee: Employee, newLevel: number) => {
    try {
      setSearchLoading(true)
      const promote = await promotion({
        empid: employee.employeeId, 
        position: newLevel
      })
      console.log(promote)
      alert(`${promote.message}`)
      setSelectedEmployee(null)
      setPromotionAction(null)
      setSearchLoading(false)
      fetchEmployees(searchTerm, selectedDepartment)
    } catch (error) {
      console.error("Ошибка повышения:", error)
      alert("Ошибка при повышении сотрудника")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSetDepartmentHead = async (employee: Employee) => {
    if (!selectedDepartment) {
      alert("Выберите отдел")
      return
    }

    try {
      setSearchLoading(true)
      // TODO: Реализовать API вызов для назначения начальника
      console.log(`Назначение начальника отдела ${selectedDepartment}: ${employee.employeeId}`)

      const department = departments.find((d) => d.departmentId === selectedDepartment)
      alert(
        `Сотрудник ${employee.firstName} ${employee.lastName} назначен начальником отдела "${department?.departmentName}"`,
      )
      setSelectedEmployee(null)
      setPromotionAction(null)
    } catch (error) {
      console.error("Ошибка назначения начальника:", error)
      alert("Ошибка при назначении начальника отдела")
    } finally {
      setSearchLoading(false)
    }
  }

  // Оптимизированный рендеринг списка сотрудников
  const renderEmployeeList = () => {
    if (searchLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Поиск сотрудников...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Ошибка поиска:</span>
          </div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )
    }

    if (employees.length > 0) {
      return (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Найдено сотрудников: <span className="font-semibold text-gray-900">{employees.length}</span>
            </p>
          </div>
          <div className="space-y-3">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.employeeId}
                employee={employee}
                departments={departments}
                onPromote={() => {
                  setSelectedEmployee(employee)
                  setPromotionAction("promote")
                }}
                onDemote={() => {
                  setSelectedEmployee(employee)
                  setPromotionAction("demote")
                }}
                onMakeHead={() => {
                  setSelectedEmployee(employee)
                  setPromotionAction("head")
                }}
                canPromote={canPromote(employee)}
                canDemote={canDemote(employee)}
                canMakeHead={canMakeHead(employee) && selectedDepartment > 0}
              />
            ))}
          </div>
        </>
      )
    }

    if (searchTerm) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Сотрудники не найдены</h3>
          <p className="text-gray-600">По запросу "{searchTerm}" не найдено ни одного сотрудника</p>
        </div>
      )
    }

    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Начните поиск</h3>
        <p className="text-gray-600">Введите фамилию сотрудника для поиска</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-blue-600" disabled={loading}>
          ← Назад
        </button>
        <h2 className="text-xl font-bold">Повышения и назначения</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Поиск сотрудников</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Отдел (опционально)</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={searchLoading}
            >
              <option value={0}>Все отделы</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Поиск по фамилии</label>
            <div className="relative">
              <input
                type="text"
                ref={searchInputRef}
                placeholder="Введите фамилию сотрудника..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={searchLoading}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Уровни должностей:</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            {POSITION_LEVELS.map((pos) => (
              <div key={pos.level} className="text-blue-800">
                <span className="font-medium">{pos.level}.</span> {pos.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {renderEmployeeList()}
      </div>

      {selectedEmployee && promotionAction && (
        <PromotionModal
          employee={selectedEmployee}
          action={promotionAction}
          departments={departments}
          selectedDepartment={selectedDepartment}
          positionLevels={POSITION_LEVELS}
          onClose={() => {
            setSelectedEmployee(null)
            setPromotionAction(null)
          }}
          onPromote={handlePromoteEmployee}
          onMakeHead={handleSetDepartmentHead}
          loading={searchLoading}
        />
      )}
    </div>
  )
}

// Вынесенные компоненты для лучшей читаемости и производительности

interface EmployeeCardProps {
  employee: Employee
  departments: Department[]
  onPromote: () => void
  onDemote: () => void
  onMakeHead: () => void
  canPromote: boolean
  canDemote: boolean
  canMakeHead: boolean
}

const EmployeeCard = ({
  employee,
  departments,
  onPromote,
  onDemote,
  onMakeHead,
  canPromote,
  canDemote,
  canMakeHead,
}: EmployeeCardProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {employee.firstName} {employee.lastName} {employee.patronymic}
            </h3>
            <p className="text-gray-600">
              {POSITION_LEVELS.find((p) => p.level === employee.position)?.name || `Уровень ${employee.position}`}
            </p>
            <p className="text-sm text-gray-500">
              Отдел: {departments.find((d) => d.departmentId === employee.departmentid)?.departmentName || "Неизвестен"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {canPromote && (
            <button
              onClick={onPromote}
              className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-colors"
            >
              Повысить
            </button>
          )}

          {canDemote && (
            <button
              onClick={onDemote}
              className="px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-sm font-medium transition-colors"
            >
              Понизить
            </button>
          )}

          {canMakeHead && (
            <button
              onClick={onMakeHead}
              className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-sm font-medium transition-colors"
            >
              Назначить начальником
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface PromotionModalProps {
  employee: Employee
  action: "promote" | "demote" | "head"
  departments: Department[]
  selectedDepartment: number
  positionLevels: typeof POSITION_LEVELS
  onClose: () => void
  onPromote: (employee: Employee, newLevel: number) => void
  onMakeHead: (employee: Employee) => void
  loading: boolean
}

const PromotionModal = ({
  employee,
  action,
  departments,
  selectedDepartment,
  positionLevels,
  onClose,
  onPromote,
  onMakeHead,
  loading,
}: PromotionModalProps) => {
  const [selectedLevel, setSelectedLevel] = useState(
    action === "promote" ? employee.position + 1 : employee.position - 1
  )

  const makeh = async () => {
    try {
      await makehead({
      empid: Number(employee.employeeId),
       department:  selectedDepartment
      })
      onClose()
    } catch (error) {
      console.error("Error making head:", error)
    }
    
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {action === "promote" && "Повышение сотрудника"}
          {action === "demote" && "Понижение сотрудника"}
          {action === "head" && "Назначение начальника отдела"}
        </h3>

        <div className="mb-4">
          <p className="text-gray-700">
            <strong>Сотрудник:</strong> {employee.firstName} {employee.lastName}
          </p>
          <p className="text-gray-700">
            <strong>Текущий уровень:</strong> {positionLevels.find((p) => p.level === employee.position)?.name} (
            {employee.position})
          </p>
        </div>

        {(action === "promote" || action === "demote") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Новый уровень:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(Number(e.target.value))}
            >
              {positionLevels
                .filter((p) => (action === "promote" ? p.level > employee.position : p.level < employee.position))
                .map((pos) => (
                  <option key={pos.level} value={pos.level}>
                    {pos.level}. {pos.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {action === "head" && (
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Отдел:</strong> {departments.find((d) => d.departmentId === selectedDepartment)?.departmentName}
            </p>
            <p className="text-sm text-gray-600 mt-2">Сотрудник будет назначен начальником выбранного отдела</p>
          </div>
        )}

        <div className="flex gap-3">
          {action === "head" ? (
            <button
              onClick={() => makeh()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Назначение..." : "Назначить"}
            </button>
          ) : (
            <button
              onClick={() => onPromote(employee, selectedLevel)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Сохранение..." : "Подтвердить"}
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}