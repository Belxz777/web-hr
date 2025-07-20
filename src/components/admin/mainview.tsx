"use client"
import { ViewState } from "."
import { Symbol } from "../ui/symbol"
interface MainViewProps {
onNavigate: (value: ViewState) => void
}

export default function MainView({ onNavigate }: MainViewProps) {
  return (
    <div className="space-y-4">
        <Symbol text="Заполнение системы" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Отделы</h2>
          <button
            onClick={() => onNavigate("select_department")}
            className="w-full p-3 text-left border border-gray-300 hover:bg-gray-50"
          >
            Управление отделами
          </button>
          <button
            onClick={() => onNavigate("create_department")}
            className="w-full p-3 text-left border border-gray-300 hover:bg-gray-50"
          >
            Создать отдел
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Должности и обязанности</h2>
          <button
            onClick={() => onNavigate("create_job")}
            className="w-full p-3 text-left border border-gray-300 hover:bg-gray-50"
          >
            Создать должность
          </button>
          <button
            onClick={() => onNavigate("create_deputy")}
            className="w-full p-3 text-left border border-gray-300 hover:bg-gray-50"
          >
            Создать  обязанность (главная функция должности(единственная))
          </button>
          <button
            onClick={() => onNavigate("create_function")}
            className="w-full p-3 text-left border border-gray-300 hover:bg-gray-50"
          >
            Создать функцию(подфункция обязанности)
          </button>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">Кадры</h2>
          <button
            onClick={() => onNavigate("promotions")}
            className="w-full p-3 text-left border  hover:bg-gray-50 bg-blue-50 border-blue-300"
          >
            Повышения и назначения
          </button>
        </div>
      </div>
    </div>
  )
}
