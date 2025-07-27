import { convertDataToNormalTime } from "../utils/convertDataToNormalTime"
import { CircularProgress } from "./CircularProgress"

export function TopFunctions({ data }: any) {
  const byFunctions = data?.by_functions || { typical: [], non_typical: [] }
  const byDeps = data?.by_deputies || []

  const functions = [
    ...byFunctions.typical.map((f: any) => ({ ...f, isTypical: true })),
    ...byFunctions.non_typical.map((f: any) => ({ ...f, isTypical: false })),
  ]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 6)

  const deputies = [...byDeps].sort((a, b) => b.percent - a.percent).slice(0, 6)

  const hasFunctions = functions.length > 0
  const hasDeputies = deputies.length > 0

  if (!hasFunctions && !hasDeputies) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-8 mb-6 shadow-lg border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">Топ функций и обязанностей</h2>
        <div className="text-center py-12">
          <div className="text-muted-foreground text-xl font-medium">Нет данных для отображения</div>
          <div className="text-muted-foreground text-base mt-3">Данные появятся после создания отчетов</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl p-8 mb-6 shadow-lg border border-border">
      {hasFunctions && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Самые выполняемые функции</h2>
            <div className="text-base text-muted-foreground font-medium">
              Показано {functions.length} из {byFunctions.typical.length + byFunctions.non_typical.length}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {functions.map((func, index) => {
              const convertedTime = convertDataToNormalTime(func.hours)
              return (
                <div
                  key={func.function_id}
                  className="bg-background/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-center mb-4">
                    <CircularProgress percentage={func?.percent} color={func.isTypical ? "#32CD32" : "#B22222"}>
                      <div className="text-2xl font-bold text-foreground">{func.percent.toFixed(1)}%</div>
                    </CircularProgress>
                  </div>
                  <div className="text-center mb-4">
                    <div className="font-bold text-lg text-foreground line-clamp-2 min-h-[3.5rem] flex items-center justify-center leading-tight">
                      {func.function_name}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground border-t border-border pt-4">
                    <div className="font-bold text-2xl">{convertedTime}</div>
                    <div className="text-base font-medium">{func.entries_count} отчетов</div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {hasDeputies && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Самые выполняемые дополнительные обязанности</h2>
            <div className="text-base text-muted-foreground font-medium">
              Показано {deputies.length} из {byDeps.length}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deputies.map((deputy, index) => {
              const convertedTime = convertDataToNormalTime(deputy.hours)
              return (
                <div
                  key={index}
                  className="bg-background/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-center mb-4">
                    <CircularProgress percentage={deputy?.percent} color="#F0E68C">
                      <div className="text-2xl font-bold text-foreground">{deputy.percent.toFixed(1)}%</div>
                    </CircularProgress>
                  </div>
                  <div className="text-center mb-4">
                    <div className="font-bold text-lg text-foreground line-clamp-2 min-h-[3.5rem] flex items-center justify-center leading-tight">
                      {deputy.deputy_name}
                    </div>
                  </div>
                  <div className="flex justify-center text-muted-foreground border-t border-border pt-4">
                    <div className="font-bold text-2xl">{convertedTime}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {!hasFunctions && hasDeputies && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-6 mb-8">
          <div className="text-secondary font-bold text-lg">Функции не найдены</div>
          <div className="text-muted-foreground text-base mt-2">Нет данных по основным функциям для отображения</div>
        </div>
      )}

      {hasFunctions && !hasDeputies && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
          <div className="text-primary font-bold text-lg">Дополнительные обязанности не найдены</div>
          <div className="text-muted-foreground text-base mt-2">
            Нет данных по дополнительным обязанностям для отображения
          </div>
        </div>
      )}
    </div>
  )
}
