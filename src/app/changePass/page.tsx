"use client"

import type React from "react"

import { useState } from "react"
import {changePassword} from "@/components/server/auth/passchange"
import { useRouter } from "next/navigation"
import type { changePass } from "@/types"
import { Symbol } from "@/components/ui/symbol"
import UniversalFooter from "@/components/buildIn/UniversalFooter"

export default function ChangePassword() {
  const [showWarning, setShowWarning] = useState({
    status: false,
    text: "",
  })
  const router = useRouter()
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [showPassword, setShowPassword] = useState({
    oldpass: false,
    newpass: false,
    newpassconfirm: false,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [credentials, setCredentials] = useState<changePass>({
    old_password: "",
    new_password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    if (credentials.new_password !== confirmPassword) {
      setShowWarning({ ...showWarning, status: true, text: "Подтвержденный и новый пароль не совпадают" })
      setIsPopupVisible(true)
      setLoading(false)
      return
    }
    if (credentials.new_password.length < 12) {
      setShowWarning({
        ...showWarning,
        status: true,
        text: "Пароль должен содержать минимум 12 символов",
      })
      setIsPopupVisible(true)
      setLoading(false)
      return
    }
    if (credentials) {
      try {
        const req = await changePassword(credentials)
        if (req.detail) {
          setShowWarning({ ...showWarning, status: true, text: req.detail })
          setIsPopupVisible(true)
          setLoading(false)
          return
        }
        setTimeout(() => {
          setIsPopupVisible(false)
        }, 3000)
        setLoading(false)
        alert(req.message)
        router.push("/login")
      } catch (error) {
        console.error(error)
        setLoading(false)
        setShowWarning({ ...showWarning, status: true, text: "Не удалось изменить пароль" })
        setIsPopupVisible(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#249BA2] to-[#FF0000] flex flex-col items-center justify-center p-4">
      <main className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <header className="flex flex-col items-center mb-6">
       <Symbol text="Смена пароля" />
          <h1 className="mt-4 text-3xl font-bold text-[#000000]">Смена пароля</h1>
          <p className="mt-2 text-center text-[#6D6D6D]">Введите старый и новый пароль для изменения</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pass" className="block text-sm font-medium text-[#6D6D6D] mb-1 select-none">
              Старый пароль
            </label>
            <div className="relative">
              <input
                id="pass"
                name="pass"
                type={showPassword.oldpass ? "text" : "password"}
                required
                value={credentials.old_password}
                onChange={(e) => setCredentials({ ...credentials, old_password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="Введите старый пароль"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword({ ...showPassword, oldpass: !showPassword.oldpass })}
                aria-label={showPassword.oldpass ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword.oldpass ? (
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#6D6D6D] mb-1 select-none">
              Новый пароль
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                autoComplete="new-password"
                type={showPassword.newpass ? "text" : "password"}
                required
                value={credentials.new_password}
                onChange={(e) => setCredentials({ ...credentials, new_password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="Введите новый пароль"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword({ ...showPassword, newpass: !showPassword.newpass })}
                aria-label={showPassword.newpass ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword.newpass ? (
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

          <div>
            <label htmlFor="propassword" className="block text-sm font-medium text-[#6D6D6D] mb-1">
              Подтвердите пароль
            </label>
            <div className="relative">
              <input
                id="propassword"
                name="propassword"
                type={showPassword.newpassconfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="Повторите новый пароль"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword({ ...showPassword, newpassconfirm: !showPassword.newpassconfirm })}
                aria-label={showPassword.newpassconfirm ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword.newpassconfirm ? (
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
              className="w-full py-3 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Смена...
                </>
              ) : (
                "Поменять пароль"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => router.push("/profile")} className="text-[#249BA2] hover:underline text-sm">
            Вернуться в профиль
          </button>
        </div>
      </main>

      {showWarning.status && (
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
            isPopupVisible ? "bg-opacity-50" : "bg-opacity-0"
          } flex items-center justify-center z-50`}
        >
          <div
            className={`bg-white p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out max-w-md mx-4 ${
              isPopupVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <h2 className="text-xl font-bold text-[#FF0000] mb-4">{showWarning.text}</h2>
            <button
              onClick={() => {
                setIsPopupVisible(false)
                setTimeout(() => setShowWarning({ status: false, text: "" }), 300)
              }}
              className="w-full py-2 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <UniversalFooter />
    </div>
  )
}
