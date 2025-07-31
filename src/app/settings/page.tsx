"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";


const supportContacts = [
  { name: "Связаться с разработчиком", email: "https://t.me/belxz999" },
  { name: "Связаться с тех поддержкой ", email: "" },
];

export default function SettingsPage() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-secondary to-primary`}
    >
      <Header title="Настройки" showPanel={false} />

      <main className="container mx-auto p-4">
        <section
          className={`mb-8  bg-card rounded-xl p-6`}
        >
          <h1 className="text-4xl font-bold mb-4  text-left">
           Настройки
          </h1>
      
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2">Версия приложения</h3>
                  <p className="text-gray-600 text-xl">v1.0.0</p>
                </div>
      
      
          <button
            onClick={() => {
                window.location.href = "/docs";
              }}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 font-bold shadow-md hover:shadow-lg active:scale-95"
>
              Документация
            </button>
        </section>

      </main>
    </div>
  );
}
