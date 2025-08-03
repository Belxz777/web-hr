"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"

interface Responsibility {
  deputyId: number
  deputyName: string
}

interface FunctionItem {
  id: number
  name: string
  description: string
  is_main: boolean
}

interface ResponsibilitiesData {
  nonCompulsory: Responsibility[]
  functions: FunctionItem[]
}

interface CustomSelectProps {
  formData: {
    function_id: number
  }
  setFormData: (
    data: React.SetStateAction<{
      function_id: number
      hours_worked: number
      comment?: string
    }>,
  ) => void
  functions: Array<FunctionItem>
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ formData, setFormData, functions }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [current, setCurrentItem] = useState(0)

  // Фильтрация и сортировка функций
  const filteredAndSortedFunctions = useMemo(() => {
    return functions
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => a.name.localeCompare(b.name, "ru", { sensitivity: "base" }))
  }, [functions, searchTerm])

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getSelectedLabel = useCallback(() => {
    const selected = functions.find((item) => item.id === formData.function_id)
    return selected?.name || "Выберите обязанность"
  }, [formData, functions])

  // Обработчик выбора элемента
  const handleSelect = useCallback(
    (id: number) => {
      setFormData((prev) => ({ ...prev, function_id: id }))
      setIsOpen(false)
      setCurrentItem(id)
      setSearchTerm("")
    },
    [setFormData],
  )

  const selectedLabel = getSelectedLabel()

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full px-4 py-2.5 border border-gray-700 text-left
          focus:outline-none focus:ring-2 focus:ring-secondary bg-white transition-colors duration-200
          flex justify-between items-center rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <label>{selectedLabel}</label>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-10 w-full mt-1 bg-secondary border-gray-600 shadow-lg
            max-h-80 overflow-y-auto rounded-xl"
          role="listbox"
        >
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-500
                focus:outline-none focus:ring-2 focus:ring-secondary rounded-xl"
              aria-label="Search options"
            />
          </div>

          <div className="p-2 rounded-b-xl">
            {filteredAndSortedFunctions.length === 0 ? (
              <div className="px-3 py-2 text-gray-400 rounded-xl">
                {searchTerm ? "Ничего не найдено" : "Обязанностей не найдено"}
              </div>
            ) : (
              filteredAndSortedFunctions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-gray-100 transition-colors duration-150 rounded-xl
                    hover:bg-gray-600/50 focus:bg-gray-600/70 ${
                      formData.function_id === item.id ? "bg-gray-600/30" : ""
                    }`}
                  onClick={() => handleSelect(item.id)}
                  role="option"
                  aria-selected={formData.function_id === item.id}
                >
                  <div className="font-medium">{item.name}</div>
              
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
