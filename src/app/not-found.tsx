"use client"
import Image from "next/image";

import { useRouter } from "next/navigation";
import { PulseLogo } from "@/svgs/Logo";
export default function Custom404() {
  const router = useRouter()
    return (
      <main className="flex flex-col items-center justify-center min-h-screen  bg-basic-default">
      <div className="mb-8   animate-pulse">
          <PulseLogo className="w-24 h-24 text-red-600" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold  text-basic-default mb-4">Не найдено</h1>
        <p className="text-basic-default mb-8">Извините, но страница, которую вы искали, не найдена.</p>
      </div>
      <button
        className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors duration-300"
      onClick={() => router.push("/")}
      >
        Вернуться на главную
      </button>
    </main>
    )
  }