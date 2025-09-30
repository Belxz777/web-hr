import type React from "react"
import type { Metadata } from "next"


import "./globals.css"
import ToastComponent from "@/components/toast/toast"

import { Suspense } from "react"
import BackendStatusChecker from "@/components/analytics/status-checker"
import logo from '../../public/logo_1_.svg'


export const metadata: Metadata = {
  title: "HR-эффективность",
  description: "Приложение для мониторинга и анализа рабочего времени",
   icons: {
    icon: logo.src,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body >
        <Suspense fallback={null}>
          {children}
          <ToastComponent />
          <BackendStatusChecker />
        </Suspense>

      </body>
    </html>
  )
}
