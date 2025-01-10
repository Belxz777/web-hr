import { CurvedArrow } from "@/svgs/Back";

export default function DownloadReportPage({ params }: { params: { department: number } }) {
  const {department } = params;
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900  rounded-xl overflow-hidden">
        <div className="border-b border-red-600 p-6">
          <h1 className="text-2xl font-bold text-gray-300 mb-2">Отчет отдела за Q3 2023</h1>
          <p className="text-gray-400 text-sm">
            Комплексный анализ производительности отдела  
          </p>
          <button 
      className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
      aria-label="Next"
    >
      <CurvedArrow   className="w-16 h-16  text-red-600"  />
    </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-300 text-xl font-medium">
              <span >Отчет  (Excel)</span>
            </div>
            <button 
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center space-x-2 transition duration-300"  
            >
              <span>Скачать отчет</span>
            </button>
          </div>
        </div>
        <div className="border-t border-red-600 p-4 text-center text-gray-400 text-sm">
          Последнее обновление: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-red-600">
      <span className="text-gray-400 text-sm block mb-2">{title}</span>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}