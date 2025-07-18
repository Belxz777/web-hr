"use client"

interface StatsCardsProps {
  totalTime: string
  avgTime: string
  period: string
}

export const StatsCards = ({ totalTime, avgTime, period }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Общее отработанное время</h3>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalTime}</div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Средние показатели</h3>
        <div className="grid gap-2">
          <div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">{avgTime}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">часов на отчет</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Период</h3>
        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{period}</div>
      </div>
    </div>
  )
}
