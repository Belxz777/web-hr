"use client"

import type React from "react"

interface CustomSelectProps {
  type: string
  formData: {
    func_id: number
    deputy_id: number
    workingHours: string
    comment: string
  }
  setFormData: React.Dispatch<
    React.SetStateAction<{
      func_id: number
      deputy_id: number
      workingHours: string
      comment: string
    }>
  >
  responsibilities: {
    length: any
    nonCompulsory: {
      deputyId: number
      deputyName: string
    }[]
    functions: {
      funcId: number
      funcName: string
    }[]
  }
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ type, formData, setFormData, responsibilities }) => {
  if (type === "main") {
    return (
      <select
        id="func_id"
        name="func_id"
        value={formData.func_id}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            func_id: Number(e.target.value),
          }))
        }}
        className="w-full px-3 py-2 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        required
      >
        <option value="">Выберите обязанность</option>
        {responsibilities.functions.map((func) => (
          <option key={func.funcId} value={func.funcId}>
            {func.funcName}
          </option>
        ))}
      </select>
    )
  } else {
    return (
      <select
        id="deputy_id"
        name="deputy_id"
        value={formData.deputy_id}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            deputy_id: Number(e.target.value),
          }))
        }}
        className="w-full px-3 py-2 bg-background border border-input rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        required
      >
        <option value="">Выберите обязанность</option>
        {responsibilities.nonCompulsory.map((deputy) => (
          <option key={deputy.deputyId} value={deputy.deputyId}>
            {deputy.deputyName}
          </option>
        ))}
      </select>
    )
  }
}
