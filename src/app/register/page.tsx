"use client";
import React, { useEffect, useState } from "react";
import { PulseLogo } from "@/svgs/Logo";
import Link from "next/link";
import registerUser from "@/components/server/auth/register";
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
const [sended, setSent] = useState(false);
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
const [showPassword, setShowPassword] = useState(false);
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

    if (formData.jobid === 0 || formData.departmentid === 0) {
      setError("Пожалуйста, выберите должность и отдел");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log("Success:", response);
      router.push("/profile");
      setSent(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError(
         "Произошла ошибка при регистрации"
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
                  className="labelStyles"
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
                  className="emailInputStyles"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="labelStyles"
                >
                  Пароль
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="emailInputStyles"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center bg-red-600 hover:bg-red-700 text-white rounded-r-xl"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="#fff"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                        />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="firstName"
                  className="labelStyles"
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
                  className="emailInputStyles"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="labelStyles"
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
                  className="emailInputStyles"
                />
              </div>
              <div>
                <label
                  htmlFor="patronymic"
                  className="labelStyles"
                >
                  Отчество
                </label>
                <input
                  id="patronymic"
                  name="patronymic"
                  type="text"
                  value={formData.patronymic}
                  onChange={handleChange}
                  className="emailInputStyles"
                />
              </div>
              <div>
                <label
                  htmlFor="jobid"
                  className="labelStyles"
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
                  className="labelStyles"
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
                disabled={isLoading || sended}
                className="submitButtonStyles"
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
      <footer className="footerAuthStyles">
        <p>
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="linkStyles"
          >
            Войти
          </Link>
        </p>
      </footer>
    </div>
  );
}
