'use client'

import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import Link from 'next/link'
import useEmployeeData from '@/hooks/useGetUserData'
import { useRouter } from 'next/navigation'
import { logout } from '@/components/server/logout'
import { PulseLogo } from '@/svgs/Logo'
import { useTasks } from '@/hooks/useTasks'
import { task } from '@/types'
export default function ProfilePage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { employeeData,title} = useEmployeeData()

    const { tasks,  isMounted, getTasks, error, loading }= useTasks()


  return (
    
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className=' inline-flex items-center'>
        <PulseLogo className="w-16 h-16 text-red-600 hover:text-gray-300 hover:animate-pulse" />
        </div>
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
              <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Другое</Link>
              <Link href="/report" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Заполнение отчета</Link>

              <Link href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Настройки</Link>              <p className="block px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">{new Date().toLocaleTimeString()}</p>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        <section className="mb-8 bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          {
             employeeData ?
            <div className="mb-4 md:mb-0">
  
            <h2 className="text-2xl font-bold mb-2 select-none">{employeeData.firstName} {employeeData.lastName}</h2>
            <p className="text-gray-400 select-none">{title && title}</p>
            <p className="text-gray-400 select-none"> Номер отдела:    {employeeData.departmentid}</p>
          </div>
          :
          <h1></h1>
          }
          <div className="space-y-2">
            <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded mr-4" onClick={()=>{
              router.push('/changePass')
            }}>
              Сменить пароль
            </button>
            <button className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{
             let is =   confirm('Вы уверены что хотите выйти?')
             if(!is) return
              logout()
              router.push('/')
            }}>
              Выйти
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Завершенные задачи
            </h3>
            <ul className="space-y-2">
            {tasks && tasks.all && tasks.all.completed ? tasks.all.completed.map((task: task, index: number) => (
                              <li key={index} className="bg-gray-700 rounded-xl p-4 shadow-md">
                                <h4 className="text-lg font-semibold">{task.taskName}</h4>
                                <p className="text-gray-300">{task.taskDescription}</p>
                                <p className="text-gray-400">Часов до завершения: {task.hourstodo}</p>
                                <p className="text-gray-400">Дата закрытия: {task.closeDate ? new Date(task.closeDate).toLocaleString('ru-RU') : 'Не указана'}</p>
                              </li>
              )) : null}            </ul>
          </section>

          <section className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Задачи в процессе
            </h3>
            <ul className="space-y-2">
            {tasks && tasks.all && tasks.all.in_progress ? tasks.all.in_progress.map((task: task, index: number) => (
                              <li key={index} className="bg-gray-700 rounded-xl p-4 shadow-md">
                                <h4 className="text-lg font-semibold">{task.taskName}</h4>
                                <p className="text-gray-300">{task.taskDescription}</p>
                                <p className="text-gray-400">Часов до завершения: {task.hourstodo}</p>
                                <p className="text-gray-400">Дата закрытия: {task.closeDate ? new Date(task.closeDate).toLocaleString('ru-RU') : 'Не указана'}</p>
                              </li>
              )) : null}
            </ul>
          </section>

          <section className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Просроченные задачи
            </h3>
            <ul className="space-y-2">
              {tasks && tasks.expired_tasks ? tasks.expired_tasks.map((task: task, index: number) => (
                              <li key={index} className="bg-gray-700 rounded-xl p-4 shadow-md">
                                <h4 className="text-lg font-semibold">{task.taskName}</h4>
                                <p className="text-gray-300">{task.taskDescription}</p>
                                <p className="text-gray-400">Часов до завершения: {task.hourstodo}</p>
                                <p className="text-gray-400">Дата закрытия: {task.closeDate ? new Date(task.closeDate).toLocaleString('ru-RU') : 'Не указана'}</p>
                              </li>
              )) : null}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
