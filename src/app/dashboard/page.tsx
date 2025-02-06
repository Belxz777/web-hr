import EmployeeStats from "@/components/buildIn/employee-stats"
import TaskChart from "@/components/buildIn/task-chart"
import ContributionHeatmap from "@/components/buildIn/contribution-heatmap"
import { PulseLogo } from "@/svgs/Logo"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className=' inline-flex items-center '> 
          <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
          <h1 className="text-2xl  pl-4 font-bold">Анализ отдела</h1>  
          </div>
      </header>

      <div className="p-6">
      <div className="grid gap-8">
        <EmployeeStats />
        <div className="w-auto">
          <TaskChart />
          </div>
          
        
      </div>
      </div>
    </div>
  )
}

