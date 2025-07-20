import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import logo from '../../public/logo_1_.svg'
import { ThemeProvider } from 'next-themes';
export const metadata: Metadata = {
  title: "HR-эффективность",
  description: "Приложение для мониторинга и анализа рабочего времени",
  icons: {
    icon: logo.src,
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
