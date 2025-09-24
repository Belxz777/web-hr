"use client"

import type { Toast } from "@/types"
import type React from "react"
import { useEffect, useState } from "react"

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Анимация появления
    const showTimer = setTimeout(() => setIsVisible(true), 10)

    // Автоматическое скрытие
    const hideTimer = setTimeout(() => {
      handleRemove()
    }, toast.duration || 4000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [toast.duration])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300)
  }

  const ErrorIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-pulse">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  const InfoIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-bounce">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )

  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const getIcon = () => {
    return toast.type === "error" ? <ErrorIcon /> : <InfoIcon />
  }

  const getToastStyles = () => {
    const baseClasses =
      "px-6 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between border-2 backdrop-blur-sm"

    if (toast.type === "error") {
      return `${baseClasses} bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 hover:from-red-600 hover:to-red-700`
    }

    return `${baseClasses}  bg-secondary text-white border-blue-400 hover:from-blue-600 hover:to-blue-700`
  }

  const containerStyle: React.CSSProperties = {
    transform: `translateY(${isVisible && !isRemoving ? "0" : "-100%"}) scale(${isVisible && !isRemoving ? "1" : "0.9"})`,
    opacity: isVisible && !isRemoving ? 1 : 0,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "16px",
    minWidth: "400px",
    maxWidth: "600px",
  }

  return (
    <div style={containerStyle} className={getToastStyles()}>
      <div className="flex items-center flex-1">
        <div className="mr-4 p-1 bg-white/20 rounded-full">{getIcon()}</div>
        <span className="text-lg font-bold drop-shadow-sm">{toast.message}</span>
      </div>
      <button
        onClick={handleRemove}
        className="ml-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 hover:opacity-100"
        aria-label="Закрыть уведомление"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

export default ToastItem
