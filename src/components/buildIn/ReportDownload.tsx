"use client"

import { useRouter } from "next/navigation"

export function RoutesBoss() {
  const router = useRouter()

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-[#000000]">Аналитика</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/dashboard/employees")}
            className="w-full h-full p-4 text-left flex flex-col items-center group relative overflow-hidden rounded-xl border border-gray-200 hover:border-[#249BA2] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#249BA2] group-hover:w-full opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
            <div className="flex items-center justify-center w-14 h-14 bg-[#249BA2]/10 rounded-full mb-3 group-hover:bg-[#249BA2]/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-[#249BA2]"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#000000] group-hover:text-[#249BA2] transition-colors">
              Аналитика сотрудников
            </h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Просмотр статистики и показателей по всем сотрудникам
            </p>
            <div className="mt-4 px-4 py-2 bg-[#249BA2] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              Открыть
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/department/")}
            className="w-full h-full p-4 text-left flex flex-col items-center group relative overflow-hidden rounded-xl border border-gray-200 hover:border-[#249BA2] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#249BA2] group-hover:w-full opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
            <div className="flex items-center justify-center w-14 h-14 bg-[#249BA2]/10 rounded-full mb-3 group-hover:bg-[#249BA2]/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-[#249BA2]"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#000000] group-hover:text-[#249BA2] transition-colors">
              Аналитика отдела
            </h3>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Просмотр статистики и показателей по вашему отделу
            </p>
            <div className="mt-4 px-4 py-2 bg-[#249BA2] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              Открыть
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard/general")}
            className="w-full h-full p-4 text-left flex flex-col items-center group relative overflow-hidden rounded-xl border border-gray-200 hover:border-[#FF0000] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#FF0000] group-hover:w-full opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
            <div className="flex items-center justify-center w-14 h-14 bg-[#FF0000]/10 rounded-full mb-3 group-hover:bg-[#FF0000]/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-[#FF0000]"
              >
                <rect x="3" y="12" width="6" height="8" />
                <rect x="9" y="8" width="6" height="12" />
                <rect x="15" y="4" width="6" height="16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#000000] group-hover:text-[#FF0000] transition-colors">
              Общий анализ
            </h3>
            <p className="text-sm text-gray-500 mt-2 text-center">Просмотр общей статистики и аналитических данных</p>
            <div className="mt-4 px-4 py-2 bg-[#FF0000] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              Открыть
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}

