import { ProgressBar } from "./ProgressBar";

export const DepartmentStatsInDayPer = ({ data }: any) => {
    if (!data) return null;
  
    return (
      <div className="bg-gray-800 rounded-2xl p-4 m-3">
        <h2 className="text-xl font-bold mb-4">Распределение по типам</h2>
        <div className="flex flex-col space-y-4">
          <ProgressBar
            label="Функции"
            value={data.by_type?.typical?.percent ?? 0}
            color="bg-teal-500"
            hours={data.by_type?.typical?.hours ?? 0}
          />
          <ProgressBar
            label="Нетипичные"
            value={data.by_type?.non_typical?.percent ?? 0}
            color="bg-pink-500"
            hours={data.by_type?.non_typical?.hours ?? 0}
          />
          <ProgressBar
            label="Функциональные обязанности"
            value={data.by_type?.compulsory?.percent ?? 0}
            color="bg-indigo-500"
            hours={data.by_type?.compulsory?.hours ?? 0}
          />
          <ProgressBar
            label="Дополнительные"
            value={data.by_type?.non_compulsory?.percent ?? 0}
            color="bg-orange-500"
            hours={data.by_type?.non_compulsory?.hours ?? 0}
          />
        </div>
      </div>
    );
  };