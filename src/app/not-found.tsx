"use client"
import { useRouter } from "next/navigation";
export default function Custom404() {
  const router = useRouter()
    return (
      <main className="flex flex-col items-center justify-center min-h-screen  bg-basic-default">
       <div className="text-6xl mb-4 select-none">4️⃣0️⃣4️⃣</div>
      <div className="text-center">
        <h1 className="text-4xl font-bold  text-basic-default mb-4">Не найдено</h1>
        <p className="text-basic-default mb-8">Извините, но страница, которую вы искали, не найдена.</p>
      </div>
      <button
        className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors duration-300"
      onClick={() => router.back()}
      >
        Вернуться обратно
      </button>
    </main>
    )
  }