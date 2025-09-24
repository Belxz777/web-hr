"use client"

import { useEffect, useState } from "react"

const BackendStatusChecker = () => {
  const [isBackendDown, setIsBackendDown] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const AlertIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-pulse">
      <path
        d="M12 2L22 20H2L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  )

  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const checkBackendStatus = async () => {
    try {
      const response = await fetch("/api/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache:'no-cache'
      })

      if (!response.ok) {
        throw new Error("Backend is not responding")
      }

      const data = await response.json()

      if (data.status !== "success") {
        throw new Error("Backend status is not ok")
      }

      // Если бекенд работает, скрываем предупреждение
      setIsBackendDown(false)
      setIsVisible(false)
    } catch (error) {
      console.log(" Backend check failed:", error)
      setIsBackendDown(true)
      setIsVisible(true)
    }
  }

  useEffect(() => {
    // Проверяем статус при загрузке
    checkBackendStatus()

    // Проверяем статус каждые 30 секунд
    const interval = setInterval(checkBackendStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isBackendDown || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl border-t-4 border-red-400 animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-500/20 p-2 rounded-full">
              <AlertIcon />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-bold text-lg sm:text-xl text-white drop-shadow-sm">
             Проблемы с подключением к серверу |
              </span>
              <span className="text-sm sm:text-base text-red-100 font-medium">
                Данные могут быть недоступны (возможна бесконечная загрузка)
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 hover:bg-red-500/30 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Закрыть предупреждение"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default BackendStatusChecker
