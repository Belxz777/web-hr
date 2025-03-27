"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PulseLogo } from "@/svgs/Logo";
import { useTasks } from "@/hooks/useTasks";
import { report, task } from "@/types";
import { useReport } from "@/hooks/useReport";
import sendReport from "@/components/server/report";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { BackButton } from "@/svgs/Back";
import { Header } from "@/components/ui/header";
export default function ReportPage() {
  interface Responsibility {
    name: string;
    description: string;
    type: number; // 1 for auxiliary, 2 for main
    averageCompletionTime: number; // in hours.minutes format
  }
  
  const responsibilities: Responsibility[] = [
    {
      name: "Development of regulatory documentation",
      description: "Development of standards, regulations, instructions related to the organization of personnel assessment, training and development, mentoring, and career planning for employees.",
      type: 2,
      averageCompletionTime: 35.45
    },
    {
      name: "Formation of training and development plans",
      description: "Formation of personnel training and development plans for a month, quarter, year. Updating them if necessary by order of the HR director.",
      type: 2,
      averageCompletionTime: 20.30
    },
    {
      name: "Organization of professional training",
      description: "Organization of professional training of personnel according to approved plans for personnel training and advanced training.",
      type: 2,
      averageCompletionTime: 45.15
    },
    {
      name: "Formation of personnel assessment plans",
      description: "Formation of personnel assessment plans in accordance with the company's goals. Determination of resources, means and methods for conducting personnel assessment.",
      type: 2,
      averageCompletionTime: 18.20
    },
    {
      name: "Organization of personnel assessment procedure",
      description: "Organization of personnel assessment procedure in accordance with approved plans. Analysis of personnel assessment results, preparation of recommendations for management and personnel. Providing feedback on the assessment results to personnel and management.",
      type: 2,
      averageCompletionTime: 30.50
    },
    {
      name: "Analysis of employee knowledge and skills",
      description: "Analysis of information about employees' existing knowledge and skills, providing management with reports prepared in forms agreed with the manager.",
      type: 1,
      averageCompletionTime: 12.40
    },
    {
      name: "Management of educational programs development",
      description: "Management of the development of the company's educational programs.",
      type: 2,
      averageCompletionTime: 25.10
    },
    {
      name: "Organization of department participation",
      description: "Organization of enterprise departments' participation in the preparation of training materials, development of the Department's material and technical base, and the training process itself.",
      type: 1,
      averageCompletionTime: 15.25
    },
    {
      name: "Preparation of presentations",
      description: "Preparation of presentations on topics related to training and development.",
      type: 1,
      averageCompletionTime: 8.45
    },
    {
      name: "Development of individual development plans",
      description: "Development of individual development plans for employees based on assessment results.",
      type: 2,
      averageCompletionTime: 22.35
    }
  ];
  const { tasks, loadingRep } = useReport();
  const router = useRouter();
const [datas, setdata] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<report>({
    taskId: tasks[0]?.taskId,
    workingHours: 0.5,
    comment: "",
  });
  
  useEffect(() => {
    if (tasks.length > 0) {
      setFormData((prev) => ({ ...prev, taskId: tasks[0].taskId }));
    }

  }, [tasks]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tasks.length === 0) {
      alert("Нет доступных задач для отчета");
      return;
    }
    
    if (Number(formData.workingHours) > tasks.find((el: task) => el.taskId === Number(formData.taskId))?.hourstodo) {
      alert("Неверное количество отработанных часов");
      setFormData((prev) => ({ ...prev, workingHours: 0.5 }));
      return;
    }

    setLoading(true);
    const req = await sendReport({...formData, workingHours: Number(formData.workingHours)});
    setLoading(false);

    if (req) {
      alert("Успешно");
      router.push("/profile");
    } else {
      alert("Ошибка");
    }
  };

  return (
    <div className="mainProfileDiv">
      <Header  title="Заполнение отчета" showPanel={false} />
      <main className="container mx-auto p-4">
        {tasks.length > 0 ? (
          <form
            onSubmit={handleSubmit}
            className="taskSectionStyles max-w-2xl mx-auto"
          >
            <h1 className="text-center text-gray-300 text-2xl font-bold">
              Заполнение отчета
            </h1>
            <div className="mb-4">
              <label
                htmlFor="taskId"
                className="labelStyles mb-2"
              >
                Выберите функциональную обязанность
              </label>
              <select
                id="taskId"
                name="taskId"
                value={formData.taskId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                {loadingRep ? (
                  <option value="">Загрузка...</option>
                ) : (
                  // tasks.map((task: task) => (
                  //   <option key={task.taskId} value={task.taskId}>
                  //     {task.taskName}
                  //   </option>
                  responsibilities.map((typical:any,index:number)=>(
     <option key={index} value={index} className={` text-white ${typical.type==1 ? "bg-red-400" : "bg-green-700"}`}>
                      {typical.name}
                    </option>
                  ))

                )}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="workingHours"
                className="labelStyles mb-2"
              >
                Количество рабочих часов
              </label>
              <input
                type="number"
                id="workingHours"
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                min="0.1"
                step="0.10"
              />
              <div className="text-gray-300 mt-2">
    {formData.workingHours > 0 && (
      <p>
        {Math.floor(formData.workingHours)} ч {Math.round((formData.workingHours % 1) * 60)} мин
      </p>
    )}
  </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="comment"
                className="labelStyles mb-2"
              >
                Комментарий
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-2 px-4 focus:outline-none focus:shadow-outline flex justify-center border border-transparent rounded-xl shadow-sm text-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Отправка..." : "Отправить отчет"}
            </button>
          </form>
        ) : loadingRep ? (
          <div className="flex flex-col items-center justify-center taskSectionStyles max-w-2xl mx-auto mt-4">
            <div className="w-full h-96 flex items-center justify-center">
              <svg
                className="animate-spin h-10 w-10 text-white"
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
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center taskSectionStyles max-w-2xl mx-auto mt-4 min-h-[300px] cursor-pointer">
            <h1 className="text-2xl font-bold text-gray-300 mt-4">
              Задач для отчета нет
            </h1>
            <button
              className="flex flex-row text-xl font-bold text-gray-300 mt-4 text-center"
              onClick={() => router.back()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform transform hover:-translate-x-1 mt-1"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Назад
            </button>
          </div>
        )}
      </main>
      <UniversalFooter />
    </div>
  );
}
