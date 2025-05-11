import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";
import { CircularProgress } from "./CircularProgress";

export function TopFunctions({ data }: any) {
  const byFunctions = data?.by_functions || { typical: [], non_typical: [] };
  const functions = [...byFunctions.typical, ...byFunctions.non_typical]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  return (
    <div className="bg-gray-800 rounded-2xl p-5 mb-6 shadow-lg m-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Топ функций</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {functions.map((func, index) => {
            const convertedTime = convertDataToNormalTime(func.hours);

          return (
            <div
              key={func.function_id}
              className="bg-gray-700 rounded-2xl p-4 shadow"
            >
              <div className="flex justify-center mb-3">
                <CircularProgress
                  percentage={func?.percent}
                  color={
                    index % 3 === 0
                      ? "rgb(20, 184, 166)"
                      : index % 3 === 1
                      ? "rgb(236, 72, 153)"
                      : "rgb(34, 197, 94)"
                  }
                >
                  <div className="text-lg font-bold">
                    {func.percent.toFixed(1)}%
                  </div>
                </CircularProgress>
              </div>
              <div className="text-center mb-2 font-medium line-clamp-2 h-12">
                {func.function_name}
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <div>{convertedTime}</div>
                <div>
                  {func.entries_count}{" "}
                  {func.entries_count === 1 ? "запись" : "записи"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
