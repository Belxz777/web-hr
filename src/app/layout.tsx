import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from 'next-themes';
export const metadata: Metadata = {
  title: "HR-эффективность",
  description: "Приложение для мониторинга и анализа рабочего времени",
  icons: {
    icon: "https://storage.yandexcloud.net/filesup/photo_5411229227967182152_m.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>

      <body   >
      <ThemeProvider>
      {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
