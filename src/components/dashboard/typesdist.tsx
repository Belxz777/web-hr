"use client"
import { useState } from "react"
import { ProgressBar } from "./ProgressBar"
import { basicColorsHrs } from "@/store/sets"

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
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">Распределение по типам</h2>
        <div className="text-center py-12">
          <div className="text-muted-foreground text-xl font-medium">Нет данных для отображения</div>
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
    <div className="bg-card/95 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
      <h2 className="text-2xl font-bold text-foreground mb-8">Распределение по типам</h2>

      <div className="flex flex-col space-y-6">
        <div
          className={`${
            hasTypicalData ? "cursor-pointer hover:bg-secondary/5 rounded-lg p-3 -m-3 transition-all duration-200" : ""
          }`}
          onClick={toggleExpanded}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar
                label="Основные обязанности"
                value={data?.by_type?.compulsory?.percent ?? 0}
                color="#249BA2"
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
          <div className="flex flex-col space-y-4 ml-8 pl-6 border-l-2 border-secondary/30">
            <ProgressBar
              label="Типичные для сотрудников"
              value={data?.by_type?.typical?.percent ?? 0}
              color={basicColorsHrs.main.typical}
              hours={data?.by_type?.typical?.hours ?? 0}
              isSubItem={true}
            />
            <ProgressBar
              label="Нетипичные для сотрудников"
              value={data?.by_type?.non_typical?.percent ?? 0}
              color={basicColorsHrs.main.nontypical}
              hours={data?.by_type?.non_typical?.hours ?? 0}
              isSubItem={true}
            />
          </div>
        </div>

        <ProgressBar
          label="Дополнительные обязанности"
          value={data?.by_type?.non_compulsory?.percent ?? 0}
          color={basicColorsHrs.extra}
          hours={data?.by_type?.non_compulsory?.hours ?? 0}
        />
      </div>

      {hasTypicalData && (
        <div className="mt-6 text-sm text-muted-foreground flex items-center gap-2 font-medium">
          Нажмите на "Основные обязанности" для детализации
        </div>
      )}
    </div>
  )
}
