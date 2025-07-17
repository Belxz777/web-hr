"use client"
export const dynamic = "force-dynamic"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import sendReport from "@/components/server/userdata/report"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { Header } from "@/components/ui/header"
import { getAllFunctionsForReport } from "@/components/server/userdata/functions"
import { CustomSelect } from "@/components/ui/CustomSelect"
import { formatReportDate } from "@/components/utils/format"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
import { get } from "http"


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

interface ErrorState {
  status: boolean
  text: string
  success: boolean
}

interface FormData {
  func_id: number
  deputy_id: number
  workingHours: string
  comment: string
}
const setLocalStorageWithExpiry = (key: string, value: any) => {
  const now = new Date();
  // Создаем новую дату для expiry (19:00 текущего дня)
  const expiryDate = new Date(now );
  expiryDate.setDate(expiryDate.getDate() + 1); // Следующий день
  expiryDate.setHours(0, 0, 0, 0); // Ровно полночь
  // В полночь удаляются значения hoursWorked и comment

  if (now > expiryDate) {
    expiryDate.setDate(expiryDate.getDate() + 1);
  }

  const item = {
    value: value,
    timestamp: now.getTime(),
    expiry: expiryDate.getTime() // Сохраняем timestamp expiry даты
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getLocalStorageWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    // Проверяем expiry timestamp
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (e) {
    console.error("Error parsing localStorage item", e);
    return null;
  }
};

export default function ReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorState>({
    status: false,
    success: false,
    text: "",
  })
  const [formData, setFormData] = useState<FormData>({
    func_id: 0,
    deputy_id: 0,
    workingHours: "",
    comment: "",
  })
  const [responsibilities, setResponsibilities] = useState<ResponsibilitiesData>({
    nonCompulsory: [],
    functions: [],
  })
  const [type, setType] = useState<string>("main")
  const [hoursWorked, setHoursWorked] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllFunctionsForReport()
        if (data) {
          setResponsibilities(data)
          
          // Auto-select first item if only one exists
          if (data.functions.length === 1) {
            setFormData(prev => ({
              ...prev,
              func_id: data.functions[0].funcId,
              deputy_id: 0
            }))
          }
          if (data.nonCompulsory.length === 1) {
            setFormData(prev => ({
              ...prev,
              deputy_id: data.nonCompulsory[0].deputyId,
              func_id: 0
            }))
          }
        }
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error)
        setError({
          status: true,
          success: false,
          text: "Не удалось загрузить список обязанностей"
        })
      }
    }

    // Load hours worked from localStorage
    if (typeof window !== 'undefined') {
      const storedHours = getLocalStorageWithExpiry('hourstoday')
      setHoursWorked(storedHours ? Number(storedHours) : 0)
    }

    fetchData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "workingHours") {
      const numValue = Number(value)
      const formattedValue = (numValue / 60).toFixed(2)
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateForm = (): boolean => {
    if (type === "main" && !formData.func_id) {
      setError({
        status: true,
        text: "Выберите основную обязанность",
        success: false
      })
      return false
    }
    
    if (type === "ext" && !formData.deputy_id) {
      setError({
        status: true,
        text: "Выберите дополнительную обязанность",
        success: false
      })
      return false
    }
    
    if (Number(formData.workingHours) <= 0) {
      setError({
        status: true,
        text: "Укажите корректное количество часов",
        success: false
      })
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!validateForm()) {
        return
      }

      // Prepare report data based on type
      const reportData = type === "main" 
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

      const req = await sendReport(reportData)

      if (req) {
        // Update hours worked in localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          const newHours = (hoursWorked || 0) + Number(formData.workingHours)
          setLocalStorageWithExpiry('hourstoday', newHours)
          setHoursWorked(newHours)
        }

        setError({
          status: true,
          text: "Успешно",
          success: true,
        })

        setTimeout(() => {
          router.push("/profile")
        }, 1000)
      } else {
        setError({
          status: true,
          text: "Ошибка при отправке отчета",
          success: false,
        })
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      setError({
        status: true,
        text: "Ошибка при отправке отчета",
        success: false,
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (hoursDecimal: number) => {
    const totalMinutes = Math.round(hoursDecimal * 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours} ч ${minutes} мин`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary flex flex-col">
      <Header title="Заполнение отчета" showPanel={false} position={1} />
      <main className="container mx-auto p-4 flex-grow">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-6 bg-card rounded-xl shadow-lg p-6">
          <h1 className="text-center text-foreground text-2xl font-bold mb-6">Заполнение отчета</h1>
          <div className="mb-4 text-center text-foreground text-lg font-semibold">
            Отчет за: {formatReportDate(new Date())}
          </div>
          <div className="mb-4 text-center text-foreground text-lg font-semibold">
            Сегодня отработано: {convertDataToNormalTime(hoursWorked)}
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-foreground mb-2">
              Выберите Тип
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                if (e.target.value === "ext" && responsibilities.nonCompulsory.length > 0) {
                  setFormData(prev => ({
                    ...prev,
                    deputy_id: responsibilities.nonCompulsory[0].deputyId,
                    func_id: 0,
                  }))
                } else if (e.target.value === "main" && responsibilities.functions.length > 0) {
                  setFormData(prev => ({
                    ...prev,
                    func_id: responsibilities.functions[0].funcId,
                    deputy_id: 0,
                  }))
                }
              }}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value={"main"}>Основная</option>
              <option value={"ext"}>Дополнительная</option>
            </select>
            <label htmlFor="tf_id" className="block text-foreground mb-2 mt-4">
              Выберите обязанность
            </label>

            <CustomSelect
              type={type}
              formData={formData}
              setFormData={setFormData}
              responsibilities={responsibilities}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-foreground">Количество рабочих часов</label>
            <div className="flex flex-col items-center">
              <input
                type="range"
                id="workingHoursSlider"
                name="workingHours"
                min="5"
                max="480"
                step="5"
                value={Math.round(Number(formData.workingHours) * 60)}
                onChange={handleChange}
                className="w-full h-2 bg-secondary/30 rounded-lg appearance-none cursor-pointer my-2"
              />
              <div className="mt-2 text-xl font-bold select-none text-foreground">
                {formatTime(Number(formData.workingHours))}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-foreground mb-2">
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Опишите выполненную работу (необязательно)"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Отправка..." : "Отправить отчет"}
          </button>
        </form>
      </main>
      <UniversalFooter />
      {error.status && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out">
            {!error.success && <h1 className="text-primary text-xl font-bold">{error.text}</h1>}

            {error.success && (
              <div className="flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold text-foreground">Успешно</h1>
                <svg
                  className="w-16 h-16 text-secondary animate-[checkmark_0.4s_ease-in-out_forwards]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                    className="animate-[checkmark-path_0.4s_ease-in-out_forwards]"
                  />
                </svg>
              </div>
            )}

            {!error.success && (
              <button
                onClick={() => {
                  setError({ status: false, text: "", success: false })
                }}
                className="mt-4 w-full py-2 px-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                Закрыть
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}