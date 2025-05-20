"use client"

import { PulseLogo } from "@/svgs/Logo"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#249BA2] to-[#FF0000] flex flex-col items-center justify-center p-4">
      <main className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <header className="flex flex-col items-center">
          <PulseLogo className="w-16 h-16 text-[#FF0000]" />
          <h1 className="mt-6 text-2xl font-bold text-[#000000] text-center">Оценка функциональной эффективности</h1>
          <p className="mt-2 text-center text-[#6D6D6D] text-sm">Эффективный менеджер трудозатрат</p>
        </header>
        <nav className="w-full space-y-4 mt-8">
          <Link
            href="/register"
            prefetch={false}
            className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Регистрация
          </Link>
          <button
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-[#249BA2] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#249BA2]"
            onClick={() => {
              router.push("/login")
            }}
          >
            Вход
          </button>
        </nav>

        <div className="mt-10 w-full">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#6D6D6D]">О системе</span>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-[#6D6D6D]">
            Система "Рабочий Пульс" предназначена для эффективного управления трудозатратами и отслеживания выполнения
            задач.
          </p>
        </div>
      </main>
    </div>
  )
}
