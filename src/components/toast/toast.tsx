"use client"

import React, { useState, useCallback } from "react"
import ToastItem from "./toast-item"
import type { Toast,ToastOptions } from "@/types"

interface ToastComponentProps {
  className?: string
}

const ToastComponent: React.FC<ToastComponentProps> = ({ className }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const addToast = useCallback((message: string, type: "info" | "error", options: ToastOptions = {}) => {
    const id = generateId()
    const toast: Toast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
    }

    setToasts((prev) => [...prev, toast])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showInfo = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, "info", options)
    },
    [addToast],
  )

  const showError = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, "error", options)
    },
    [addToast],
  )

  // Экспортируем методы в глобальный объект для использования
  React.useEffect(() => {
    ;(window as any).toast = {
      info: showInfo,
      error: showError,
    }
  }, [showInfo, showError])

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    pointerEvents: "none",
  }

  return (
    <div style={containerStyle} className={className}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  )
}

export default ToastComponent
