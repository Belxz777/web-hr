"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import sendReport from "@/components/server/report";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { Header } from "@/components/ui/header";
import allTfByDepartment from "@/components/server/allTfByDepartment";
import { TFData } from "@/types";

export default function ReportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tf_id: "",
    workingHours: "0.50",
    comment: "",
  });
  const [responsibilities, setResponsibilities] = useState<TFData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await allTfByDepartment("employee");
        setResponsibilities(data || []);
      } catch (error) {
        console.error("Failed to fetch responsibilities:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "workingHours"
          ? Number(value).toFixed(2)
          : name === "tf_id"
          ? value
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!responsibilities.length) {
      console.log("No tasks available for report");
      alert("Нет доступных задач для отчета");
      return;
    }

    if (!formData.tf_id) {
      console.log("No task selected");
      alert("Выберите задачу");
      return;
    }

    if (Number(formData.workingHours) <= 0) {
      console.log("Invalid working hours:", formData.workingHours);
      alert("Укажите корректное количество часов");
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        tf_id: Number(formData.tf_id),
        workingHours: Number(formData.workingHours),
        comment: formData.comment,
      };

      const req = await sendReport(reportData);

      if (req) {
        alert("Успешно");
        router.push("/profile");
      } else {
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
            <label htmlFor="tf_id" className="block text-gray-300 mb-2">
              Выберите обязанность
            </label>
            <select
              id="tf_id"
              name="tf_id"
              value={formData.tf_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="" className="text-gray-400">
                -- Выберите обязанность --
              </option>
              {responsibilities.map((task: TFData) => (
                <option key={task.tfId} value={task.tfId} className={`${task.isMain ? "text-red-400" : ""}`}>
                  {task.tfName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="workingHours" className="block text-gray-300 mb-2">
              Количество выполненных часов
            </label>
            <input
              type="number"
              id="workingHours"
              name="workingHours"
              value={Number(formData.workingHours)}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
              min="0.1"
              step="0.1"
            />
            <div className="text-gray-300 mt-2">
              {Number(formData.workingHours) > 0 &&
                formatTime(Number(formData.workingHours))}
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
              placeholder="Опишите выполненную работу (опционально)"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !responsibilities.length}
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
