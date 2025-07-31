"use client"

import DepartmentActivityDashboard from "@/components/dashboard/history/department_history";
import EmployeeDetailDashboard from "@/components/dashboard/history/employee_detail";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"department" | "employee">("department")
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: number; name: string } | null>(null)
  const router = useRouter()
  const handleEmployeeClick = (employeeId: number, employeeName: string) => {
  router.push(`/analytics/history/employee/${employeeId}`)
  }

  const handleBackToDepartment = () => {
    setCurrentView("department")
    setSelectedEmployee(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
        <DepartmentActivityDashboard onEmployeeClick={handleEmployeeClick} />
    </main>
  )
}
