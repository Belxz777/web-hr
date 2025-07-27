"use client"

import type { Deputy } from "@/types"
import { useState, useEffect } from "react"

interface EmployeeResponsibilitiesProps {
  responsibilitiesFs?: Deputy[]
  position?: number
  hoursWorked?: number
  isLoading?: boolean
}

export function EmployeeResponsibilities({
  responsibilitiesFs = [],
  isLoading = false,
}: EmployeeResponsibilitiesProps) {
  const [showMainResponsibilities, setShowMainResponsibilities] = useState(true)
  const [showAdditionalResponsibilities, setShowAdditionalResponsibilities] = useState(true)
  const [hoursWorked, setHoursWorked] = useState(0)

  // Упрощаем логику - убираем внутренний loading state
  const functionalData = responsibilitiesFs || []
  const mainResponsibilities = functionalData.filter((item) => item.compulsory)
  const additionalResponsibilities = functionalData.filter((item) => !item.compulsory)

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const workdayPercentage = Math.min(Math.round((hoursWorked / 8) * 100), 100)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hoursToday = localStorage.getItem("hourstoday")
      if (hoursToday) {
        const obj = JSON.parse(hoursToday)
        setHoursWorked(Number(obj.value))
      }
    }
  }, [])

  const renderSkeletonContent = () => (
    <div className="opacity-100 transition-opacity duration-500 ease-in-out">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skeleton для основной обязанности */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm min-h-[200px]">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-xl"></div>
          </div>
          <div className="space-y-3">
            <div className="animate-pulse bg-gray-200 rounded-xl h-14"></div>
          </div>
        </div>

        {/* Skeleton для дополнительных обязанностей */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-sm min-h-[200px]">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded-xl"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-200 rounded-xl h-12"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => (
    <div className="opacity-100 transition-opacity duration-500 ease-in-out">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Основная обязанность */}
        <div className="bg-[#249BA2] rounded-xl p-6 text-white shadow-sm min-h-[200px] transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-4 border-b border-white/30 pb-2">
            <h3 className="text-xl font-bold">Основная</h3>
            <button
              onClick={() => setShowMainResponsibilities(!showMainResponsibilities)}
              className="px-3 py-1 bg-white text-[#249BA2] rounded-xl hover:bg-gray-100 transition-colors text-sm font-bold flex items-center"
            >
              {showMainResponsibilities ? "Скрыть" : `Показать (${mainResponsibilities.length})`}
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${showMainResponsibilities ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
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
          </div>
        </div>

        {/* Дополнительные обязанности */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm min-h-[200px] transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h3 className="text-xl font-bold text-[#000000]">Дополнительные</h3>
            <button
              onClick={() => setShowAdditionalResponsibilities(!showAdditionalResponsibilities)}
              className="px-3 py-1 bg-[#249BA2] text-white rounded-xl hover:bg-[#1e8a90] transition-colors text-sm font-bold flex items-center"
            >
              {showAdditionalResponsibilities ? "Скрыть" : `Показать (${additionalResponsibilities.length})`}
            </button>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${showAdditionalResponsibilities ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}
          >
            {additionalResponsibilities.length > 0 ? (
              <ul className="space-y-3">
                {additionalResponsibilities.map((item) => (
                  <li
                    key={item.deputyId}
                    className="text-[#249BA2] px-4 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center">{item.deputyName}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#249BA2] px-4 py-3 border border-gray-100 rounded-xl">Дополнительных задач нет</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mb-8 transition-all duration-500 ease-in-out">
      <h2 className="text-2xl font-bold mb-4 text-[#000000] my-4">Функциональные обязанности</h2>

      {/* Фиксированный контейнер для предотвращения прыжков */}
      <div className="min-h-[250px] transition-all duration-500 ease-in-out">
        {isLoading ? renderSkeletonContent() : renderContent()}
      </div>
    </div>
  )
}
