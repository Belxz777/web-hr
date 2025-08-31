"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/components/server/auth/logout"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { Header } from "@/components/ui/header"
import { RoutesBoss } from "@/components/buildIn/ReportDownload"
import ToastComponent from "@/components/toast/toast"
import useEmployeeData from "@/hooks/useGetUserData"

interface ApiError {
  status: boolean;
  text: string;
  code?: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const { employeeData, loadingEmp, error: employeeError, refetch } = useEmployeeData()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleLogout = useCallback(async () => {
    const isConfirmed = confirm("Вы уверены что хотите выйти?")
    if (!isConfirmed) return

    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }, [router])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch()
    // Добавляем небольшую задержку для плавности анимации
    setTimeout(() => setIsRefreshing(false), 500)
  }, [refetch])

  const position = employeeData?.user?.position
  const isLoading = loadingEmp || isRefreshing || !employeeData

  // Автоматический рефетч при определенных ошибках
  useEffect(() => {
    if (employeeError.code === 'auth_error' && !isRefreshing) {
      // Автоматически пытаемся обновить при ошибках аутентификации
      const retryTimeout = setTimeout(() => {
        handleRefresh()
      }, 2000)

      return () => clearTimeout(retryTimeout)
    }
  }, [employeeError.code, isRefreshing, handleRefresh])

  const renderLoadingState = () => (
    <div className="opacity-100 transition-opacity duration-500 ease-in-out">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary/40 rounded-full animate-spin"
            style={{ animationDelay: "150ms" }}
          ></div>
        </div>
      </div>
      <div className="animate-pulse space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-primary/30 rounded-full animate-pulse" />
            <div className="h-6 bg-muted/60 rounded-lg w-48 animate-pulse" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-secondary/30 rounded-full animate-pulse" />
            <div className="h-6 bg-muted/60 rounded-lg w-56 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <div className="h-12 bg-secondary/30 rounded-xl w-40 animate-pulse" />
          <div className="h-12 bg-primary/30 rounded-xl w-32 animate-pulse" />
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground animate-pulse">
          {isRefreshing ? "Обновляем данные..." : "Загружаем ваши данные..."}
        </p>
      </div>
    </div>
  )

  const getErrorDetails = (error: ApiError) => {
    if (!error?.status) return null

    const errorMessage = error.text || "Неизвестная ошибка"

    const AlertIcon = () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    )

    const WifiOffIcon = () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m6.364-6.364L12 12"
        />
      </svg>
    )

    const TimeoutIcon = () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    )

    // Обработка таймаута
    if (errorMessage.includes('Request timeout')) {
      return {
        type: "timeout",
        title: "Таймаут запроса",
        message: "Сервер не отвечает. Проверьте соединение и попробуйте снова",
        icon: (
          <div className="text-amber-500">
            <TimeoutIcon />
          </div>
        ),
        action: handleRefresh,
        actionText: "Попробовать снова",
      }
    }

    // Используем код ошибки для более точного определения
    if (error.code === 'token_expired' || errorMessage.includes("Токен истек")) {
      return {
        type: "expired",
        title: "Сессия истекла",
        message: "Ваша сессия истекла. Необходимо войти в систему заново",
        icon: (
          <div className="text-orange-500">
            <AlertIcon />
          </div>
        ),
        action: () => router.push("/login"),
        actionText: "Войти заново",
      }
    }

    if (error.code === 'invalid_token' || errorMessage.includes("Неверный токен")) {
      return {
        type: "invalid",
        title: "Ошибка авторизации",
        message: "Неверный токен авторизации. Попробуйте войти заново",
        icon: (
          <div className="text-red-500">
            <AlertIcon />
          </div>
        ),
        action: () => router.push("/login"),
        actionText: "Войти заново",
      }
    }

    if (errorMessage.includes("Требуется аутентификация")) {
      return {
        type: "auth",
        title: "Требуется авторизация",
        message: "Пожалуйста, войдите в систему для доступа к профилю",
        icon: (
          <div className="text-amber-500">
            <AlertIcon />
          </div>
        ),
        action: () => router.push("/login"),
        actionText: "Войти в систему",
      }
    }

    if (errorMessage.includes("Пользователь не найден")) {
      return {
        type: "notfound",
        title: "Пользователь не найден",
        message: "Ваш профиль не найден в системе. Обратитесь к администратору",
        icon: (
          <div className="text-red-500">
            <AlertIcon />
          </div>
        ),
        action: handleRefresh,
        actionText: "Обновить страницу",
      }
    }

    if (error.status) {
      return {
        type: "server",
        title: "Ошибка сервера",
        message: "Временные проблемы с сервером. Попробуйте позже",
        icon: (
          <div className="text-red-500">
            <WifiOffIcon />
          </div>
        ),
        action: handleRefresh,
        actionText: "Попробовать снова",
      }
    }

    return {
      type: "generic",
      title: "Ошибка загрузки",
      message: errorMessage,
      icon: (
        <div className="text-red-500">
          <AlertIcon />
        </div>
      ),
      action: handleRefresh,
      actionText: "Обновить",
    }
  }

  const renderErrorState = () => {
    const errorDetails = getErrorDetails(employeeError)

    if (!errorDetails) return null

    const RefreshIcon = () => (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    )

    return (
      <div className="opacity-100 transition-opacity duration-500 ease-in-out flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20">{errorDetails.icon}</div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{errorDetails.title}</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">{errorDetails.message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={errorDetails.action}
              disabled={isRefreshing}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshIcon />
              )}
              {isRefreshing ? "Обновление..." : errorDetails.actionText}
            </button>
            {errorDetails.type !== "auth" && errorDetails.type !== "expired" && errorDetails.type !== "invalid" && (
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg active:scale-95"
              >
                На главную
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderProfileContent = () => {
    if (isLoading && !employeeData) {
      return renderLoadingState()
    }

    if (employeeError.status) {
      return renderErrorState()
    }

    if (employeeData?.user) {
      return (
        <div className="opacity-100 transition-opacity duration-500 ease-in-out space-y-4">
          <div className="cursor-pointer group">
            <h2 className="text-2xl text-foreground font-bold mb-2 select-none transition-colors duration-200">
              Ваш код: <span className="font-extrabold text-primary">{employeeData.user.code}</span>
            </h2>
            <div className="space-y-2 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-muted-foreground select-none">
                  Должность: <span className="font-bold text-foreground">{employeeData.job?.jobName}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-muted-foreground select-none">
                  Отдел: <span className="font-bold text-foreground">{employeeData.department}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => router.push("/changePass")}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg active:scale-95"
            >
              Сменить пароль
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg active:scale-95"
            >
              Выйти
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="mainProfileDiv">
      <ToastComponent />
      <Header title="Личный кабинет" position={position || 1} showPanel />
      <main className="container mx-auto p-4">
        <section className="bg-card/95 backdrop-blur-sm rounded-xl p-6 border border-border shadow-lg transition-all duration-300 ease-in-out">
          <div className="min-h-[200px] w-full flex flex-col justify-start transition-all duration-500 ease-in-out">
            {renderProfileContent()}
          </div>
        </section>

        {position && position !== 1 ? (
          <div className="transition-all duration-700 ease-in-out delay-100 opacity-100 translate-y-0">
            <RoutesBoss position={position} />
          </div>
        ) : null}
      </main>
      <UniversalFooter />
    </div>
  )
}