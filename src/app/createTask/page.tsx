"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PulseLogo } from "@/svgs/Logo";
import useEmployeeData from "@/hooks/useGetUserData";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { useRouter } from "next/navigation";
import createTaskData from "@/components/server/create";
export default function CreateTaskPage() {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDuration, setTaskDuration] = useState(10);
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
    const data = {
      forEmployeeId: 2,
      hourstodo: 2,
      taskName: taskName,
    }

    try {
      const resultData = await createTaskData(data);
      if (!resultData) {
        alert("err")
      }


      alert("Задача успешно создана!");
      router.push("/profile");
      setTaskName("");
      setTaskDescription("");
      setTaskDuration(10);
    }
    catch (err) {

    } finally {
      console.log("dece");

    }
  }



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
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className=" inline-flex items-center ">
          <Link href="/profile" prefetch={false}>
            <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
          </Link>
          <h1 className="text-2xl  pl-4 font-bold">Создание новой задачи</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Открыть меню</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1">
              {employeeData?.position !== 1 ? (
                <>
                  {employeeData?.position !== 5 && (
                    <li>
                      <Link
                        href="/report"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9" />
                          <path d="M15.5 4l4.5 4.5-1.5 1.5-4.5-4.5z" />
                          <path d="M2 22l2-2 4-4-4-4-2 2z" />
                        </svg>
                        Заполнение отчета
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/department/report/download"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Скачивание подробного отчета
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Настройки
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">
                      <span className="mr-3">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/report"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
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
                      >
                        <path d="M12 20h9" />
                        <path d="M15.5 4l4.5 4.5-1.5 1.5-4.5-4.5z" />
                        <path d="M2 22l2-2 4-4-4-4-2 2z" />
                      </svg>
                      Заполнение отчета
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Настройки
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">
                      <span className="mr-3">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto my-6 flex flex-col gap-4"
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
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
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
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Время выполнения</label>
            <div className="flex flex-col items-center">
              <input
                type="range"
                min="10"
                max="1440"
                step="10"
                value={taskDuration}
                onChange={(e) => setTaskDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer my-2"
              />
              <div className="mt-2 text-xl font-bold">
                {formatTime(taskDuration)}
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 rounded-xl hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Создать задачу
            </button>
            <button
              type="button"
              onClick={autoFill}
              className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
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
