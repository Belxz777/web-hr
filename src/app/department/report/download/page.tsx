"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { PulseLogo } from "@/svgs/Logo"
import getEmployees from '@/components/server/emps_get'
import { set } from "zod"
import { downloadPreciseReport } from "@/components/server/download"
import { host } from "@/types"
import { useCookieGet } from "@/hooks/useCookies"

const useEmployees = () => {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      try {
        const data = await getEmployees()
        setEmployees(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return { employees, loading, error }
}

export default function DownloadReportPage() {
  const { employees, loading, error } = useEmployees()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => 
      !selectedEmployees.includes(employee.employeeId) &&
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, employees, selectedEmployees])

  const handleEmployeeToggle = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }
  const downloadExcel = async () => {
//     const cookie = useCookieGet()
//       if(!cookie){
// console.log(cookie)
//       }
        const body = {
        employee_ids: [1],
        from_date: "2024-12-21",
        end_date: "2024-12-25"
    }
      const response = await fetch('http://127.0.0.1:8000/api/v1/report/department/xlsx/persice', {
        method: 'POST',
        credentials: 'include',
        mode: 'no-cors', // Added mode to bypass CORS policy
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          body
        }),
      });

    if (!response.ok) {
      console.error('Ошибка при загрузке файла',response.blob);
      
      return;
    }

    // Получаем данные в виде Blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.xlsx'; // Укажите имя файла
    document.body.appendChild(a);
    a.click();
    
    // Удаляем ссылку после скачивания
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectedEmployees.length === 0) {
      alert("Выберите хотя бы один сотрудник.")
      return
    }
    if (!startDate || !endDate) {
      alert("Выберите даты.")
      return
    }

downloadExcel()
  }
    // Здесь будет логика скачивания отчета
const handleRemoveSelected = (id:number) => {
  setSelectedEmployees(selectedEmployees.filter(id => id !== id))

}
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100 l">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className=' inline-flex items-center '> 
          <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
          <h1 className="text-2xl  pl-4 font-bold">Cкачивание отчета по сотрудникам</h1>  
        </div>
        <nav className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Открыть меню"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1">
              <li>
                <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Профиль
                </Link>
              </li>
              <li>
                <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Настройки
                </Link>
              </li>
              <li>
                <div className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">
                  <span className="mr-3">{new Date().toLocaleTimeString()}</span>
                </div>
              </li>
            </ul>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <form onSubmit={handleDownload} className="bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto">
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Выберите сотрудников</h2>
            <div className="mb-4">
              <label htmlFor="search" className="sr-only">
                Поиск сотрудников
              </label>
              <input
                type="text"
                id="search"
                placeholder="Поиск сотрудников..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredEmployees.map((employee) => (
                <label key={employee.employeeId} className="flex items-center space-x-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.employeeId)}
                    onChange={() => handleEmployeeToggle(employee.employeeId)}
                    className="form-checkbox h-5 w-5 text-red-600"
                  />
                  <span>{`${employee.firstName} ${employee.lastName}`}</span>
                </label>
              ))}
            </div>
            {filteredEmployees.length === 0 && <p className="text-gray-400 text-center py-2">Сотрудники не найдены</p>}
            {selectedEmployees.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Добавленные сотрудники:</h3>
                {employees.filter(employee => selectedEmployees.includes(employee.employeeId)).map(employee => (
                  <div key={employee.employeeId} className="flex items-center space-x-3 py-2">
                    <span>{`${employee.firstName} ${employee.lastName}`}</span> 
                    <button
                      type="button"
                      onClick={() => handleRemoveSelected(employee.employeeId)}
                      className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Удалить из выбранных
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Выберите период</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Начальная дата
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                  Конечная дата
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={selectedEmployees.length === 0 || !startDate || !endDate}
          >
            Скачать отчет
          </button>
        </form>
      </main>
    </div>
  )
}
