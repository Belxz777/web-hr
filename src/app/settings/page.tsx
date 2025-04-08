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
