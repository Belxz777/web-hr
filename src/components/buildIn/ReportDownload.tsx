'use client'
import { useState } from 'react'
import { downloadReport } from '../server/download'
import { cookieget } from '../server/cookie'
import { host } from '@/types'
import Link from 'next/link'

export function ReportDownload() {
     const [downloading, setDownloading] = useState(false)
     const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle')
const router  = useRouter()
     const handleDownload = async () => {
       setDownloading(true)
       setDownloadStatus('idle')

       try {
        const cookie = cookieget()
        if(!cookie){
console.log(cookie)
        }
        const response = await fetch(`${host}report/department/xlsx/`, {
           method: 'GET',
           credentials: 'include',
           headers: {
            Cookie:`jwt=${cookie}`,
            'Content-Type': 'application/json',
           }
         })
         console.log(response)

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
       } catch (error) {
        console.error('Download error:', error)
         setDownloadStatus('error')
       } finally {
         setDownloading(false)
       }
     }    
  

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Скачивание отчета</h2>
      <div className="space-y-4">
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className=" bg-red-600 hover:bg-red-700 w-2/3 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {downloading ? 'Скачивание...' : 'Скачать общий отчет'}
        </button>
        {downloadStatus === 'success' && (
          <p className="text-green-500">Отчет успешно скачан!</p>
        )}
        {downloadStatus === 'error' && (
          <p className="text-red-500">Ошибка при скачивании отчета. Попробуйте еще раз.</p>
        )}
      </div>
          <Link href={`/department/report/download/`}>
            <button className=" w-1/2 mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Подробные отчеты
            </button>
          </Link>    </div>
  )


}