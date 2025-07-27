"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import sendReport from "@/components/server/userdata/report"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { Header } from "@/components/ui/header"
import { getAllFunctionsForReport } from "@/components/server/userdata/functions"
import { CustomSelect } from "@/components/ui/CustomSelect"
import { formatReportDate } from "@/components/utils/format"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import ToastComponent from "@/components/toast/toast"

interface Responsibility {
  deputyId: number
  deputyName: string
}

interface FunctionItem {
  funcId: number
  funcName: string
}

interface ResponsibilitiesData {
  nonCompulsory: Responsibility[]
  functions: FunctionItem[]
}

interface FormData {
  func_id: number
  deputy_id: number
  workingHours: string
  comment: string
}

// Упрощенная работа с localStorage
const setHoursToday = (hours: number) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const item = {
    value: hours,
    expiry: tomorrow.getTime(),
  }
  localStorage.setItem("hourstoday", JSON.stringify(item))
}

const getHoursToday = (): number => {
  try {
    const itemStr = localStorage.getItem("hourstoday")
    if (!itemStr) return 0

    const item = JSON.parse(itemStr)
    const now = new Date()

    if (now.getTime() > item.expiry) {
      localStorage.removeItem("hourstoday")
      return 0
    }

    return Number(item.value) || 0
  } catch {
    return 0
  }
}

