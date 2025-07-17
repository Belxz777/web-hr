"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";


const supportContacts = [
  { name: "Связаться с разработчиком", email: "https://t.me/belxz999" },
  { name: "Связаться с тех поддержкой ", email: "" },
];

export default function SettingsPage() {
  const news = [
    {
      title: "Тестовый запуск приложения",
      description:
        "Мы запустили приложение в тестовом режиме. ",
      date: "2025-07-25",
    }
  ]
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-secondary to-primary`}
    >
      <Header title="Настройки" showPanel={false} />

      <main className="container mx-auto p-4">
        <section
          className={`mb-8  bg-card rounded-xl p-6`}
        >
          <h2 className="text-2xl font-bold mb-4  text-left">
           Настройки
          </h2>
      
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Версия приложения</h3>
                  <p className="text-gray-600 text-xl">v1.0.0</p>
                </div>
      
        
         <section>
          <h2 className="text-2xl font-bold mb-4">Поддержка</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportContacts.map((contact, index) => (
              <div key={index} className="bg-secondary-foreground rounded-lg p-4">
                <h3 className="text-lg font-semibold">{contact.name}</h3>
                <p className=" text-secondary font-extrabold text-2xl">{contact.email}</p>
              </div>
            ))}
            </div>
        </section>
          <button
            onClick={() => {
                window.location.href = "/docs";
              }}
              className="px-6 py-3 bg-foreground text-primary-foreground rounded-xl hover:bg-foreground/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg active:scale-95"
            >
              Техническая документация
            </button>
        </section>

      </main>
    </div>
  );
}
