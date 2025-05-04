"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PulseLogo } from "@/svgs/Logo";
import useEmployeeData from "@/hooks/useGetUserData";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { useRouter } from "next/navigation";
import createTaskData from "@/components/server/create";
import { Header } from "@/components/ui/header";
export default function CreateTaskPage() {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDuration, setTaskDuration] = useState(30);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { employeeData } = useEmployeeData();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employeeData) {
      throw new Error("Недоступны данные пользователя");
    }

    const data = {
      forEmployeeId: employeeData.user.employeeId,
      hourstodo: Number((taskDuration / 60).toFixed(1)),
      taskName: taskName,
      taskDescription: taskDescription,
    };

    try {
      const resultData = await createTaskData(data);
      if (!resultData) {
        alert("Произошла ошибка при создании задачи");
      }

      alert("Задача успешно создана!");
      router.push("/profile");
      setTaskName("");
      setTaskDescription("");
      setTaskDuration(10);
    } catch (err) {
      console.log(err);
    }
  };

  const autoFill = () => {
    const tasks = [
      "Написать отчет",
      "Подготовить презентацию",
      "Провести встречу с клиентом",
    ];
    const descriptions = [
      "Подготовить подробный отчет о проделанной работе",
      "Создать презентацию для нового проекта",
      "Обсудить требования и ожидания с клиентом",
    ];
    const randomIndex = Math.floor(Math.random() * tasks.length);
    setTaskName(tasks[randomIndex]);
    setTaskDescription(descriptions[randomIndex]);
    setTaskDuration(Math.floor(Math.random() * 144 + 3) * 10);
  };


  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  return (
    <div className="mainProfileDiv">
      <Header  title="Создание новой задачи" showPanel={false} />
      <main className="container mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="formStyles"
        >
          <div>
            <label htmlFor="taskName" className="block mb-1">
              Название задачи
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="emailInputStyles"
              required
            />
          </div>
          <div>
            <label htmlFor="taskDescription" className="block mb-1">
              Описание задачи
            </label>
            <textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="emailInputStyles"
              rows={4}
              required
            />
          </div>
          <div className="flex flex-col w-full justify-center gap-4">
            <label className="block mb-1">Время выполнения</label>
            <div className="flex flex-col items-center">
              <input
                type="range"
                min="30"
                max="1440"
                step="5"
                value={taskDuration}
                onChange={(e) => setTaskDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer my-2"
              />
              <div className="mt-2 text-xl font-bold  select-none">
                {formatTime(taskDuration)}
              </div>
            </div>

            <div className="flex flex-col ">
              <label className="block mb-1 items-start">Ввод в ручную (минуты)</label>
              <input
                type="number"
                value={taskDuration}
                min={30}
                onChange={(e) => setTaskDuration(Number(e.target.value))}
                className="emailInputStyles"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="createButton"
            >
              Создать задачу
            </button>
            <button
              type="button"
              onClick={autoFill}
              className="autofillButton"
            >
              Автозаполнение
            </button>
          </div>
        </form>
        <UniversalFooter />
      </main>
    </div>
  );
}
