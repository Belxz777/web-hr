import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";
import { CircularProgress } from "./CircularProgress";

export function TopFunctions({ data }: any) {
  const byFunctions = data?.by_functions || { typical: [], non_typical: [] };
  const byDeps = data?.by_deputies || [];

  const functions = [
    ...byFunctions.typical.map((f: any) => ({ ...f, isTypical: true })),
    ...byFunctions.non_typical.map((f: any) => ({ ...f, isTypical: false })),
  ]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 6);

  const deputies = [...byDeps]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 6);

  const hasFunctions = functions.length > 0;
  const hasDeputies = deputies.length > 0;

  if (!hasFunctions && !hasDeputies) {
    return (
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">
          Топ функций и обязанностей
        </h2>
        <div className="text-center py-8">
          <div className="text-muted-foreground text-lg">
            Нет данных для отображения
          </div>
          <div className="text-muted-foreground text-sm mt-2">
            Данные появятся после создания отчетов
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/95 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-border">
      {hasFunctions && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Топ функций</h2>
            <div className="text-sm text-muted-foreground">
              Показано {functions.length} из{" "}
              {byFunctions.typical.length + byFunctions.non_typical.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {functions.map((func, index) => {
              const convertedTime = convertDataToNormalTime(func.hours);

              return (
                <div
                  key={func.function_id}
                  className="bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-center mb-3">
                    <CircularProgress
                      percentage={func?.percent}
                      color={func.isTypical ? "#32CD32" : "#B22222"}
                    >
                      <div className="text-lg font-bold text-foreground">
                        {func.percent.toFixed(1)}%
                      </div>
                    </CircularProgress>
                  </div>
                  <div className="text-center mb-3">
                    <div className="font-medium text-foreground line-clamp-2 h-12 flex items-center justify-center">
                      {func.function_name}
                    </div>
                    <div className="text-xs mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          func.isTypical
                            ? "bg-secondary/20 text-secondary border border-secondary/30"
                            : "bg-primary/20 text-primary border border-primary/30"
                        }`}
                      >
                        {func.isTypical ? "Типичная" : "Нетипичная"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground border-t border-border pt-2">
                    <div className="font-medium">{convertedTime}</div>
                    <div>
                      {func.entries_count}{" "}
                      {func.entries_count === 1 ? "запись" : "записи"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {hasDeputies && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Топ дополнительных обязанностей
            </h2>
            <div className="text-sm text-muted-foreground">
              Показано {deputies.length} из {byDeps.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deputies.map((deputy, index) => {
              const convertedTime = convertDataToNormalTime(deputy.hours);

              return (
                <div
                  key={index}
                  className="bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-center mb-3">
                    <CircularProgress
                      percentage={deputy?.percent}
                      color="#F0E68C"
                    >
                      <div className="text-lg font-bold text-foreground">
                        {deputy.percent.toFixed(1)}%
                      </div>
                    </CircularProgress>
                  </div>
                  <div className="text-center mb-3">
                    <div className="font-medium text-foreground line-clamp-2 h-12 flex items-center justify-center">
                      {deputy.deputy_name}
                    </div>
                    <div className="text-xs mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted/20 text-muted-foreground border border-muted/30">
                        Дополнительная
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground border-t border-border pt-2">
                    <div className="font-medium">{convertedTime}</div>
                    <div>
                      {deputy.entries_count}{" "}
                      {deputy.entries_count === 1 ? "запись" : "записи"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!hasFunctions && hasDeputies && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6">
          <div className="text-secondary font-medium">Функции не найдены</div>
          <div className="text-muted-foreground text-sm">
            Нет данных по основным функциям для отображения
          </div>
        </div>
      )}

      {hasFunctions && !hasDeputies && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-primary font-medium">
            Дополнительные обязанности не найдены
          </div>
          <div className="text-muted-foreground text-sm">
            Нет данных по дополнительным обязанностям для отображения
          </div>
        </div>
      )}
    </div>
  );
}
