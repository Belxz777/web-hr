"use client";
import React, {  useState } from "react";

import Link from "next/link";
import registerUser from "@/components/server/auth/register";
import { useRouter } from "next/navigation";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetAlldeps from "@/hooks/useDeps";
import logo from "../../../public/logo_1_.svg";
import Image from "next/image";
type error =  {
  error:string
}
export default function RegisterPage() {
  const router = useRouter();
  const { jobs, loading } = useGetAllJobs();
  const { deps } = useGetAlldeps();
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

    if (formData.password.length < 12) {
      setError("Пароль должен содержать минимум 12 символов, буквы и цифры");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      router.push("/profile");
      setSent(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError(`Произошла ошибка при регистрации (возможно логин уже занят) если ошибка не пропадает обратитесь в поддержку`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#249BA2] to-[#FF0000] flex flex-col items-center justify-center p-4">
      <main className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full">
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center gap-4">
         <Image src={logo} alt="Logo" className="w-16 h-16 select-none" />
          <h1 className="text-3xl font-bold text-[#000000]">Регистрация</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Логин
              </label>
              <input
                id="login"
                name="login"
                type="text"
                required
                value={formData.login}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Пароль (минимальная длина: 12 символов)
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5 text-gray-500 hover:text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-500 hover:text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Имя
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Фамилия
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="patronymic" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Отчество
              </label>
              <input
                id="patronymic"
                name="patronymic"
                type="text"
                value={formData.patronymic}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="jobid" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Должность
              </label>
              <select
                id="jobid"
                name="jobid"
                required
                value={formData.jobid === 0 ? "" : formData.jobid}
                onChange={handleChange}
                className="w-full px-4 py-3 cursor-pointer bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent appearance-none"
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
              <label htmlFor="departmentid" className="block text-sm font-medium text-[#6D6D6D] mb-1">
                Отдел
              </label>
              <select
                id="departmentid"
                name="departmentid"
                required
                value={formData.departmentid === 0 ? "" : formData.departmentid}
                onChange={handleChange}
                className="w-full px-4 py-3 cursor-pointer bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent appearance-none"
              >
                <option value="">Выберите отдел</option>
                {deps.map((dept, index) => (
                  <option key={index} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-[#FF0000] text-sm">{error}</p>}

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || sended}
              className="w-full py-3 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
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
                "Регистрация"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-[#6D6D6D]">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#249BA2] hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
