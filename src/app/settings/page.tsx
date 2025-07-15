"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";


const supportContacts = [
  { name: "Техническая поддержка", email: "@belxz999 (TELEGRAM)" },
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
          <h2 className="text-2xl font-bold mb-4 text-center">
            Контакты поддержки
          </h2>
          <ul className="space-y-2">
            {supportContacts.map((contact, index) => (
              <li
                key={index}
                className={` rounded-lg p-3`}
              >
                <h3 className="font-medium">{contact.name}</h3>
                <p
                  className={`text-sm `}
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
