"use client"

import { useRouter } from "next/navigation"

export function BackButton(text:string, className:string ) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      aria-label="Вернуться назад" 
      className={`flex items-center text-gray-600 hover:text-red-600 transition duration-300 bg-center text-center ${className}`}
    >
      {text}
    </button>
  )
}

