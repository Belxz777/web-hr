'use client'

import { useState } from 'react'

export function ReportUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus('idle')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadStatus('success')
      } else {
        setUploadStatus('error')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Загрузка Excel файла с задачами</h2>
      <div className="space-y-4">
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-red-600 file:text-white
            hover:file:bg-red-700"
        />
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {uploading ? 'Загрузка...' : 'Загрузить файл'}
        </button>
        {uploadStatus === 'success' && (
          <p className="text-green-500">Файл успешно загружен!</p>
        )}
        {uploadStatus === 'error' && (
          <p className="text-red-500">Ошибка при загрузке файла. Попробуйте еще раз.</p>
        )}
      </div>
    </div>
  )
}

