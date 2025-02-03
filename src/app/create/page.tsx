"use client"

import { useState } from "react"
import Link from "next/link"

const CircularChart = ({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) => {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${(value / max) * circumference} ${circumference}`

  const handleClick = (event: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
    const svgRect = event.currentTarget.getBoundingClientRect()
    const centerX = svgRect.left + svgRect.width / 2
    const centerY = svgRect.top + svgRect.height / 2
    const clickX = event.clientX - centerX
    const clickY = event.clientY - centerY
    const angle = Math.atan2(clickY, clickX)
    let newValue = Math.round(((angle + Math.PI) / (2 * Math.PI)) * max)
    if (newValue === 0) newValue = max
    onChange(newValue)
  }

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#374151" strokeWidth="20" />
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="transparent"
        stroke="#ef4444"
        strokeWidth="20"
        strokeDasharray={strokeDasharray}
        transform="rotate(-90 100 100)"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="white" fontSize="24">
        {`${value}ч`}
      </text>
    </svg>
  )
}

export default function CreateTaskPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskDuration, setTaskDuration] = useState(1)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Создание задачи:", { taskName, taskDescription, taskDuration })
    // Здесь будет логика отправки данных на сервер
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Создание задачи</h1>
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
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Дашборд
                </Link>
              </li>
              <li>
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Профиль
                </Link>
              </li>
              <li>
                <Link href="/tasks/download" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Скачивание задач
                </Link>
              </li>
              <li>
                <Link href="/tasks/upload" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Загрузка задач
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                  Контакты
                </Link>
              </li>
            </ul>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-300 mb-2">
              Название задачи
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-300 mb-2">
              Описание задачи
            </label>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Время выполнения (в часах)</label>
            <div className="flex justify-center">
              <CircularChart value={taskDuration} max={24} onChange={setTaskDuration} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Создать задачу
          </button>
        </form>
      </main>
    </div>
  )
}

