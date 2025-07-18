"use client"

interface EmployeeInfo {
  employee_surname?: string
  employee_name?: string
  employee_patronymic?: string
  job_title?: string
  employee_id?: string | number
}

interface EmployeeHeaderProps {
  employee: EmployeeInfo
}

export const EmployeeHeader = ({ employee }: EmployeeHeaderProps) => {
  const fullName = [employee.employee_surname || "", employee.employee_name || "", employee.employee_patronymic || ""]
    .filter(Boolean)
    .join(" ")

  return (
    <div className=" bg-card/95 text-basic font-medium text-lg p-6 rounded-t-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold  mb-1">{fullName || "Неизвестный сотрудник"}</h1>
          <p className=" mb-1">Должность: {employee.job_title || "Не указана"}</p>
          <p className="">ID: {employee.employee_id || "Не указан"}</p>
        </div>
      </div>
    </div>
  )
}
