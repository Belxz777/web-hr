'use client'

import { useState } from 'react'

export function ReportDownload() {
  const [downloading, setDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleDownload = async () => {
    setDownloading(true)
    setDownloadStatus('idle')

    try {
      const response = await fetch('/api/download-report')
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'report.xlsx'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        setDownloadStatus('success')
      } else {
        setDownloadStatus('error')
      }
    } catch (error) {
      console.error('Download error:', error)
      setDownloadStatus('error')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Скачать отчет</h2>
      <div className="space-y-4">
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {downloading ? 'Скачивание...' : 'Скачать отчет'}
        </button>
        {downloadStatus === 'success' && (
          <p className="text-green-500">Отчет успешно скачан!</p>
        )}
        {downloadStatus === 'error' && (
          <p className="text-red-500">Ошибка при скачивании отчета. Попробуйте еще раз.</p>
        )}
      </div>
    </div>
  )
}

