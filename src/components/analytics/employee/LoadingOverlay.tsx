"use client"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export const LoadingOverlay = ({ isVisible, message = "Загрузка данных..." }: LoadingOverlayProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center border border-gray-200 dark:border-gray-700">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-600"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
        </div>
        <p className="text-gray-900 dark:text-gray-100 font-medium">{message}</p>
      </div>
    </div>
  )
}
