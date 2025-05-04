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
  const [showAdditionalResponsibilities, setShowAdditionalResponsibilities] = useState(false)
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
    <div className="space-y-8 taskSectionStyles">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">{"Ваши задачи:"}</h2>

        {loading ? (
          <div className="w-full">
            {[1, 2, 3, 4, 5].map((e) => (
              <div key={e} className="w-full animate-pulse">
                <div className="h-10 bg-red-100 rounded w-full mb-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Main Responsibilities Section */}
            {mainResponsibilities.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Основные обязанности</h3>
                  <button
                    onClick={() => setShowMainResponsibilities(!showMainResponsibilities)}
                    className="buttonRedirectStyles"
                  >
                    {showMainResponsibilities ? "Скрыть" : `Показать все (${mainResponsibilities.length})`}
                  </button>
                </div>

                {showMainResponsibilities && (
                  <div className="space-y-2">
                    {mainResponsibilities.map((item) => (
                      <div key={item.deputyId} className="bg-gray-700 rounded-xl border border-gray-600 p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-base flex-1 min-w-0 pr-4">{item.deputyName}</h3>
                          <div className="flex flex-col gap-2 min-w-[100px] sm:flex-row sm:space-x-2 sm:justify-end sm:min-w-0">
                            <span className="px-2 py-0.5 rounded-full text-center text-base   whitespace-nowrap bg-red-600 text-white font-bold">
                              Основная обязанность
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Additional Responsibilities Section */}
            {additionalResponsibilities.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Дополнительные обязанности</h3>
                  <button
                    onClick={() => setShowAdditionalResponsibilities(!showAdditionalResponsibilities)}
                    className="buttonLogoutStyles"
                  >
                    {showAdditionalResponsibilities ? "Скрыть" : `Показать все (${additionalResponsibilities.length})`}
                  </button>
                </div>

                {showAdditionalResponsibilities && (
                  <div className="space-y-2">
                    {additionalResponsibilities.map((item) => (
                      <div key={item.deputyId} className="bg-gray-700/40 rounded-xl border border-gray-600 p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-base flex-1 min-w-0 pr-4">{item.deputyName}</h3>
                          <div className="flex flex-col gap-2 min-w-[100px] sm:flex-row sm:space-x-2 sm:justify-end sm:min-w-0">
                            <span className="px-2 py-0.5 rounded-full text-center text-base whitespace-nowrap bg-green-600 text-gray-300 text-bold">
                              Дополнительная обязанность
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
