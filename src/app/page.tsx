"use client"


import Link from "next/link"
import { useRouter } from "next/navigation"
import logo from "../../public/logo_1_.svg";
import Image from "next/image";
export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col items-center justify-center p-4 select-none">
      <main className="bg-card rounded-3xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <header className="flex flex-col items-center">
          <Image src={logo} alt="Logo" className="w-16 h-16 select-none" />
          <h1 className="mt-6 text-2xl font-bold text-foreground text-center">HR-эффективность</h1>
          <p className="mt-2 text-center text-muted-foreground text-sm">Система менеджмента трудозатрат</p>
        </header>
        <nav className="w-full space-y-4 mt-8">
          <Link
            href="/register"
            prefetch={false}
            className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-base font-medium text-primary-foreground bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Регистрация
          </Link>
          <button
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-base font-medium text-secondary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
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
              <span className="px-2 bg-white text-muted-foreground">О системе</span>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Система "HR-эффективность" предназначена для  отслеживания выполнения
            задач , а также предоставления информации о производительности сотрудников.
          </p>
        </div>
      </main>
    </div>
  )
}
