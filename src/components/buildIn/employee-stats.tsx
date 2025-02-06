"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

const employees = [
  {
    name: "John Smith",
    role: "Senior Developer",
    tasksCompleted: 45,
    tasksTotal: 50,
    efficiency: 90,
  },
  {
    name: "Sarah Johnson",
    role: "UI Designer",
    tasksCompleted: 28,
    tasksTotal: 35,
    efficiency: 80,
  },
  {
    name: "Mike Brown",
    role: "Backend Developer",
    tasksCompleted: 32,
    tasksTotal: 40,
    efficiency: 85,
  },
]

function ProgressBar({ value, max }: { value: number; max: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 200
    canvas.height = 8

    // Draw background
    ctx.fillStyle = "hsl(0, 0%, 15%)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw progress
    const progress = (value / max) * canvas.width
    ctx.fillStyle = "hsl(0, 68%, 27%)"
    ctx.fillRect(0, 0, progress, canvas.height)
  }, [value, max])

  return <canvas ref={canvasRef} style={{ width: "100%", height: "8px" }} />
}

export default function EmployeeStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {employees.map((employee) => (
        <Card key={employee.name} className="bg-gray-800 rounded-xl border-none">
          <CardHeader>
            <CardTitle>{employee.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm">Tasks Progress</p>
                  <p className="text-sm font-medium">
                    {employee.tasksCompleted}/{employee.tasksTotal}
                  </p>
                </div>
                <ProgressBar value={employee.tasksCompleted} max={employee.tasksTotal} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm">Efficiency</p>
                  <p className="text-sm font-medium">{employee.efficiency}%</p>
                </div>
                <ProgressBar value={employee.efficiency} max={100} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

