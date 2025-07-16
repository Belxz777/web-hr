"use client"

import { basicColors, basicColorsHrs } from "@/store/sets"
import { convertDataToNormalTime } from "../utils/convertDataToNormalTime"

interface DailySummaryData {

  date: string
  total_hours: number
  function_hours: number
  deputy_hours: number
}

interface DailySummaryGridProps {
  data: DailySummaryData[]

}

export function DailySummaryGrid({ data}: DailySummaryGridProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
        <h3 className="text-xl font-bold text-foreground mb-4">Активность</h3>
        <div className="text-center py-8">
          <div className="text-muted-foreground text-lg">Нет данных за выбранный период</div>
          <div className="text-muted-foreground text-sm mt-2">Данные появятся после создания отчетов</div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    return { day, month }
  }

  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
    return days[date.getDay()]
  }



  const maxHours = Math.max(...data.map((d) => d.total_hours))

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground">Активность</h3>
        <div className="text-sm text-muted-foreground">
          {data.length} {data.length === 1 ? "день" : "дней"}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
        {data.map((day, index) => {
          const { day: dayNum, month } = formatDate(day.date)
          const dayName = getDayName(day.date)
          // const intensity = getIntensityLevel(day.total_hours)
          // const intensityColor = getIntensityColor(intensity)
          const totalTime = convertDataToNormalTime(day.total_hours)
          const functionTime = convertDataToNormalTime(day.function_hours)
          const deputyTime = convertDataToNormalTime(day.deputy_hours)

          return (
            <div
              key={day.date}
              className={`
                relative group cursor-pointer
                bg-background/50 backdrop-blur-sm
                rounded-xl p-4 border border-border
                hover:shadow-lg hover:scale-105
                transition-all duration-300 ease-out
                min-h-[120px] flex flex-col justify-between
              `}
            >
              {/* Date header */}
              <div className="text-center mb-2">
                <div className="text-xs text-muted-foreground font-medium">{dayName}</div>
                <div className="text-lg font-bold text-foreground">
                  {dayNum}
                  <span className="text-xs text-muted-foreground ml-1">.{month}</span>
                </div>
              </div>

              {/* Hours visualization */}
              <div className="flex-1 flex flex-col justify-center items-center space-y-2">
                {/* Main hours circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    bg-gradient-to-r from-green-500/20 to-transparent
                    border-2 border-l-green-800/[${Math.min((day.total_hours / 8) * 100, 100)}%] border-border/50
                    transition-all duration-300 group-hover:scale-110
                  `}
                >
                  <span className="text-xs font-bold text-foreground">{day.total_hours}ч</span>
                </div>

                {/* Hours breakdown bars */}
                {/* <div className="w-full space-y-1">
                  {day.function_hours > 0 && (
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-1 ${basicColors.main.typical} rounded-full`}></div>
                      <div className="text-xs text-muted-foreground">{day.function_hours}ч</div>
                    </div>
                  )}
                  {day.deputy_hours > 0 && (
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-1 ${basicColors.extra} rounded-full`}></div>
                      <div className="text-xs text-muted-foreground">{day.deputy_hours}ч</div>
                    </div>
                  )}
                </div> */}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-foreground/90 text-background text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-medium mb-1">{day.date}</div>
                  <div>Всего: {totalTime}</div>
                  {day.function_hours > 0 && <div>Основные: {functionTime}</div>}
                  {day.deputy_hours > 0 && <div>Дополнительные: {deputyTime}</div>}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-foreground/90"></div>
                </div>
              </div>

              {/* Intensity indicator */}
              {/* <div className="absolute top-2 right-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    intensity === "high"
                      ? "bg-primary"
                      : intensity === "medium"
                        ? "bg-secondary"
                        : intensity === "low"
                          ? "bg-muted"
                          : "bg-border"
                  }`}
                ></div>
              </div> */}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {/* <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${basicColors.main.typical} rounded-full`}></div>
          <span>Основные функции</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${basicColors.extra} rounded-full`}></div>
          <span>Дополнительные обязанности</span>
        </div>

      </div> */}

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-background/30 rounded-lg border border-border/50">
          <div className="text-lg font-bold text-foreground">
            {convertDataToNormalTime(data.reduce((sum, day) => sum + day.total_hours, 0))}
          </div>
          <div className="text-xs text-muted-foreground">Всего часов</div>
        </div>
        <div className={`text-center p-3 bg-background/30 rounded-lg border border-border/50 text-[${basicColorsHrs.main.typical}] `}>
          <div className={`text-lg font-bold  text-${basicColors.main.typical} `}>
            {convertDataToNormalTime(data.reduce((sum, day) => sum + day.function_hours, 0))}
          </div>
          <div className="text-xs text-muted-foreground">Основные</div>
        </div>
        <div className={`text-center p-3 bg-background/30 rounded-lg border border-border/50 text-[${basicColorsHrs.extra}] `}>
          <div className={`text-lg font-bold  text-${basicColors.extra} `}>
            {convertDataToNormalTime(data.reduce((sum, day) => sum + day.deputy_hours, 0))}
          </div>
          <div className="text-xs text-muted-foreground">Дополнительные</div>
        </div>
        <div className="text-center p-3 bg-background/30 rounded-lg border border-border/50">
          <div className="text-lg font-bold text-foreground">
            {convertDataToNormalTime(data.reduce((sum, day) => sum + day.total_hours, 0) / data.length)}
          </div>
          <div className="text-xs text-muted-foreground">Среднее в день</div>
        </div>
      </div>
    </div>
  )
}
