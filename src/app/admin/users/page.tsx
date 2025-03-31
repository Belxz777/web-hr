"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getEmployeeId from "@/components/server/fetchuserbyid"
import { Header } from "@/components/ui/header"

// Тип данных сотрудника согласно требованиям
type Employee = {
  employeeId: number
  firstName: string
  lastName: string
  patronymic: string
  departmentid: number
  jobid: number,
  login: string,
  password: string
  position: number
  completedTasks: null
  expiredTasksCount: null
  tasksCount: null
}

// Имитация запроса к API

// Имитация данных отделов и должностей для отображения имен вместо ID
const departments = [
  { id: 1, name: "IT отдел" },
  { id: 2, name: "Отдел дизайна" },
  { id: 3, name: "Отдел управления проектами" },
]

const jobs = [
  { id: 1, title: "Младший разработчик" },
  { id: 2, title: "Разработчик" },
  { id: 3, title: "Старший разработчик" },
  { id: 4, title: "Дизайнер" },
  { id: 5, title: "Менеджер проектов" },
]

export default function AdminUserDetailsPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId.trim()) {
      setError("Пожалуйста, введите ID сотрудника")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const user = await getEmployeeId(Number(userId))
      
      if (user.message === "Пользователь не найден") {
        setEmployee(null)
        setError(`Сотрудник с ID ${userId} не найден`)
      } else {
        setEmployee(user)
      } 
    } catch (err) {
      setError("Произошла ошибка при получении данных о сотруднике")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  // Получение названия отдела по ID
  const getDepartmentName = (id: number) => {
        const department = departments.find((dept) => dept.id === id)
        return department ? department.name : `Отдел ID: ${id}`
    }

    // Получение названия должности по ID
    const getJobTitle = (id: number) => {
        const job = jobs.find((job) => job.id === id)
        return job ? job.title : `Должность ID: ${id}`
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">


      <Header title="Поиск сотрудника" position={5} showPanel={false} />
      <main className="container mx-auto p-4">
      <div className="flex w-full">
        <button onClick={() => router.back()} className="flex m-3 items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{`<- Вернуться к админ-панели`}</button>
      </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Поиск сотрудника</h2>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="userId" className="sr-only">
                ID сотрудника
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Введите ID сотрудника"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Поиск...
                </span>
              ) : (
                "Найти"
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-300">
              {error}
            </div>
          )}
          <div className="mt-4 text-sm text-gray-400">
            <p>Для демонстрации доступны сотрудники с ID: 1, 2, 3</p>
          </div>
        </div>

        {employee && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                    {employee.firstName.charAt(0)}
                    {employee.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {employee.lastName} {employee.firstName} {employee.patronymic}
                    </h2>
                    <p className="text-gray-400">
                      {employee.jobid}, {employee.departmentid}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-red-600 rounded-full text-sm">Уровень: {employee.position}</div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Основная информация */}
                <section>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Основная информация</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-400">ID сотрудника:</dt>
                      <dd>{employee.employeeId}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Имя:</dt>
                      <dd>{employee.firstName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Фамилия:</dt>
                      <dd>{employee.lastName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Отчество:</dt>
                      <dd>{employee.patronymic}</dd>
                    </div>
                  </dl>
                </section>

                {/* Информация о работе */}
                <section>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Информация о работе</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-400">ID отдела:</dt>
                      <dd>
                        {employee.departmentid} ({employee.departmentid})
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">ID должности:</dt>
                      <dd>
                        {employee.jobid} ({employee.jobid})
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Позиция/уровень:</dt>
                      <dd>{employee.position}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Логин:</dt>
                      <dd>{employee.login}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Пароль:</dt>
                      <dd>{employee.password}</dd>
                    </div>
                  </dl>
                </section>

                {/* Информация о задачах */}
                <section>
                  <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-700">Информация о задачах</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Завершенные задачи:</dt>
                      <dd>{employee.completedTasks === null ? "Нет данных" : employee.completedTasks}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Просроченные задачи:</dt>
                      <dd>{employee.expiredTasksCount === null ? "Нет данных" : employee.expiredTasksCount}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Всего задач:</dt>
                      <dd>{employee.tasksCount === null ? "Нет данных" : employee.tasksCount}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              {/* Кнопки действий */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  Редактировать профиль
                </button>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                  Изменить должность
                </button>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors">
                  Деактивировать аккаунт
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

