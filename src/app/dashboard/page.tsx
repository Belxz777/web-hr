// "use client"

// import EmployeeStats from "@/components/buildIn/employee-stats"
// import TaskChart from "@/components/buildIn/task-chart"
// import ContributionHeatmap from "@/components/buildIn/contribution-heatmap"
// import { PulseLogo } from "@/svgs/Logo"
// import Link from "next/link"
// import useEmployeeData from "@/hooks/useGetUserData"
// import { useState } from "react"

// export default function DashboardPage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { employeeData } = useEmployeeData();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
//       {/* <header className="bg-gray-800 p-4 flex justify-between items-center">
//         <div className=' inline-flex items-center '> 
//           <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
//           <h1 className="text-2xl  pl-4 font-bold">Анализ отдела</h1>  
//           </div>
//       </header> */}

//       <header className="bg-gray-800 p-4 flex justify-between items-center">
//         <div className=" inline-flex items-center ">
//           <Link href="/profile" prefetch={false}>
//             <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
//           </Link>
//           <h1 className="text-2xl  pl-4 font-bold">Анализ отдела</h1>
//         </div>
//         <div className="relative">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="p-2 text-gray-300 hover:text-white focus:outline-none"
//           >
//             <span className="sr-only">Открыть меню</span>
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//           </button>
//           {isMenuOpen && (
//             <ul className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1">
//               {employeeData?.position !== 1 ? (
//                 <>
//                   {employeeData?.position !== 5 && (
//                     <li>
//                       <Link
//                         href="/report"
//                         className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="w-5 h-5 mr-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <path d="M12 20h9" />
//                           <path d="M15.5 4l4.5 4.5-1.5 1.5-4.5-4.5z" />
//                           <path d="M2 22l2-2 4-4-4-4-2 2z" />
//                         </svg>
//                         Заполнение отчета
//                       </Link>
//                     </li>
//                   )}
//                   <li>
//                     <Link
//                       href="/department/report/download"
//                       className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                     >
//                       <svg
//                         className="w-5 h-5 mr-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                         />
//                       </svg>
//                       Скачивание подробного отчета
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/settings"
//                       className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                     >
//                       <svg
//                         className="w-5 h-5 mr-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       Настройки
//                     </Link>
//                   </li>
//                   <li>
//                     <div className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">
//                       <span className="mr-3">
//                         {new Date().toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li>
//                     <Link
//                       href="/report"
//                       className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <path d="M12 20h9" />
//                         <path d="M15.5 4l4.5 4.5-1.5 1.5-4.5-4.5z" />
//                         <path d="M2 22l2-2 4-4-4-4-2 2z" />
//                       </svg>
//                       Заполнение отчета
//                     </Link>
//                   </li>
//                   <li>
//                     <Link
//                       href="/settings"
//                       className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
//                     >
//                       <svg
//                         className="w-5 h-5 mr-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       Настройки
//                     </Link>
//                   </li>
//                   <li>
//                     <div className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">
//                       <span className="mr-3">
//                         {new Date().toLocaleTimeString()}
//                       </span>
//                     </div>
//                   </li>
//                 </>
//               )}
//             </ul>
//           )}
//         </div>
//       </header>

//       <div className="p-6">
//         <div className="grid gap-8">
//           <EmployeeStats />
//           <div className="w-auto">
//             <TaskChart />
//           </div>


//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import Link from "next/link"

// Расширенные примерные данные
const employeesData = [
  {
    id: 1,
    name: "Иван Иванов",
    tasksCompleted: [
      { date: "2023-06-01", count: 5 },
      { date: "2023-06-02", count: 7 },
      { date: "2023-06-03", count: 4 },
      { date: "2023-06-04", count: 6 },
      { date: "2023-06-05", count: 8 },
    ],
    busyPercentage: 85,
    detailedTasks: [
      { id: 1, name: "Разработка интерфейса", status: "В процессе", deadline: "2023-06-10" },
      { id: 2, name: "Тестирование API", status: "Завершено", deadline: "2023-06-05" },
      { id: 3, name: "Оптимизация базы данных", status: "Не начато", deadline: "2023-06-15" },
    ],
  },
  {
    id: 2,
    name: "Мария Петрова",
    tasksCompleted: [
      { date: "2023-06-01", count: 4 },
      { date: "2023-06-02", count: 6 },
      { date: "2023-06-03", count: 5 },
      { date: "2023-06-04", count: 3 },
      { date: "2023-06-05", count: 7 },
    ],
    busyPercentage: 70,
    detailedTasks: [
      { id: 1, name: "Анализ требований", status: "Завершено", deadline: "2023-06-03" },
      { id: 2, name: "Создание документации", status: "В процессе", deadline: "2023-06-12" },
      { id: 3, name: "Подготовка презентации", status: "Не начато", deadline: "2023-06-18" },
    ],
  },
  // ... добавьте данные для остальных сотрудников
]

