"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Symbol } from "@/components/ui/symbol";
import UniversalFooter from "@/components/buildIn/UniversalFooter";
import { resetPasswordFn } from "@/components/server/auth/passchange";
import { quickSearchUsers } from "@/components/server/useless/userdata";
import Image from "next/image";
import logo from '../../../public/logo_1_.svg'
interface User {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: number;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState({
    adminPassword: false,
    newPassword: false,
  });
  const [formData, setFormData] = useState({
    admin_password: "",
    new_password: "",
    user_id: 0,
  });
  const [error, setError] = useState<{ status: boolean; text: string }>({
    status: false,
    text: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [surnameInput, setSurnameInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = useCallback(async () => {
    if (surnameInput.length === 0) {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }
    try {
      const data = await quickSearchUsers(surnameInput);
      setFilteredUsers(data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Ошибка поиска пользователей:", err);
      setError({
        status: true,
        text: "Не удалось выполнить поиск пользователей. Попробуйте снова.",
      });
      setShowPopup(true);
      setTimeout(() => setIsPopupVisible(true), 50);
      setFilteredUsers([]);
      setShowDropdown(false);
    }
  }, [surnameInput]);

  const resetPassword = async (data: {
    admin_password: string;
    new_password: string;
    user_id: number;
  }) => {
    if (data.new_password.length < 12) {
      setError({ status: true, text: "Ваш пароль содержит меньше 12 символов" });
      alert("Ваш пароль содержит меньше 12 символов");
      return;
    }
    if (data.user_id === 0) {
      setError({ status: true, text: "Пожалуйста, выберите пользователя" });
      alert("Пожалуйста, выберите пользователя");
      return;
    }
    setLoading(true);
    setError({ status: false, text: "" });

    try {
      const res = await resetPasswordFn({
        ...data,
        user_id: Number(data.user_id),
      });

      if (!res) {
        setError({
          status: true,
          text: "Не удалось восстановить пароль. Попробуйте снова.",
        });
        setLoading(false);
      }
      alert("Пароль успешно изменен!");
      setFormData({ admin_password: "", new_password: "", user_id: 0 });
      setSurnameInput("");
      setFilteredUsers([]);
      setShowDropdown(false);
      router.push("/login");
    } catch (err: any) {
      console.error("Ошибка при восстановлении пароля:", err);
      setError({
        status: true,
        text:
          err.message || "Не удалось восстановить пароль. Попробуйте снова.",
      });
      setShowPopup(true);
      setTimeout(() => setIsPopupVisible(true), 50);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetPassword(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSurnameInput(e.target.value);
    setShowDropdown(false);
  };

  const handleUserSelect = (user: User) => {
    setFormData((prev) => ({ ...prev, user_id: user.employeeId }));
    setSurnameInput(`${user.lastName} ${user.firstName}`);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#249BA2] to-[#FF0000] flex flex-col items-center justify-center p-4">
      <main className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <header className="flex flex-col items-center mb-6">
               <Image src={logo} alt="Logo" className="w-16 h-16 select-none" />
          <h1 className="mt-4 text-3xl font-bold text-[#000000]">
            Восстановление пароля
          </h1>
          <p className="mt-2 text-center text-[#6D6D6D]">
            Попросите специальный пароль у администратора и введите новый пароль для восстановления
            доступа
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label
              htmlFor="surname"
              className="block text-sm font-medium text-[#6D6D6D] mb-1"
            >
              Введите свою фамилию
            </label>
            <div className="flex gap-2">
              <input
                id="surname"
                name="surname"
                type="text"
                required
                value={surnameInput}
                onChange={handleSurnameChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="Введите фамилию пользователя"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-3 bg-[#249BA2] text-white rounded-xl shadow-sm hover:bg-[#1e8287] focus:outline-none focus:ring-2 focus:ring-[#249BA2]"
              >
                Поиск
              </button>
            </div>
            {showDropdown && filteredUsers.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-auto shadow-lg">
                {filteredUsers.map((user) => (
                  <li
                    key={user.employeeId}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    {user.lastName} {user.firstName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="admin_password"
              className="block text-sm font-medium text-[#6D6D6D] mb-1"
            >
              Пароль администратора
            </label>
            <div className="relative">
              <input
                id="admin_password"
                name="admin_password"
                type={showPassword.adminPassword ? "text" : "password"}
                required
                value={formData.admin_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="Введите пароль администратора"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    adminPassword: !showPassword.adminPassword,
                  })
                }
                aria-label={
                  showPassword.adminPassword
                    ? "Скрыть пароль"
                    : "Показать пароль"
                }
              >
                {showPassword.adminPassword ? (
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
          </div>

          <div>
            <label
              htmlFor="new_password"
              className="block text-sm font-medium text-[#6D6D6D] mb-1"
            >
              Новый пароль
            </label>
            <div className="relative">
              <input
                id="new_password"
                name="new_password"
                type={showPassword.newPassword ? "text" : "password"}
                required
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#249BA2] focus:border-transparent"
                placeholder="Введите новый пароль"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    newPassword: !showPassword.newPassword,
                  })
                }
                aria-label={
                  showPassword.newPassword ? "Скрыть пароль" : "Показать пароль"
                }
              >
                {showPassword.newPassword ? (
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
          </div>

          <div className="bg-gray-50 rounded-xl p-4 select-none">
            <h3 className="text-sm font-medium text-[#000000] mb-2">
              Требования к паролю:
            </h3>
            <ul className="text-xs text-[#6D6D6D] space-y-1">
              <li className="flex items-center">
                <span className="mr-2">•</span>
                Минимум 12 символов
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
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
                  Восстановление...
                </>
              ) : (
                "Восстановить пароль"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 flex justify-between items-center text-sm">
          <button
            onClick={() => router.push("/login")}
            className="text-[#249BA2] hover:underline"
          >
            Обратно на страницу входа
          </button>
          <button
            onClick={() => router.push("/")}
            className="text-[#249BA2] hover:underline"
          >
            На главную
          </button>
        </div>
      </main>

      {showPopup && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out flex items-center justify-center z-50`}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl transform transition-all duration-300 ease-in-out max-w-md mx-4">
            <div className="flex items-center mb-4">
              <svg
                className="w-6 h-6 text-[#FF0000] mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h2 className="text-xl font-bold text-[#000000]">
                {error.status ? "Ошибка" : "Успех"}
              </h2>
            </div>
            <p className="text-[#6D6D6D] mb-6">
              {error.status
                ? error.text
                : "Пароль успешно изменен! Вы будете перенаправлены на страницу входа."}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full py-2 px-4 rounded-xl shadow-sm text-base font-medium text-white bg-[#FF0000] hover:bg-red-700 focus:outline-none"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <UniversalFooter />
    </div>
  );
}