export default function ReportPage() {
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    func_id: 0,
    deputy_id: 0,
    workingHours: "0.50",
    comment: "",
  })
  const [responsibilities, setResponsibilities] = useState<ResponsibilitiesData>({
    nonCompulsory: [],
    functions: [],
  })
  const [type, setType] = useState<string>("main")
  const [hoursWorked, setHoursWorked] = useState<number>(0)

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true)
        const data = await getAllFunctionsForReport()

        if (data) {
          setResponsibilities(data)

          // Автовыбор первого элемента если он единственный
          if (data.functions.length === 1) {
            setFormData((prev) => ({
              ...prev,
              func_id: data.functions[0].funcId,
              deputy_id: 0,
            }))
          }

          if (data.nonCompulsory.length === 1) {
            setFormData((prev) => ({
              ...prev,
              deputy_id: data.nonCompulsory[0].deputyId,
              func_id: 0,
            }))
          }
        }
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error)
        window.toast?.error("Не удалось загрузить список обязанностей")
      } finally {
        setDataLoading(false)
      }
    }

    // Загрузка отработанных часов
    if (typeof window !== "undefined") {
      setHoursWorked(getHoursToday())
    }

    fetchData()
  }, [])

  // Обработка изменений формы
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target

      if (name === "workingHours") {
        const numValue = Number(value)
        const formattedValue = (numValue / 60).toFixed(2)
        setFormData((prev) => ({
          ...prev,
          [name]: formattedValue,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    },
    [],
  )

  // Валидация формы
  const validateForm = useCallback((): { isValid: boolean; message?: string } => {
    if (type === "main" && !formData.func_id) {
      return { isValid: false, message: "Выберите основную обязанность" }
    }

    if (type === "ext" && !formData.deputy_id) {
      return { isValid: false, message: "Выберите дополнительную обязанность" }
    }

    if (Number(formData.workingHours) <= 0) {
      return { isValid: false, message: "Укажите корректное количество отработанного времени" }
    }

    return { isValid: true }
  }, [type, formData])

  // Обработка смены типа
  const handleTypeChange = useCallback(
    (newType: string) => {
      setType(newType)

      if (newType === "ext" && responsibilities.nonCompulsory.length > 0) {
        setFormData((prev) => ({
          ...prev,
          deputy_id: responsibilities.nonCompulsory[0].deputyId,
          func_id: 0,
        }))
      } else if (newType === "main" && responsibilities.functions.length > 0) {
        setFormData((prev) => ({
          ...prev,
          func_id: responsibilities.functions[0].funcId,
          deputy_id: 0,
        }))
      }
    },
    [responsibilities],
  )

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = validateForm()
    if (!validation.isValid) {
      window.toast?.error(validation.message || "Проверьте правильность данных")
      return
    }

    setLoading(true)

    try {
      // Подготовка данных отчета
      const reportData =
        type === "main"
          ? {
              func_id: formData.func_id,
              workingHours: Number(formData.workingHours),
              comment: formData.comment,
            }
          : {
              deputy_id: formData.deputy_id,
              workingHours: Number(formData.workingHours),
              comment: formData.comment,
            }

      await sendReport(reportData)

      // Обновление отработанных часов
      if (typeof window !== "undefined") {
        const newHours = hoursWorked + Number(formData.workingHours)
        setHoursToday(newHours)
        setHoursWorked(newHours)
      }

      // Очистка формы после успешной отправки
      setFormData({
        func_id: type === "main" && responsibilities.functions.length === 1 ? responsibilities.functions[0].funcId : 0,
        deputy_id:
          type === "ext" && responsibilities.nonCompulsory.length === 1
            ? responsibilities.nonCompulsory[0].deputyId
            : 0,
        workingHours: "0.50",
        comment: "",
      })

      window.toast?.info("Отчет успешно отправлен!")
    } catch (error) {
      console.error("Error submitting report:", error)
      window.toast?.error(`Произошла ошибка при отправке отчета`)
    } finally {
      setLoading(false)
    }
  }

  // Форматирование времени
  const formatTime = (hoursDecimal: number) => {
    const totalMinutes = Math.round(hoursDecimal * 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours} ч ${minutes} мин`
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
        <ToastComponent />
        <Header title="Заполнение отчета" showPanel={false} position={1} />
        <main className="container mx-auto p-4 flex-grow">
          <div className="max-w-2xl mx-auto mt-6 bg-card rounded-xl shadow-lg p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded-lg w-3/4 mx-auto"></div>
              <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto"></div>
              <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto"></div>
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded-xl"></div>
                <div className="h-12 bg-muted rounded-xl"></div>
                <div className="h-20 bg-muted rounded-xl"></div>
                <div className="h-32 bg-muted rounded-xl"></div>
                <div className="h-12 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
        <UniversalFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
      <ToastComponent />
      <Header title="Заполнение отчета" showPanel={false} position={1} />

      <main className="container mx-auto p-4 flex-grow">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-6 bg-card rounded-xl shadow-lg p-6 space-y-6">
          <h1 className="text-center text-foreground text-2xl font-bold">Заполнение отчета</h1>

          <div className="text-center space-y-2">
            <div className="text-foreground text-lg font-semibold">Отчет за: {formatReportDate(new Date())}</div>
            <div className="text-foreground text-lg font-semibold">
              Сегодня отработано: {convertDataToNormalTime(hoursWorked)}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-foreground mb-2 font-medium">
                Тип обязанности
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              >
                <option value="main">Основная</option>
                <option value="ext">Дополнительная</option>
              </select>
            </div>

            <div>
              <label htmlFor="tf_id" className="block text-foreground mb-2 font-medium">
                Выберите обязанность
              </label>
              <CustomSelect
                type={type}
                formData={formData}
                setFormData={setFormData}
                responsibilities={responsibilities}
              />
            </div>

            <div>
              <label className="block mb-2 text-foreground font-medium">Количество рабочих часов</label>
              <div className="space-y-4">
                <input
                  type="range"
                  id="workingHoursSlider"
                  name="workingHours"
                  min="5"
                  max="480"
                  step="5"
                  value={Math.round(Number(formData.workingHours) * 60)}
                  onChange={handleChange}
                  className="w-full h-2 bg-secondary/30 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{formatTime(Number(formData.workingHours))}</div>
                  
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-foreground mb-2 font-medium">
                Комментарий
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Опишите выполненную работу (необязательно)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary font-bold text-primary-foreground rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg"
          >
            {loading ? "Отправка..." : "Отправить отчет"}
          </button>
        </form>
      </main>

      <UniversalFooter />
    </div>
  )
}
