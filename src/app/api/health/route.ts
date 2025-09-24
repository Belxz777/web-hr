import { host } from "@/types"
import { NextResponse } from "next/server"

export async function GET() {
  try {

    const response = await fetch(`${host}monitoring/healthcheck`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache:"no-cache",
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Backend health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Backend is not available",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    )
  }
}
