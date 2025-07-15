
"use client"
export const dynamic = "force-dynamic"


import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import sendReport from "@/components/server/userdata/report"
import UniversalFooter from "@/components/buildIn/UniversalFooter"
import { Header } from "@/components/ui/header"
import getAllFunctionsForReport from "@/components/server/userdata/getAllFunctionsForReport"
import { CustomSelect } from "@/components/ui/CustomSelect"
import { useLocalStorage } from "@/hooks/useLocalstorage"
import { convertDataToNormalTime } from "@/components/utils/convertDataToNormalTime"
const setLocalStorageWithExpiry = (key: string, value: any) => {
  const now = new Date();
  const item = {
    value: value,
    timestamp: now.getTime(),
    expiryDate: new Date(now).setHours(19, 0, 0, 0)
  };
  localStorage.setItem(key, JSON.stringify(item));
}
export default function ReportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [error, setError] = useState<{ status: boolean; text: string; success: boolean }>({
    status: false,
    success: false,
    text: "",
  })
  const [formData, setFormData] = useState({
    func_id: 0,
    deputy_id: 0,
    workingHours: "0.50",
    comment: "",
  })
  const [responsibilities, setResponsibilities] = useState<{
    length: any
    nonCompulsory: {
      deputyId: number
      deputyName: string
    }[]
    functions: {
      funcId: number
      funcName: string
    }[]
  }>({
    length: 0,
    nonCompulsory: [],
    functions: [],
  })
  const [type, settype] = useState<string>("main")
  const [hoursworked,sethoursworked] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllFunctionsForReport()
        setResponsibilities(data || [])
        if (data.functions.length === 1) {
          setFormData((prev) => ({
            ...prev,
            func_id: data.functions[0].funcId,
          }))
        } else if (data.nonCompulsory.length === 1) {
          setFormData((prev) => ({
            ...prev,
            deputy_id: data.nonCompulsory[0].deputyId,
          }))
        }
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error)
      }
    }
    if(typeof window !== 'undefined'){
      const hoursToday = localStorage.getItem('hourstoday')
      if(hoursToday){
        let obj = JSON.parse(hoursToday)
        sethoursworked(Number(obj.value))
      }
    }
    fetchData()
  }, [])

  const formatReportDate = (date: Date) => {
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
    const dayName = daysOfWeek[date.getDay()]
    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    return `${formattedDate}, ${dayName}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "workingHours") {
      const numValue = Number(value)
      let formattedValue

      if (e.target.id === "workingHoursManual") {
        formattedValue = (numValue / 60).toFixed(2)
      } else {
        formattedValue = (numValue / 60).toFixed(2)
      }

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
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (responsibilities?.functions?.length === 1) {
      setFormData({
        ...formData,
        func_id: Number(responsibilities.functions[0].funcId),
      })
    } else if (responsibilities?.nonCompulsory?.length === 1) {
      setFormData({
        ...formData,
        deputy_id: responsibilities.nonCompulsory[0].deputyId,
      })
    }
    if (responsibilities?.length) {
      console.log("No tasks available for report")
      alert("Нет доступных задач для отчета")
      return
    }

    if (!formData.func_id && !formData.deputy_id) {
      console.log("No task selected", formData)
      setError({
        status: true,
        text: "Выберите обязанность",
        success: false,
      })

      return
    }

    if (Number(formData.workingHours) <= 0) {
      console.log("Invalid working hours:", formData.workingHours)
      setError({
        status: true,
        text: "Укажите корректное количество часов",
        success: false,
      })
      return
    }

    setLoading(true)
    try {
      if (type === "main") {
        const reportData = {
          func_id: formData.func_id,
          workingHours: Number(formData.workingHours),
          comment: formData.comment,
        }
        const req = await sendReport(reportData)
        if (req) {
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
            text: "Ошибка",
            success: false,
          })
        }
      } else {
        const reportData = {
          deputy_id: formData.deputy_id,
          workingHours: Number(formData.workingHours),
          comment: formData.comment,
        }
        const req = await sendReport(reportData)
        if (req) {
          setError({
            status: true,
            text: "Успешно",
            success: true,
          })
          setTimeout(() => {
            router.push("/profile")
          }, 1000)

        } else {
          alert("Ошибка ")
        }
      }
          if (typeof window !== 'undefined' && window.localStorage) {

  let hours = Number(localStorage.getItem("hourstoday")) + Number(formData.workingHours)
setLocalStorageWithExpiry('hourstoday',hours)
}

    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Ошибка при отправке отчета")
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
            Уже отработано сегодня: {convertDataToNormalTime(hoursworked)}
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-foreground mb-2">
              Выберите Тип
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => {
                settype(e.target.value)
                if (e.target.value === "ext" && responsibilities.nonCompulsory.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    deputy_id: responsibilities.nonCompulsory[0].deputyId,
                    func_id: 0,
                  }))
                } else if (e.target.value === "main" && responsibilities.functions.length > 0) {
                  setFormData((prev) => ({
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
              placeholder="Опишите выполненную работу (опционально)"
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