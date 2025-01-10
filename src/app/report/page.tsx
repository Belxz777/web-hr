'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PulseLogo } from '@/svgs/Logo'
import { useTasks } from '@/hooks/useTasks'
import { task } from '@/types'
import { useReport } from '@/hooks/useReport'

// Пример данных задач
const tasks = [
  { id: 1, title: 'Разработка новой функции' },
  { id: 2, title: 'Испра��ление бага в модуле авторизации' },
  { id: 3, title: 'Оптимизация производительности' },
  { id: 4, title: 'Написание технической документации' },
  { id: 5, title: 'Обновление зависимостей проекта' },
]

export default function ReportPage() {
  const {tasks} = useReport()
  if(tasks){
    console.log(tasks)
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    taskId: '',
    workingHours: '',
    comment: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Отправка отчета:', formData)
    // Здесь будет логика отправки данных на сервер
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <PulseLogo className="w-16 h-16 text-red-600 hover:text-gray-300 hover:animate-pulse" />
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Открыть меню</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg py-1">
              <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Дашборд</Link>
              <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Профиль</Link>
              <Link href="/tasks" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Задачи</Link>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
            {tasks[0] ? tasks.map((task:task,index:number) => (
              <>  
                          <h1 className='text-center text-gray-300 text-2xl font-bold '>Заполнение отчета</h1>

                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="mb-4">
                <label htmlFor="taskId" className="block text-sm font-medium text-gray-300 mb-2">
                Выберите задачу
              </label>
              <select
                id="taskId"
                name="taskId"
                value={formData.taskId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                
                <option key={index}>{task.taskName}</option>
              </select>
              </div>
              <div className="mb-4">
            <label htmlFor="workingHours" className="block text-sm font-medium text-gray-300 mb-2">
              Количество рабочих часов
            </label>
            <input
              type="number"
              id="workingHours"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              min="0"
              step="0.5"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Отправить отчет
          </button>
        </form>
              </>
              ))
            :
            <div className="flex flex-col items-center justify-center h-64  rounded-lg">
            <div className={`transition-transform duration-1000  animate-bounce`}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" fill="none" stroke="#d1d5db" strokeWidth="4"/>
                <circle cx="26" cy="36" r="6" fill="#FFFFFF"/>
                <circle cx="54" cy="36" r="6" fill="#FFFFFF"/>
                <path d="M26 60C26 60 33 52 40 52C47 52 54 60 54 60" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-3xl font-semibold text-gray-300  pt-8 mb-6 text-center">
             У вас нет задач. Так бывает если вы начальник департамента.
            </p>
          </div>}

          
      </main>
    </div>
  )
}