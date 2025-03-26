import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from 'next-themes';
export const metadata: Metadata = {
  title: "Рабочий Пульс",
  description: "Эффективный менеджер трудозатрат",
  icons: {
    icon: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>

      <head><link rel="icon" href='/logo.png' sizes="any" />
      </head>
      <body   >
      <ThemeProvider>
      {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
