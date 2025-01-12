'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PulseLogo } from '@/svgs/Logo'

// Пример данных контактов поддержки
const supportContacts = [
  { name: 'Техническая поддержка', email: 'support@example.com', phone: '+7 (999) 123-45-67' },
  { name: 'Сообщить об ошибке', email: 'customer@example.com', phone: '+7 (999) 765-43-21' },
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
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} p-4 flex justify-between items-center`}>
        <div className=' inline-flex items-center '> 
        <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
        <h1 className="text-2xl  pl-4 font-bold">Настройки</h1>  
        </div>
        
        <nav className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} focus:outline-none`}
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isMenuOpen && (
            <ul className={`absolute right-0 mt-2 w-56 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg py-1`}>
              <li><Link href="/profile" className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>Профиль</Link></li>
     </ul>
          )}
        </nav>
      </header>

      <main className="container mx-auto p-4">
        <section className={`mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
          <h2 className="text-2xl font-bold mb-4">Контакты поддержки</h2>
          <ul className="space-y-4">
            {supportContacts.map((contact, index) => (
              <li key={index} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4`}>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Email: {contact.email}</p>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Телефон: {contact.phone}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className={`mb-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
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
        </section>

        <section className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
          <h2 className="text-2xl font-bold mb-4">Будущие настройки</h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            Здесь будут размещены дополнительные настройки приложения. Следите за обновлениями!
          </p>
        </section>
      </main>
    </div>
  )
}

