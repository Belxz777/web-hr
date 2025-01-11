'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PulseLogo } from '@/svgs/Logo'

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
      <header className="bg-gray-800 p-4 flex justify-between items-center">
      <PulseLogo className="w-16 h-16 text-red-600 hover:text-gray-300 hover:animate-pulse"  />
      <nav className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-300 hover:text-white focus:outline-none"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-1">
              <li><Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Дашборд</Link></li>
              <li><Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Профиль</Link></li>
              <li><Link href="/tasks/download" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Скачивание задач</Link></li>
              <li><Link href="/contacts" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Контакты</Link></li>
            </ul>
          )}
        </nav>
      </header>

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

