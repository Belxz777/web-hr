"use client";

import { Header } from "@/components/ui/header";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { useRouter } from "next/navigation";

export default function DepartmentDataDisplay() {
  const router = useRouter();

  return (
    <div className="mainProfileDiv">
      <Header title="Аналитика отдела" showPanel={false} />

      <div className="flex flex-col items-center justify-center gap-6 p-8 flex-grow">
        <h1 className="text-2xl font-bold mb-8">Выберите раздел аналитики</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button
            onClick={() => router.push("/dashboard/department/")}
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-12 px-6 rounded-xl shadow-lg transition-all 
                      transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-400 text-xl"
          >
            Статистика по отделу
          </button>

          <button
            onClick={() => router.push("/dashboard/employees")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-12 px-6 rounded-xl shadow-lg transition-all 
                      transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 text-xl"
          >
            Статистика сотрудников
          </button>
        </div>
      </div>

      <UniversalFooter />
    </div>
  );
}
