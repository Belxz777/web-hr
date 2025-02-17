'use client'

import Link from 'next/link'
import useEmployeeData from '@/hooks/useGetUserData'
import { useRouter } from 'next/navigation'
import { logout } from '@/components/server/logout'
import { PulseLogo } from '@/svgs/Logo'
import { useTasks } from '@/hooks/useTasks'
import { task } from '@/types'
import { TaskList } from '@/components/buildIn/TaskList'
import { ReportDownload } from '@/components/buildIn/ReportDownload'
import { ReportUpload } from '@/components/buildIn/ReportUpload'
import { useState } from 'react'
import UniversalFooter from '@/components/buildIn/UniversalFooter'
import { time } from 'console'
import { Header } from '@/components/ui/header'
export default function ProfilePage() {
  const router = useRouter()
  const { employeeData, title, loadingEmp } = useEmployeeData()
  const { tasks, isMounted, getTasks, error, loading } = useTasks(false)
  return (

    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <Header employeeData={employeeData} title="Личный кабинет" />

      <main className="container mx-auto p-4">
        <section className="mb-8 bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          {loadingEmp ? (
            <div className=" w-1/2 animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-4/6 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/5 "></div>
            </div>
          ) : employeeData ? (
            <div className="mb-4 md:mb-0    cursor-pointer">
              <h2 className="text-2xl font-bold mb-2 select-none">
                {employeeData.firstName} {employeeData.lastName}
              </h2>
              <p className="text-gray-400 select-none">{title}</p>
              <p className="text-gray-400 select-none">Отдел № {employeeData.departmentid}</p>
              <div className='flex gap-4 justify-between'>
                <button onClick={() => router.push("/createTask")} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded mr-2">
                  Создать задачу
                </button>

                <button onClick={() => router.push("/report")} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded mr-2">
                  Заполнение отчета
                </button>
              </div>
            </div>
          ) : (
            <h1>Нет данных</h1>
          )}
          <div className="space-y-2">
            <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded mr-2" onClick={() => {
              router.push('/changePass')
            }}>
              Сменить пароль
            </button>
            <button className="w-full md:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
              let is = confirm('Вы уверены что хотите выйти?')
              if (!is) return
              logout()
              localStorage.clear()
              router.push('/')
            }}>
              Выйти
            </button>
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskSection
            title="Завершенные задачи"
            icon={
              <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            loading={loading ?? false}
            tasks={tasks?.all?.completed}

          />

          <TaskSection
            title="Задачи в процессе и неначатые"
            icon={
              <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            loading={loading}
            tasks={[...(tasks?.all?.in_progress || []), ...(tasks?.all?.not_started || [])]}
          />

          <TaskSection
            title="Просроченные задачи"
            icon={
              <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            loading={loading ?? false}
            tasks={tasks?.expired_tasks}
          />
        </div>
        {
          employeeData?.position !== 1 && employeeData ? (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <ReportUpload />
              <ReportDownload />
            </section>
          ) : null
        }
      </main>
      <UniversalFooter />
    </div>
  )
} function TaskSection({ title, icon, loading, tasks }: { title: string; icon: React.ReactNode; loading: boolean; tasks: any[] }) {
  return (
    <section className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        {icon}
        {title}
      </h3>
      {loading ? (
        <EmptyTasksAnimation />
      ) : (
        <TaskList tasks={tasks} />
      )}
    </section>
  )
}



function EmptyTasksAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <svg className="w-24 h-24 mb-4" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#6B7280" strokeWidth="4">
          <animate
            attributeName="stroke-dasharray"
            from="0 240"
            to="240 240"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
        <line x1="30" y1="40" x2="70" y2="40" stroke="#6B7280" strokeWidth="4">
          <animate
            attributeName="stroke-dasharray"
            from="0 40"
            to="40 40"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </line>
        <line x1="30" y1="50" x2="70" y2="50" stroke="#6B7280" strokeWidth="4">
          <animate
            attributeName="stroke-dasharray"
            from="0 40"
            to="40 40"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </line>
        <line x1="30" y1="60" x2="70" y2="60" stroke="#6B7280" strokeWidth="4">
          <animate
            attributeName="stroke-dasharray"
            from="0 40"
            to="40 40"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </line>
      </svg>
      <p className="text-gray-400 text-center">Нет задач</p>
    </div>
  )
}
