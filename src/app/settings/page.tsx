"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import data from "../report/data.json";

// Пример данных контактов поддержки
const supportContacts = [
  { name: "Техническая поддержка", email: "romanbelyh436@gmail.com (ПОЧТА)" },
  { name: "Сообщить об ошибке", email: "@belxz999 (TELEGRAM)" },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [showAllResponsibilities, setShowAllResponsibilities] = useState(false);

  const initialDisplayCount = 3;
  const displayedData = showAllResponsibilities
    ? data
    : data.slice(0, initialDisplayCount);

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Функциональные обязанности</h2>
            {data.length > initialDisplayCount && (
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
                  : `Показать все (${data.length})`}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedData.map((item) => (
              <div
                key={item.id}
                className={`${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg p-3`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base">{item.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        item.type === 1
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      Тип {item.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.average_execution_time} мин
                    </span>
                  </div>
                </div>
                <p
                  className={`mt-1 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.description.length > 100
                    ? `${item.description.substring(0, 100)}...`
                    : item.description}
                </p>
              </div>
            ))}
          </div>

          {!showAllResponsibilities && data.length > initialDisplayCount && (
            <div className="mt-2 text-center">
              <button
                onClick={() => setShowAllResponsibilities(true)}
                className={`text-sm ${
                  theme === "dark"
                    ? "text-red-400 hover:text-red-300"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                Показать еще {data.length - initialDisplayCount} обязанностей...
              </button>
            </div>
          )}
        </section>

        <section
          className={`mb-8 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } rounded-xl p-6`}
        >
          <h2 className="text-2xl font-bold mb-4">Контакты поддержки</h2>
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
