"use client"

import EmployeeDetailDashboard from "@/components/dashboard/history/employee_detail";
import { useParams, useSearchParams } from "next/navigation";

export default function EmployeeHistory() {

  const params = useParams()
  const searchParams = useSearchParams()
  const empId = typeof params.id === "string" ? params.id : params.id[0]
    return (
         <EmployeeDetailDashboard employeeId={Number(empId)}  />
    )
}