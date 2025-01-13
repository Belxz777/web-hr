'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PulseLogo } from '@/svgs/Logo'
import { useTasks } from '@/hooks/useTasks'
import { report, task } from '@/types'
import { useReport } from '@/hooks/useReport'
import sendReport from '@/components/server/report'
import { useRouter } from 'next/navigation'
import { set } from 'zod'

// Пример данных задач


export default function ReportPage() {

  const {tasks,loadingRep} = useReport()

  const router  = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading,setLoading] = useState(false)
  const [formData, setFormData] = useState<report>({
    taskId: 0,
    workingHours: 0,
    comment: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    console.log(formData)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (tasks.length === 1) {
      setFormData(prevFormData => ({
        ...prevFormData,
        taskId: tasks[0].taskId
      }))
    }

  const req = await sendReport(formData)
console.log(formData,tasks[0])
    if (req) {
      setLoading(false)
      return
    }

    setLoading(false)
    alert("Ошибка")

    // Здесь будет логика отправки данных на сервер
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-red-600 to-gray-900 text-gray-100">
    
{
  tasks.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-screen">
               <PulseLogo className="w-24 h-24 text-gray-300 animate-pulse" />
      <h1 className="text-2xl font-bold text-gray-300 mt-4">Загрузка . . . </h1>
      {
       ! loadingRep ? (
null
        ) : (
          <button
          className="inline-flex font-bold mt-4 items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-300"
          onClick={() => router.push("/profile")}
        >
          Вернуться на главную
        </button>
        )
      }

    </div>
  ) :   <>
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
        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Профиль</Link>
        <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Настройки</Link>         
        <p className="block px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">{new Date().toLocaleTimeString()}</p>
        </div>
    )}
  </div>
</header>
      <main className="container mx-auto p-4">
              <>  
                <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto">
                <h1 className='text-center text-gray-300 text-2xl font-bold '>Заполнение отчета</h1>
          <div className="mb-4">
              {
              <>
               <label htmlFor="taskId" className="block text-sm font-medium text-gray-300 mb-2">
               Выберите задачу
             </label>
             <select
             id="taskId"
             name="taskId"
             value={tasks.length === 1 ? tasks[0].taskId : formData.taskId}
             onChange={handleChange}
             className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
             required
           >
            {
              loadingRep ?
              <option value="" className=''>
                        <div className="h-8 bg-gray-700 rounded w-4/6 mb-4"></div>
              </option>
              :
            tasks.map((task: task) => (
               <option key={task.taskId} value={task.taskId}> {task.taskName}</option>
             ))
            }
           </select>
           </>
      
              }
              
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
            disabled={loading}
            className="w-full  font-bold py-2 px-4  focus:outline-none focus:shadow-outline  flex justify-center border border-transparent rounded-xl shadow-sm text-sm  text-white bg-red-600 hover:bg-red-700  focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </>
              ) : 'Отправить отчет'}
        
          </button>
        </form>
              </>
            

          
      </main>
      </>
}
    </div>
  )
}