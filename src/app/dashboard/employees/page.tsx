"use client";

import getEmployees from "@/components/server/admin/emps_get";
import { EmployeeSelectInput } from "@/components/ui/CustomSelectForChooseEmp";
import { Header } from "@/components/ui/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function EmployeeSelect() {
  const [emps, setEmp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchEmps() {
      try {
        setIsLoading(true);
        const emps = await getEmployees();
        if (emps) {
          setEmp(emps);
        }
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmps();
  }, []);

  return (
    <div className="mainProfileDiv min-h-screen bg-gray-900 text-gray-100">
      <Header title="Выбор сотрудника" showPanel={false} />
      <div className="flex flex-col items-center justify-center gap-6 p-8 flex-grow">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Выберите сотрудника</h2>
          <p className="mt-2 text-gray-400">
            Найдите сотрудника по имени или фамилии, чтобы просмотреть его
            профиль.
          </p>
        </div>


        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <svg
              className="animate-spin h-8 w-8 text-red-500"
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
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              ></path>
            </svg>
            <span className="text-gray-400">Загрузка сотрудников...</span>
          </div>
        ) : emps.length > 0 ? (
          <EmployeeSelectInput
            employees={emps}
            onSelect={(employeeId: number) =>
              router.push(`/dashboard/employees/${employeeId}/perDay`)
            }
          />
        ) : (
          <p className="text-gray-400">Сотрудники не найдены.</p>
        )}
      </div>
    </div>
  );
}
