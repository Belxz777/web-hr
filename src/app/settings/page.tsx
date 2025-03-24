'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PulseLogo } from '@/svgs/Logo'
import { Header } from '@/components/ui/header'
import { Notes } from '@/components/buildIn/Notes'

// Пример данных контактов поддержки
const supportContacts = [
  { name: 'Техническая поддержка', email: 'romanbelyh436@gmail.com (ПОЧТА)',},
  { name: 'Сообщить об ошибке',email: '@belxz999 (TELEGRAM)',},
]

export default function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    // Применение темы при загрузке и изменении
    document.body.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-red-600 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-red-100 to-gray-100 text-gray-900'}`}>
    <Header  title="Настройки"/>

      <main className="container mx-auto p-4">
        <section className={`mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
          <h2 className="text-2xl font-bold mb-4">Контакты поддержки</h2>
          <ul className="space-y-4">
            {supportContacts.map((contact, index) => (
              <li key={index} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4`}>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Писать: {contact.email}</p>
              </li>
            ))}
          </ul>
      
        {/* <section className={`mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
          <h2 className="text-2xl font-bold mb-4">Тема приложения</h2>
          <div className="flex items-center justify-between">
            <span>Текущая тема: {theme === 'dark' ? 'Темная' : 'Светлая'}</span>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-100 hover:bg-red-200 text-red-800'
              } focus:outline-none focus:ring-2 focus:ring-red-500`}
            >
              Переключить тему
            </button>
          </div>
        </section> */}

        {/* <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
          <h2 className="text-2xl font-bold mb-4">Будущие настройки</h2>
          <Link href="/settings/docs" className="text-red-600 hover:underline">
Документация 
          </Link>
        </section> */}
                      <Notes  />
            </section>
      </main>
    </div>
  )
}

