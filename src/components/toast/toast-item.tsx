"use client"

import { Toast } from "@/types"
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

  const getIcon = () => {
    return toast.type === "error" ? "✕" : "ℹ"
  }

  const containerStyle: React.CSSProperties = {
    transform: `translateY(${isVisible && !isRemoving ? "0" : "-100%"})`,
    opacity: isVisible && !isRemoving ? 1 : 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "16px",
    minWidth: "500px",
    maxWidth: "600px",
    fontSize: "25px",
    fontWeight: "700",
    fontFamily: "system-ui, -apple-system, sans-serif",
  }

  const contentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flex: 1,
  }

  const iconStyle: React.CSSProperties = {
    marginRight: "16px",
    fontSize: "24px",
    fontWeight: "bold",
  }

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
    padding: "6px 10px",
    opacity: 0.7,
    marginLeft: "20px",
    fontWeight: "bold",
  }

  return (
    <div
      style={containerStyle}
      className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl text-4xl hover:bg-secondary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-between"
    >
      <div style={contentStyle}>
        <span style={iconStyle}>{getIcon()}</span>
        <span>{toast.message}</span>
      </div>
      <button
        style={closeButtonStyle}
        onClick={handleRemove}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.7"
        }}
      >
        ×
      </button>
    </div>
  )
}

export default ToastItem
