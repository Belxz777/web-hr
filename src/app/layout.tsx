import type React from "react"
import type { Metadata } from "next"


import "./globals.css"
import ToastComponent from "@/components/toast/toast"

import { Suspense } from "react"
import BackendStatusChecker from "@/components/analytics/status-checker"



export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
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
