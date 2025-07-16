"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { PulseLogo } from "@/svgs/Logo"
import sendUserLoginData from "@/components/server/auth/login"

export default function LoginPage() {
  const router = useRouter()

  const [login, setLogin] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<{ status: boolean; text: string }>({
    status: false,
    text: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      login: login || "",
      password: password || "",
    }
    setLoading(true)
    setError({
      status: false,
      text: "",
    })

    try {
      const resultData = await sendUserLoginData(data)

      if (!resultData) {
        setLoading(false)
        setError({
          status: true,
          text: "Ошибка аутентификации пользователя",
        })
        return
      }

      localStorage.setItem("lc-pos-x", resultData.isBoss)
      if (resultData.isBoss) {
        localStorage.setItem("lc-dep-x", resultData.departmentId)
      }

      router.push("/profile")
    } catch (err: any) {
      console.log(err)
      setError({
        status: true,
        text: "Не удалось выполнить вход, попробуйте снова.",
      })
      setShowPopup(true)
      setTimeout(() => setIsPopupVisible(true), 50)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#249BA2] to-[#FF0000] flex flex-col items-center justify-center p-4  select-none">
      <main className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <PulseLogo className="w-16 h-16 text-[#FF0000]" />
          <h1 className="mt-4 text-3xl font-bold text-[#000000]">Вход в систему</h1>
          <p className="mt-2 text-center text-[#6D6D6D]">Введите ваши данные для доступа к системе</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-[#6D6D6D] mb-1">
              Логин
            </label>
            <input
              id="login"
              name="login"
              type="text"
              autoComplete="name"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
              placeholder="Введите логин"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-[#6D6D6D] mb-1">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="********"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5 text-gray-500 hover:text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-500 hover:text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-between items-center text-sm">
          <Link href="/forgot-password" className="text-[#249BA2] hover:underline">
            Забыли пароль?
          </Link>
          <Link href="/register" className="text-[#249BA2] hover:underline">
           Регистрация
          </Link>
        </div>
      </main>

      {showPopup && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
            isPopupVisible ? "bg-opacity-50" : "bg-opacity-0"
          } flex items-center justify-center z-50`}
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out ${
              isPopupVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <h2 className="text-xl font-bold text-[#000000] mb-2">Ошибка</h2>
            <p className="text-[#FF0000] mb-4">{error.text}</p>
            <button
              onClick={() => {
                setIsPopupVisible(false)
                setTimeout(() => setShowPopup(false), 300)
              }}
              className="w-full py-2 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
