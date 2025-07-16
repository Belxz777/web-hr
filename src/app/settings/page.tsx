"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";


const supportContacts = [
  { name: "Связаться с разработчиком", email: "https://t.me/belxz999" },
  { name: "Связаться с тех поддержкой ", email: "30112" },
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
                  <h3 className="text-xl font-semibold mb-2">Версия приложения</h3>
                  <p className="text-gray-600">v1.0.0</p>
                </div>
      
                <div>
                  <h3 className="text-xl font-semibold mb-3">Важные новости</h3>
                {news.map((item, index) => (
                      <div key={index} className="  bg-secondary-foreground rounded-lg p-4">
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-gray-600 text-sm">{item.date}</p>
                      </div>
                    ))}
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
        </section>
     
      </main>
    </div>
  );
}
