import { host } from "@/types"
import { type NextRequest, NextResponse } from "next/server"
interface DownloadWorkDataParams {
  start_date: string;
  end_date: string;
  department_id: string | number;
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startDate, endDate, department } = body


const response = await fetch(`${host}download/workdata?start_date=${startDate}&end_date=${endDate}&department_id=${department}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
    if (!response.ok) {
      throw new Error(`Remote server error: ${response.status}`)
    }

    // Forward the file response from remote server
    const fileBuffer = await response.arrayBuffer()

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": response.headers.get("Content-Disposition") || 'attachment; filename="report.xlsx"',
      },
    })
  } catch (error) {
    console.error("Download API error:", error)
    return NextResponse.json({ error: "Ошибка при скачивании отчета" }, { status: 500 })
  }
}
