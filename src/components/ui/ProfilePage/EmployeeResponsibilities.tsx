"use client"

import type { Deputy } from "@/types"
import { useState, useEffect } from "react"

interface EmployeeResponsibilitiesProps {
  responsibilitiesFs?: Deputy[]
  position?: number
}

export function EmployeeResponsibilities({ responsibilitiesFs = [], position }: EmployeeResponsibilitiesProps) {
  const [loading, setLoading] = useState(!responsibilitiesFs || responsibilitiesFs.length === 0)
  const [showMainResponsibilities, setShowMainResponsibilities] = useState(true)
  const [showAdditionalResponsibilities, setShowAdditionalResponsibilities] = useState(true)
  const [functionalData, setFunctionalData] = useState<Deputy[]>(responsibilitiesFs)

  // Separate responsibilities by type
  const mainResponsibilities = functionalData.filter((item) => item.compulsory)
  const additionalResponsibilities = functionalData.filter((item) => !item.compulsory)

  useEffect(() => {
    if (responsibilitiesFs && responsibilitiesFs.length > 0) {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
    setFunctionalData(responsibilitiesFs)
  }, [responsibilitiesFs])

  if (!functionalData) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-[#000000]">Функциональные обязанности</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-pulse bg-gray-200 rounded-xl h-48"></div>
          <div className="animate-pulse bg-gray-200 rounded-xl h-48"></div>
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
