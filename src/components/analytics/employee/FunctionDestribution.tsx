import { CircularProgress } from "@/components/dashboard/CircularProgress"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"


interface FunctionItem {
  function_id: number
  function_name: string
  hours: number
  percent: number
  entries_count: number
}

interface ExtraItem {
  type: string
  deputy_id: number
  deputy_name: string
  hours: number
  percent: number
  entries_count: number
}

interface Distribution {
  by_functions: {
    typical: FunctionItem[]
    non_typical: FunctionItem[]
  }
  extra: ExtraItem[]
}

interface FunctionDistributionSectionProps {
  distribution?: Distribution
  totalHours: number
}

export function FunctionDistributionSection({ distribution, totalHours }: FunctionDistributionSectionProps) {
  if (!distribution) {
    return (
      <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Распределение функций и обязанностей
        </h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Загрузка данных о функциях...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Пожалуйста, подождите</p>
        </div>
      </div>
    )
  }

  const { by_functions, extra } = distribution
  const hasTypical = by_functions.typical.length > 0
  const hasNonTypical = by_functions.non_typical.length > 0
  const hasExtra = extra.length > 0

  return (
    <div className="space-y-8">
      {/* Typical Functions */}
      {hasTypical && (
        <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Типичные функции для сотрудника</h2>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full font-medium">
              {by_functions.typical.length} {by_functions.typical.length === 1 ? "функция" : "функций"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {by_functions.typical.map((func) => (
              <FunctionCard key={func.function_id} item={func} color="#32CD32" type="typical" />
            ))}
          </div>
        </div>
      )}

      {/* Non-Typical Functions */}
      {hasNonTypical && (
        <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 bg-red-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Нетипичные функции для сотрудника</h2>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-full font-medium">
              {by_functions.non_typical.length} {by_functions.non_typical.length === 1 ? "функция" : "функций"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {by_functions.non_typical.map((func) => (
              <FunctionCard key={func.function_id} item={func} color="#B22222" type="non-typical" />
            ))}
          </div>
        </div>
      )}

      {/* Extra Duties */}
      {hasExtra && (
        <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-8 bg-yellow-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Дополнительные обязанности</h2>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full font-medium">
              {extra.length} {extra.length === 1 ? "обязанность" : "обязанностей"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extra.map((item, index) => (
              <ExtraCard key={`${item.deputy_id}-${index}`} item={item} color="#F0E68C" />
            ))}
          </div>
        </div>
      )}

      {/* No Data State */}
      {!hasTypical && !hasNonTypical && !hasExtra && (
        <div className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Распределение функций и обязанностей
          </h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Нет данных для отображения</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Данные появятся после создания отчетов</p>
          </div>
        </div>
      )}
    </div>
  )
}

function FunctionCard({
  item,
  color,
  type,
}: {
  item: FunctionItem
  color: string
  type: "typical" | "non-typical"
}) {
  const convertedTime = convertDataToNormalTime(item.hours)

  return (
    <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        <CircularProgress percentage={item.percent} color={color} size="lg">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.percent.toFixed(1)}%</div>
          </div>
        </CircularProgress>
      </div>

      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[3.5rem] flex items-center justify-center leading-tight">
          {item.function_name}
        </h3>
      </div>

      <div className="space-y-3 border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Время:</span>
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">{convertedTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Отчетов:</span>
          <span className="font-semibold text-base text-gray-700 dark:text-gray-300">{item.entries_count}</span>
        </div>
        <div className="flex justify-center">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              type === "typical"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {type === "typical" ? "Типичная" : "Нетипичная"}
          </span>
        </div>
      </div>
    </div>
  )
}

function ExtraCard({ item, color }: { item: ExtraItem; color: string }) {
  const convertedTime = convertDataToNormalTime(item.hours)

  return (
    <div className="bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-center mb-4">
        <CircularProgress percentage={item.percent} color={color} size="lg">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.percent.toFixed(1)}%</div>
          </div>
        </CircularProgress>
      </div>

      <div className="text-center mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[3.5rem] flex items-center justify-center leading-tight">
          {item.deputy_name}
        </h3>
      </div>

      <div className="space-y-3 border-t border-gray-200 dark:border-gray-600 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Время:</span>
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">{convertedTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Отчетов:</span>
          <span className="font-semibold text-base text-gray-700 dark:text-gray-300">{item.entries_count}</span>
        </div>
        <div className="flex justify-center">
          <span className="text-xs px-3 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            Дополнительная
          </span>
        </div>
      </div>
    </div>
  )
}
