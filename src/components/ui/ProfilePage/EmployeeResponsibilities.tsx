"use client"

import type { Deputy } from "@/types"
import { useState, useEffect } from "react"

interface EmployeeResponsibilitiesProps {
  responsibilitiesFs?: Deputy[]
  position?: number
  hoursWorked?: number,
  isLoading?:boolean
}

export function EmployeeResponsibilities({
  responsibilitiesFs = [],
  position,
  isLoading=false
}: EmployeeResponsibilitiesProps) {

  const [loading, setLoading] = useState(!responsibilitiesFs || responsibilitiesFs.length === 0)
  const [showMainResponsibilities, setShowMainResponsibilities] = useState(true)
  const [showAdditionalResponsibilities, setShowAdditionalResponsibilities] = useState(true)
  const [functionalData, setFunctionalData] = useState<Deputy[]>(responsibilitiesFs)
  const [hoursWorked,sethoursWorked] = useState(0)
  // Separate responsibilities by type
  const mainResponsibilities = functionalData.filter((item) => item.compulsory)
  const additionalResponsibilities = functionalData.filter((item) => !item.compulsory)

  // Format current date in Russian
  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Calculate percentage of 8-hour workday completed
  const workdayPercentage = Math.min(Math.round((hoursWorked / 8) * 100), 100)

  useEffect(() => {
    if (responsibilitiesFs && responsibilitiesFs.length > 0) {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
    if(typeof window !== 'undefined'){
      const hoursToday = localStorage.getItem('hourstoday')
      if(hoursToday){
        let obj = JSON.parse(hoursToday)
        sethoursWorked(Number(obj.value))
      }
    }

    setFunctionalData(responsibilitiesFs)
  }, [responsibilitiesFs])
  if (!functionalData) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-[#000000] my-4">Функциональные обязанности</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enhanced loading skeleton for main responsibilities */}
          <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
              <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-xl"></div>
            </div>
            <div className="animate-pulse bg-gray-200 rounded-xl h-14 mb-3"></div>
          </div>

          {/* Enhanced loading skeleton for additional responsibilities */}
          <div className="bg-gray-100 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-xl"></div>
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-200 rounded-xl h-10"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Основные обязанности */}
          <div className="bg-[#249BA2] rounded-xl p-6 text-white shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-white/30 pb-2">
              <h3 className="text-xl font-bold">Основная</h3>
              <button
                onClick={() => setShowMainResponsibilities(!showMainResponsibilities)}
                className="px-3 py-1 bg-white text-[#249BA2] rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium flex items-center"
              >
                {showMainResponsibilities ? "Скрыть" : `Показать (${mainResponsibilities.length})`}
              </button>
            </div>

            {showMainResponsibilities && (
              <div className="space-y-3">
                {mainResponsibilities.length > 0 ? (
                  mainResponsibilities.map((item) => (
                    <div
                      key={item.deputyId}
                      className="bg-white text-[#249BA2] rounded-xl px-4 py-3 block w-full hover:shadow-md transition-all duration-200"
                    >
                      {item.deputyName}
                    </div>
                  ))
                ) : (
                  <div className="bg-white text-[#249BA2] rounded-xl px-4 py-3 block w-full">
                    Основная обязанность не назначена
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Дополнительные обязанности */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
              <h3 className="text-xl font-bold text-[#000000]">Дополнительные</h3>
              <button
                onClick={() => setShowAdditionalResponsibilities(!showAdditionalResponsibilities)}
                className="px-3 py-1 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors text-sm font-medium flex items-center"
              >
                {showAdditionalResponsibilities ? "Скрыть" : `Показать (${additionalResponsibilities.length})`}
              </button>
            </div>

            {showAdditionalResponsibilities && (
              <div>
                {additionalResponsibilities.length > 0 ? (
                  <ul className="space-y-3">
                    {additionalResponsibilities.map((item, index) => (
                      <li
                        key={item.deputyId}
                        className="text-[#249BA2] px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <span className="mr-2 bg-[#249BA2] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          {item.deputyName}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#249BA2] px-4 py-3 border border-gray-100 rounded-xl">Дополнительных задач нет</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

      // <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      //   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
      //     <h3 className="text-xl font-bold text-[#000000] mb-2 md:mb-0">Учет рабочего времени</h3>
      //     <div className="text-gray-600">{currentDate}</div>
      //   </div>

      //   <div className="mb-2 flex justify-between">
      //     <span className="text-[#249BA2] font-medium">Отработано сегодня:</span>
      //     <span className="font-bold text-[#249BA2]">{Math.floor(hoursWorked)} ч. и {Math.round((hoursWorked % 1) * 60)} мин.  из 8 ч</span>
      //   </div>

      //   <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
      //     <div
      //       className="absolute top-0 left-0 h-full bg-[#249BA2] transition-all duration-500 ease-in-out"
      //       style={{ width: `${workdayPercentage}%` }}
      //     ></div>
      //     <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-medium">
      //       {workdayPercentage}%
      //     </div>
      //   </div>

      //   {loading ? (
      //     <div className="mt-4 grid grid-cols-4 gap-2">
      //       {[...Array(4)].map((_, index) => (
      //         <div key={index} className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
      //       ))}
      //     </div>
      //   ) : (
      //     <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
      //       {/* <div className="bg-gray-50 rounded-lg p-3 text-center">
      //         <div className="text-xs text-gray-500">План</div>
      //         <div className="font-bold text-[#249BA2]">8 ч</div>
      //       </div>
      //       <div className="bg-gray-50 rounded-lg p-3 text-center">
      //         <div className="text-xs text-gray-500">Факт</div>
      //         <div className="font-bold text-[#249BA2]">{hoursWorked} ч</div>
      //       </div>
      //       <div className="bg-gray-50 rounded-lg p-3 text-center">
      //         <div className="text-xs text-gray-500">Осталось</div>
      //         <div className="font-bold text-[#249BA2]">{Math.max(8 - hoursWorked, 0).toFixed(1)} ч</div>
      //       </div>
      //       <div className="bg-gray-50 rounded-lg p-3 text-center">
      //         <div className="text-xs text-gray-500">Эффективность</div>
      //         <div className="font-bold text-[#249BA2]">{workdayPercentage}%</div>
      //       </div> */}
      //     </div>
      //   )}
      // </div>