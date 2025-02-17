'use client'

import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Header } from '@/components/ui/header'

// Types
type PerformanceData = {
  date: string
  report_count: number
  total_hours: string
}

type DepartmentData = {
  department: string
  performance: PerformanceData[]
}

type EmployeeData = {
  employee_id: number
  name: string
  performance: PerformanceData[]
}

// Sample data
const departmentData: DepartmentData = {
  department: "Тех-контроль",
  performance: [
    {
      date: "2025-02-04",
      report_count: 2,
      total_hours: "2.00"
    },
    {
      date: "2025-02-05",
      report_count: 2,
      total_hours: "221.00"
    },
    {
      date: "2025-02-06",
      report_count: 2,
      total_hours: "22.00"
    }
  ]
}

const employeesData: EmployeeData[] = [
  {
    employee_id: 1,
    name: "Иван Иванов",
    performance: [
      {
        date: "2025-02-05",
        report_count: 3,
        total_hours: "4.00"
      },
      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },
      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },
      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      },      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "3.00"
      }
    ]
  },
  {
    employee_id: 2,
    name: "Мария Петрова",
    performance: [
      {
        date: "2025-02-05",
        report_count: 2,
        total_hours: "2.00"
      },
      {
        date: "2025-02-10",
        report_count: 2,
        total_hours: "2.00"
      }
    ]
  }
]

const BarChart = ({ data }: { data: PerformanceData[] }) => {
  const maxValue = Math.max(...data.map(d => parseFloat(d.total_hours)))
  const barWidth = 60
  const gap = 20
  const width = (barWidth + gap) * data.length
  const height = 200
  const padding = 40

  return (
    <svg width={width + padding * 2} height={height + padding * 2} className="mx-auto">
      {/* Y axis */}
      <line 
        x1={padding} 
        y1={padding} 
        x2={padding} 
        y2={height + padding} 
        stroke="currentColor" 
        strokeWidth="1"
      />
      
      {/* X axis */}
      <line 
        x1={padding} 
        y1={height + padding} 
        x2={width + padding} 
        y2={height + padding} 
        stroke="currentColor" 
        strokeWidth="1"
      />

      {/* Bars */}
      {data.map((item, index) => {
        const barHeight = (parseFloat(item.total_hours) / maxValue) * height
        return (
          <g key={index} transform={`translate(${padding + index * (barWidth + gap)}, ${padding})`}>
            <rect
              x={0}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              fill="#ef4444"
              className="hover:fill-red-600 transition-colors"
            />
            <text
              x={barWidth / 2}
              y={height - barHeight - 5}
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
            >
              {item.total_hours}  
            </text>
            <text
              x={barWidth / 2}
              y={height + 20}
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
             
            >
              {item.date}
            </text>
            <text
              x={barWidth / 2}
              y={height - barHeight - 20}
              textAnchor="middle"
              fill="currentColor"
              fontSize="12"
            >
              {item.report_count} отч.
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const MetricsCard = ({ title, value, subtitle }: { title: string, value: string, subtitle: string }) => (
  <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
    <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
    <div className="text-2xl font-bold mb-1 text-white">{value}</div>
    <div className="text-sm text-gray-500">{subtitle}</div>
  </div>
)

export default function StatisticsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reporting'>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null)

  const handleSearch = () => {
    const employee = employeesData.find(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.employee_id.toString() === searchTerm
    )
    setSelectedEmployee(employee || null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
<Header title='Статистика'  employeeData={null}/>

      <main className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-red-600 text-white px-4 py-2 rounded">
            СТАТИСТИКА
          </div>

        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Поиск сотрудника по имени или ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Поиск
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricsCard
            title="Всего часов (отдел)"
            value={departmentData.performance.reduce((sum, p) => sum + parseFloat(p.total_hours), 0).toFixed(2) + 'ч'}
            subtitle={`${departmentData.department}`}
          />
          <MetricsCard
            title="Всего отчетов (отдел)"
            value={departmentData.performance.reduce((sum, p) => sum + p.report_count, 0).toString()}
            subtitle={`${departmentData.department}`}
          />
          {selectedEmployee && (
            <>
              <MetricsCard
                title="Всего часов (сотрудник)"
                value={selectedEmployee.performance.reduce((sum, p) => sum + parseFloat(p.total_hours), 0).toFixed(2) + 'ч'}
                subtitle={`${selectedEmployee.name}`}
              />
              <MetricsCard
                title="Всего отчетов (сотрудник)"
                value={selectedEmployee.performance.reduce((sum, p) => sum + p.report_count, 0).toString()}
                subtitle={`${selectedEmployee.name}`}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold bg-gray-700 text-white px-3 py-1 rounded">
              ОБЩАЯ  СТАТИСТИКА ОТДЕЛА: {departmentData.department}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <BarChart data={departmentData.performance} />
            </div>
          </div>

          {selectedEmployee && (
            <div className="bg-gray-800 border border-gray-700 rounded shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold bg-gray-700 text-white px-3 py-1 rounded">
                  СТАТИСТИКА СОТРУДНИКА: {selectedEmployee.name}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <BarChart data={selectedEmployee.performance} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
