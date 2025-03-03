'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PulseLogo } from '@/svgs/Logo'
import { Header } from '@/components/ui/header'

export default function UploadTasksPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedFile) {
      console.log(`Загрузка файла: ${selectedFile.name}`)
      // Здесь будет логика загрузки файла на сервер
    } else {
      console.log('Файл не выбран')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-gray-900 text-gray-100">
    <Header title="Загрузка задач"/>

      <main className="container mx-auto p-4">
        <section className="bg-gray-800 rounded-xl p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Загрузка задач</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
                Выберите excel файл для загрузки
              </label>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            {selectedFile && (
              <p className="text-sm text-gray-300">Выбран файл: {selectedFile.name}</p>
            )}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!selectedFile}
            >
              Загрузить задачи
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