const BarChart = ({ data }: { data: { name: string; tasksCompleted: { date: string; count: number }[] }[] }) => {
  const maxValue = Math.max(...data.flatMap((emp) => emp.tasksCompleted.map((t) => t.count)))
  const barWidth = 15
  const barGap = 2
  const employeeGap = 10
  const chartWidth = data.length * (data[0].tasksCompleted.length * (barWidth + barGap) + employeeGap)
  const chartHeight = 200

  return (
    <svg width={chartWidth} height={chartHeight + 50} className="mt-4">
      {data.map((employee, empIndex) => (
        <g
          key={employee.name}
          transform={`translate(${empIndex * (employee.tasksCompleted.length * (barWidth + barGap) + employeeGap)}, 0)`}
        >
          {employee.tasksCompleted.map((task, taskIndex) => {
            const barHeight = (task.count / maxValue) * chartHeight
            return (
              <g key={task.date} transform={`translate(${taskIndex * (barWidth + barGap)}, 0)`}>
                <rect y={chartHeight - barHeight} width={barWidth} height={barHeight} fill="#ef4444" />
                <text x={barWidth / 2} y={chartHeight - barHeight - 5} textAnchor="middle" fill="white" fontSize="10">
                  {task.count}
                </text>
                <text
                  x={barWidth / 2}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  transform="rotate(90, 0,215)"
                >
                  {task.date}
                </text>
              </g>
            )
          })}
    
        </g>
      ))}
    </svg>
  )
}

const PieChart = ({ percentage }: { percentage: number }) => {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#374151" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="transparent"
        stroke="#ef4444"
        strokeWidth="10"
        strokeDasharray={strokeDasharray}
        transform="rotate(-90 60 60)"
      />
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill="white" fontSize="20">
        {`${percentage}%`}
      </text>
    </svg>
  )
}

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employeesData)[0] | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleEmployeeClick = (employee: (typeof employeesData)[0]) => {
    setSelectedEmployee(employee)
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Дашборд начальника отдела</h1>
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
            <ul className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1">
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
                <Link
                  href="/reports/download"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Скачать отчет
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Документация
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
            </ul>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Выполненные задачи сотрудников по дням</h2>
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <BarChart data={employeesData} />
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Нажмите на столбец, чтобы увидеть подробную информацию о задачах за этот день.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Занятость сотрудников</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {employeesData.map((employee) => (
              <div
                key={employee.id}
                className="bg-gray-800 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => handleEmployeeClick(employee)}
              >
                <h3 className="text-lg font-semibold mb-2">{employee.name}</h3>
                <PieChart percentage={employee.busyPercentage} />
                <p className="mt-2">Занятость: {employee.busyPercentage}%</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Нажмите на карточку сотрудника, чтобы увидеть подробную информацию о его занятости.
          </p>
        </section>

        {selectedEmployee && (
          <section className="mt-8 bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Подробная информация о занятости: {selectedEmployee.name}</h2>
            <h3 className="text-lg font-semibold mb-2">Текущие задачи:</h3>
            <ul className="list-disc list-inside">
              {selectedEmployee.detailedTasks.map((task) => (
                <li key={task.id} className="mb-2">
                  <span className="font-medium">{task.name}</span> - Статус: {task.status}, Дедлайн: {task.deadline}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setSelectedEmployee(null)}
            >
              Закрыть
            </button>
          </section>
        )}

        {selectedDate && (
          <section className="mt-8 bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Задачи на {selectedDate}</h2>
            <ul className="list-disc list-inside">
              {employeesData.map((employee) => {
                const tasksForDate = employee.tasksCompleted.find((t) => t.date === selectedDate)
                return tasksForDate ? (
                  <li key={employee.id} className="mb-2">
                    <span className="font-medium">{employee.name}</span>: {tasksForDate.count} задач
                  </li>
                ) : null
              })}
            </ul>
            <button
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setSelectedDate(null)}
            >
              Закрыть
            </button>
          </section>
        )}
      </main>
    </div>
  )
}
