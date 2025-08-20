"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import registerUser from "@/components/server/auth/register"
import { useRouter } from "next/navigation"
import useGetAllJobs from "@/hooks/useGetAllJobs"
import useGetAlldeps from "@/hooks/useDeps"
import logo from "../../../public/logo_1_.svg"
import Image from "next/image"
import ToastComponent from "@/components/toast/toast"

export default function RegisterPage() {
  const router = useRouter()
  const { jobs, loading: jobsLoading } = useGetAllJobs()
  const { deps, loading: depsLoading } = useGetAlldeps()

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    name: "",
    surname: "",
    patronymic: "",
    job_id: 0,
    department_id: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Состояние для кастомного селекта должностей
  const [jobSelectOpen, setJobSelectOpen] = useState(false)
  const [jobSearchTerm, setJobSearchTerm] = useState("")
  const jobDropdownRef = useRef<HTMLDivElement>(null)

  // Функция для капитализации имен
  const capitalizeName = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  // Фильтрация и сортировка должностей
  const filteredAndSortedJobs = useMemo(() => {
    return jobs
      .filter((job) => job.name.toLowerCase().includes(jobSearchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, "ru", { sensitivity: "base" }))
  }, [jobs, jobSearchTerm])

  // Сортировка отделов
  const sortedDepartments = useMemo(() => {
    return [...deps].sort((a, b) => a.name.localeCompare(b.name, "ru", { sensitivity: "base" }))
  }, [deps])

  // Обработчик клика вне компонента для должностей
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target as Node)) {
        setJobSelectOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let processedValue = value

    // Автоматическая капитализация для имен
    if (name === "name" || name === "surname" || name === "patronymic") {
      processedValue = capitalizeName(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "job_id" || name === "department_id" ? Number.parseInt(value) || 0 : processedValue,
    }))
  }, [])

  // Обработчик выбора должности
  const handleJobSelect = useCallback((jobId: number) => {
    setFormData((prev) => ({ ...prev, job_id: jobId }))
    setJobSelectOpen(false)
    setJobSearchTerm("")
  }, [])

  const getSelectedJobLabel = useCallback(() => {
    const selected = jobs.find((job) => job.id === formData.job_id)
    return selected?.name || "Выберите должность"
  }, [formData.job_id, jobs])

  const validateForm = useCallback((): { isValid: boolean; message?: string } => {
    if (!formData.login.trim()) {
      return { isValid: false, message: "Введите логин" }
    }
    if (formData.login.length < 3) {
      return { isValid: false, message: "Логин должен содержать минимум 3 символа" }
    }
    if (formData.password.length < 12) {
      return { isValid: false, message: "Пароль должен содержать минимум 12 символов" }
    }
    // if (!formData.name.trim()) {
    //   return { isValid: false, message: "Введите имя" }
    // }
    if (!formData.surname.trim()) {
      return { isValid: false, message: "Введите фамилию" }
    }
    if (formData.job_id === 0) {
      return { isValid: false, message: "Выберите должность" }
    }
    if (formData.department_id === 0) {
      return { isValid: false, message: "Выберите отдел" }
    }
    return { isValid: true }
  }, [formData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validation = validateForm()
    if (!validation.isValid) {
      window.toast?.error(validation.message || "Проверьте правильность данных")
      return
    }

    setIsLoading(true)
    try {
      await registerUser(formData)
      window.toast?.info("Регистрация успешна! Перенаправление...")
      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    } catch (err) {
      console.error("Submit error:", err)
      window.toast?.error("Ошибка регистрации. Возможно, логин уже занят")
    } finally {
      setIsLoading(false)
    }
  }

  const renderJobSelect = () => {
    if (jobsLoading) {
      return (
        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl animate-pulse">
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
      )
    }

    const selectedLabel = getSelectedJobLabel()

    return (
      <div className="relative w-full" ref={jobDropdownRef}>
        <button
          type="button"
          className="w-full px-4 py-3 cursor-pointer bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent appearance-none transition-all duration-200 hover:border-[#249BA2] text-left flex justify-between items-center"
          onClick={() => setJobSelectOpen(!jobSelectOpen)}
          aria-expanded={jobSelectOpen}
          aria-haspopup="listbox"
        >
          <span className={formData.job_id === 0 ? "text-gray-500" : "text-gray-900"}>{selectedLabel}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${jobSelectOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {jobSelectOpen && (
          <div
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto rounded-xl"
            role="listbox"
          >
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Поиск вашей должности"
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent rounded-xl"
                aria-label="Search jobs"
              />
            </div>

            <div className="py-1">
              {filteredAndSortedJobs.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  {jobSearchTerm ? "Должность не найдена" : "Должности не найдены"}
                </div>
              ) : (
                filteredAndSortedJobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50 ${
                      formData.job_id === job.id ? "bg-[#249BA2]/10 text-[#249BA2] font-medium" : "text-gray-900"
                    }`}
                    onClick={() => handleJobSelect(job.id)}
                    role="option"
                    aria-selected={formData.job_id === job.id}
                  >
                    {job.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderDepartmentSelect = () => {
    if (depsLoading) {
      return (
        <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl animate-pulse">
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
      )
    }

    return (
      <select
        id="department_id"
        name="department_id"
        required
        value={formData.department_id === 0 ? "" : formData.department_id}
        onChange={handleChange}
        className="w-full px-4 py-3 cursor-pointer bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent appearance-none transition-all duration-200 hover:border-[#249BA2]"
      >
        <option value="">Выберите отдел</option>
        {sortedDepartments.map((dept, index) => (
          <option key={index} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#249BA2] to-[#FF0000] flex flex-col items-center justify-center p-4">
      <ToastComponent />
      <main className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full transform transition-all duration-300 ease-in-out hover:shadow-2xl">
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center gap-4">
            <Image src={logo || "/placeholder.svg"} alt="Logo" className="w-16 h-16 select-none" />
            <h1 className="text-3xl font-bold text-[#000000]">Регистрация</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Логин */}
            <div className="space-y-2">
              <label htmlFor="login" className="block text-sm font-medium text-[#6D6D6D]">
                Логин
              </label>
              <input
                id="login"
                name="login"
                type="text"
                required
                value={formData.login}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent transition-all duration-200 hover:border-[#249BA2]"
                placeholder="Введите логин"
              />
            </div>

            {/* Пароль */}
            <div className="relative space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#6D6D6D]">
                Пароль (минимум 12 символов)
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent transition-all duration-200 hover:border-[#249BA2]"
                placeholder="Введите пароль"
              />
              <button
                type="button"
                className="absolute right-3 top-9 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Имя */}
            {/* <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-[#6D6D6D]">
                Имя
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent transition-all duration-200 hover:border-[#249BA2]"
                placeholder="Введите имя"
              />
            </div> */}

            {/* Фамилия */}
            <div className="space-y-2">
              <label htmlFor="surname" className="block text-sm font-medium text-[#6D6D6D]">
               Ваш код
              </label>
              <input
                id="surname"
                name="surname"
                type="text"
                required
                value={formData.surname}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent transition-all duration-200 hover:border-[#249BA2]"
                placeholder="Введите ваш код"
              />
            </div>

            {/* Отчество */}
            {/* <div className="space-y-2">
              <label htmlFor="patronymic" className="block text-sm font-medium text-[#6D6D6D]">
                Отчество
              </label>
              <input
                id="patronymic"
                name="patronymic"
                type="text"
                value={formData.patronymic}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent transition-all duration-200 hover:border-[#249BA2]"
                placeholder="Введите отчество"
              />
            </div> */}

            {/* Должность */}
            <div className="space-y-2">
              <label htmlFor="job_id" className="block text-sm font-medium text-[#6D6D6D]">
                Должность
              </label>
              {renderJobSelect()}
            </div>

            {/* Отдел */}
            <div className="space-y-2">
              <label htmlFor="department_id" className="block text-sm font-medium text-[#6D6D6D]">
                Отдел
              </label>
              {renderDepartmentSelect()}
            </div>
          </div>

          {/* Требования к паролю */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-[#000000] mb-2">Требования к паролю:</h3>
            <ul className="text-xs text-[#6D6D6D] space-y-1">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Минимум 12 символов
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Рекомендуется использовать буквы и цифры
              </li>
            </ul>
          </div>

          {/* Кнопка регистрации */}
          <button
            type="submit"
            disabled={isLoading || jobsLoading || depsLoading}
            className="w-full py-3 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Регистрация...
              </>
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#6D6D6D]">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#249BA2] hover:underline transition-colors duration-200">
              Войти
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
