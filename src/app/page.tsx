'use client';

import { PulseLogo } from '@/svgs/Logo'
import { host } from '@/types';
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function HomePage() {
  console.log(host,process.env.HOST)
  const router  = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900   flex flex-col items-center justify-center p-4 rounded-lg">
      <main className="mainWrapper">
        <header className="flex flex-col items-center">
          <PulseLogo className="w-24 h-24 text-red-600  animate-pulse" />
          <h1 className="mt-4 text-4xl font-bold text-gray-100">Рабочий Пульс</h1>
          <p className="mt-2 text-center text-gray-400">Приложение для отслеживания трудозатрат.</p>
        </header>
        <nav className="space-y-4">
          <Link 
            href="/register" 
            prefetch={false}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Регистрация
          </Link>
          {/* Решить шнягу с входом */}
          <button className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          
          onClick={()=>{
            router.push("/login")
          }}>
              Вход
            </button>
        </nav>
      </main>
      <footer className="footerAuthStyles">
        <p>&copy;  {`${new Date().getFullYear()} Рабочий Пульс `}</p>
      </footer>
    </div>
  )
}

