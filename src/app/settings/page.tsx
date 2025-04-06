"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import useEmployeeData from "@/hooks/useGetUserData";
import allTfByDepartment from "@/components/server/allTfByDepartment";
import { TFData } from "@/types";

// Пример данных контактов поддержки
const supportContacts = [
  { name: "Техническая поддержка", email: "romanbelyh436@gmail.com (ПОЧТА)" },
  { name: "Сообщить об ошибке", email: "@belxz999 (TELEGRAM)" },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [showAllResponsibilities, setShowAllResponsibilities] = useState(false);
  const [responsibilities, setResponsibilities] = useState([]);
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

  const initialDisplayCount = 3;
  const displayedData = showAllResponsibilities
    ? responsibilities
    : responsibilities.slice(0, initialDisplayCount);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-red-600 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-red-100 to-gray-100 text-gray-900"
      }`}
    >
      <Header title="Настройки" showPanel={false} />

      <main className="container mx-auto p-4">
        <section
          className={`mb-8 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-xl p-6`}
        >
          <div className="flex justify-between flex-col items-center mb-4">
            <h2 className="text-2xl font-bold">Функциональные обязанности</h2>
            {responsibilities.length === 0 ? (
              <h2 className="text-xl font-bold text-gray-400 my-5">
                Нет Функциональных обязанностей
              </h2>
            ) : (
              <div>
                {responsibilities.length > initialDisplayCount && (
                  <button
                    onClick={() =>
                      setShowAllResponsibilities(!showAllResponsibilities)
                    }
                    className={`text-sm px-3 py-1 rounded ${
                      theme === "dark"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-red-100 hover:bg-red-200 text-red-800"
                    }`}
                  >
                    {showAllResponsibilities
                      ? "Скрыть"
                      : `Показать все (${responsibilities.length})`}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {displayedData.map((item: TFData) => (
              <div
                key={item.tfId}
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg p-3`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base">{item.tfName}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        item.isMain === false
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      Тип {item.isMain ? "Основная" : "Дополнительная"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAllResponsibilities &&
            responsibilities.length > initialDisplayCount && (
              <div className="mt-2 text-center">
                <button
                  onClick={() => setShowAllResponsibilities(true)}
                  className={`text-sm ${
                    theme === "dark"
                      ? "text-red-400 hover:text-red-300"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  Показать еще {responsibilities.length - initialDisplayCount}{" "}
                  обязанностей...
                </button>
              </div>
            )}
        </section>

        <section
          className={`mb-8 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-xl p-6`}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Контакты поддержки
          </h2>
          <ul className="space-y-2">
            {supportContacts.map((contact, index) => (
              <li
                key={index}
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg p-3`}
              >
                <h3 className="font-medium">{contact.name}</h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Писать: {contact.email}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
