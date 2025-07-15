"use client"

import { useState } from "react"
import { ProgressBar } from "./ProgressBar"

interface local {
  distribution: {
    by_type: {
      functions: {
        hours: number
        percent: number
      }
      deputies: {
        hours: number
        percent: number
      }
      compulsory: {
        hours: number
        percent: number
      }
      non_compulsory: {
        hours: number
        percent: number
      }
      typical: {
        hours: number
        percent: number
      }
      non_typical: {
        hours: number
        percent: number
      }
    }
  }
}

export const Bytypes = ({ data }: { data: local["distribution"] }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!data) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
        <h2 className="text-xl font-bold text-foreground mb-4">Распределение по типам</h2>
        <div className="text-center py-8">
          <div className="text-muted-foreground text-lg">Нет данных для отображения</div>
        </div>
      </div>
    )
  }

  const hasTypicalData = data?.by_type?.typical?.hours > 0 || data?.by_type?.non_typical?.hours > 0

  const toggleExpanded = () => {
    if (hasTypicalData) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
      <h2 className="text-xl font-bold text-foreground mb-6">Распределение по типам</h2>
      <div className="flex flex-col space-y-4">
        <div
          className={`${
            hasTypicalData ? "cursor-pointer hover:bg-secondary/5 rounded-lg p-2 -m-2 transition-all duration-200" : ""
          }`}
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-2">
            {/* {hasTypicalData && (
              <div className="text-muted-foreground transition-transform duration-200">
                {isExpanded ? "a": "s"}
              </div>
            )} */}
            <div className="flex-1">
              <ProgressBar
                label="Основные сотрудников"
                value={data?.by_type?.compulsory?.percent ?? 0}
                color="#249BA2" // Secondary color
                hours={data?.by_type?.compulsory?.hours ?? 0}
                showClickHint={hasTypicalData}
              />
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3 ml-6 pl-4 border-l-2 border-secondary/30">
            <ProgressBar
              label="Типичные для сотрудников"
              value={data?.by_type?.typical?.percent ?? 0}
              color="#249BA2" // Secondary color
              hours={data?.by_type?.typical?.hours ?? 0}
              isSubItem={true}
            />
            <ProgressBar
              label="Нетипичные для сотрудников"
              value={data?.by_type?.non_typical?.percent ?? 0}
              color="#FF0000" // Primary color
              hours={data?.by_type?.non_typical?.hours ?? 0}
              isSubItem={true}
            />
          </div>
        </div>

        <ProgressBar
          label="Дополнительные"
          value={data?.by_type?.non_compulsory?.percent ?? 0}
          color="#6B7280" // Neutral gray
          hours={data?.by_type?.non_compulsory?.hours ?? 0}
        />
      </div>

      {hasTypicalData && (
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
          Нажмите на "Основные сотрудников" для детализации
        </div>
      )}
    </div>
  )
}
