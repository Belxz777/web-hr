"use client";
import React, { useEffect, useState } from "react";
import { PulseLogo } from "@/svgs/Logo";
import Link from "next/link";
import registerUser from "@/components/server/register";
import { useRouter } from "next/navigation";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetAlldeps from "@/hooks/useDeps";

// const jobs = [
//   { id: 1, title: "Разработчик" },
//   { id: 2, title: "Дизайнер" },
//   { id: 3, title: "Менеджер" },
// ];

// const departments = [
//   { id: 1, name: "IT отдел" },
//   { id: 2, name: "Отдел дизайна" },
//   { id: 3, name: "Отдел продаж" },
// ];

export default function RegisterPage() {
  const router = useRouter();
  const { jobs, loading } = useGetAllJobs();
  
  const {deps}= useGetAlldeps()

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    firstName: "",
    lastName: "",
    patronymic: "",
    jobid: 0,
    departmentid: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "jobid" || name === "departmentid"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    console.log("Submitting:", formData);

    if (formData.jobid === 0 || formData.departmentid === 0) {
      setError("Пожалуйста, выберите должность и отдел");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Success:", response);
      router.push("/profile");
    } catch (err) {
      console.error("Submit error:", err);
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при регистрации"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 flex flex-col justify-center p-4">
      <main className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <header className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <PulseLogo className={`w-16 h-16 ${loading ? 'animate-[pulse_2s_ease-in-out_infinite] text-red-800' : 'text-red-600'}`} />
            <h1 className="mt-4 mr-6 text-3xl font-bold text-gray-100">
              Регистрация
            </h1>
          </header>
          <form onSubmit={handleSubmit} className="w-full md:w-3/4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="login"
                  className="block text-sm font-medium text-gray-300"
                >
                  Логин
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Имя
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Фамилия
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="patronymic"
                  className="block text-sm font-medium text-gray-300"
                >
                  Отчество
                </label>
                <input
                  id="patronymic"
                  name="patronymic"
                  type="text"
                  value={formData.patronymic}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="jobid"
                  className="block text-sm font-medium text-gray-300"
                >
                  Должность
                </label>
                <select
                  id="jobid"
                  name="jobid"
                  required
                  value={formData.jobid === 0 ? "" : formData.jobid}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Выберите должность</option>
                  {jobs.map((job, index) => (
                    <option key={index} value={job.jobId}>
                      {job.jobName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="departmentid"
                  className="block text-sm font-medium text-gray-300"
                >
                  Отдел
                </label>
                <select
                  id="departmentid"
                  name="departmentid"
                  required
                  value={
                    formData.departmentid === 0 ? "" : formData.departmentid
                  }
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Выберите отдел</option>
                  {deps.map((dept,index) => (
                    <option key={index} value={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Регистрация...
                  </>
                ) : (
                  "Зарегистрироваться"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer className="mt-8 text-center text-gray-400">
        <p>
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-red-400 hover:text-red-300"
          >
            Войти
          </Link>
        </p>
      </footer>
    </div>
  );
}
