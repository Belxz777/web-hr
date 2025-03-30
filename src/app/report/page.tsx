"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import sendReport from "@/components/server/report";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import responsibilities from "./data.json";

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskId: 4,
    workingHours: 0.5,
    comment: "",
  });
  console.log(formData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "taskId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitting report:", formData);

    if (responsibilities?.length === 0) {
      console.log("No tasks available for report");
      alert("Нет доступных задач для отчета");
      return;
    }

    if (
      formData?.workingHours === undefined ||
      Number(formData.workingHours) <= 0
    ) {
      console.log("Invalid working hours:", formData.workingHours);
      alert("Укажите корректное количество часов");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending report data:", {
        ...formData,
        taskId: formData.taskId,
        workingHours: Number(formData.workingHours),
      });

      const req = await sendReport({
        ...formData,
        taskId: formData.taskId,
        workingHours: Number(formData.workingHours),
      });

      if (req) {
        console.log("Report submitted successfully");
        alert("Успешно");
        router.push("/profile");
      } else {
        console.log("Failed to submit report:", req);
        alert("Ошибка");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Ошибка при отправке отчета");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours % 1) * 60);
    return `${wholeHours} ч ${minutes} мин`;
  };

  return (
    <div className="mainProfileDiv">
      <Header title="Заполнение отчета" showPanel={false} />
      <main className="container mx-auto p-4 flex-grow">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mt-6 bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h1 className="text-center text-gray-300 text-2xl font-bold mb-6">
            Заполнение отчета
          </h1>

          <div className="mb-4">
            <label htmlFor="taskId" className="block text-gray-300 mb-2">
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
              {responsibilities.map((task) => (
                <option key={task.id} value={task.id} className={`${task.type === 1 ? "bg-red-600" : "bg-gray-600"}`}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="workingHours" className="block text-gray-300 mb-2">
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
              step="0.1"
            />
            <div className="text-gray-300 mt-2">
              {formData.workingHours > 0 && formatTime(formData.workingHours)}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-300 mb-2">
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Отправка..." : "Отправить отчет"}
          </button>
        </form>
      </main>
      <UniversalFooter />
    </div>
  );
}
