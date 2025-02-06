"use client"

import { useCallback, useState, type MouseEvent } from "react"

interface ContributionData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export default function ContributionGraph() {
  const [tooltip, setTooltip] = useState<{ show: boolean; data?: ContributionData; x: number; y: number }>({
    show: false,
    x: 0,
    y: 0,
  })

  // Generate sample data for the last year
  const generateData = useCallback(() => {
    const data: ContributionData[] = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setFullYear(today.getFullYear() - 1)

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      // Random contribution count for demo purposes
      const count = Math.floor(Math.random() * 10)
      let level: 0 | 1 | 2 | 3 | 4 = 0
      if (count > 0) level = 1
      if (count > 3) level = 2
      if (count > 6) level = 3
      if (count > 8) level = 4

      data.push({
        date: d.toISOString().split("T")[0],
        count,
        level,
      })
    }
    return data
  }, [])

  const data = generateData()

  const getMonths = () => {
    const months = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setFullYear(today.getFullYear() - 1)

    for (let d = new Date(startDate); d <= today; d.setMonth(d.getMonth() + 1)) {
      months.push(d.toLocaleString("default", { month: "short" }))
    }
    return months
  }

  const handleCellHover = (event: MouseEvent<HTMLDivElement>, data: ContributionData) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setTooltip({
      show: true,
      data,
      x: rect.left,
      y: rect.top - 40,
    })
  }

  const handleCellLeave = () => {
    setTooltip({ show: false, x: 0, y: 0 })
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 max-w-4xl border-none">
      <div className="text-sm mb-2">388 contributions in the last year</div> 
      <div className="relative">
        {tooltip.show && tooltip.data && (
          <div
            className="absolute z-10 bg-zinc-800 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            {tooltip.data.count} contributions on {tooltip.data.date}
            <div className="text-zinc-400">{Math.round((tooltip.data.count / 10) * 100)}% completion rate</div>
          </div>
        )}
        <div className="flex">
          <div className="w-8">
            <div className="h-[21px]"></div>
            <div className="grid grid-rows-[repeat(7,_21px)] text-xs text-zinc-400 gap-[2px]">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>
          </div>
          <div>
            <div className="flex text-xs text-zinc-400 mb-2 space-x-[42px]">
              {getMonths().map((month, i) => (
                <div key={i}>{month}</div>
              ))}
            </div>
            <div className="grid grid-cols-[repeat(53,_11px)] gap-[2px]">
              {data.map((day, i) => (
                <div
                  key={i}
                  className={`h-[11px] rounded-sm cursor-pointer ${
                    day.level === 0
                      ? "bg-zinc-800"
                      : day.level === 1
                        ? "bg-emerald-900"
                        : day.level === 2
                          ? "bg-emerald-700"
                          : day.level === 3
                            ? "bg-emerald-600"
                            : "bg-emerald-500"
                  }`}
                  onMouseEnter={(e) => handleCellHover(e, day)}
                  onMouseLeave={handleCellLeave}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 text-xs text-zinc-400 justify-end gap-2">
          <span>Less</span>
          <div className="flex gap-[2px]">
            <div className="w-[11px] h-[11px] rounded-sm bg-zinc-800" />
            <div className="w-[11px] h-[11px] rounded-sm bg-emerald-900" />
            <div className="w-[11px] h-[11px] rounded-sm bg-emerald-700" />
            <div className="w-[11px] h-[11px] rounded-sm bg-emerald-600" />
            <div className="w-[11px] h-[11px] rounded-sm bg-emerald-500" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

