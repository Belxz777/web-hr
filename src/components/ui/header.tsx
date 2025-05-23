"use client"

import type React from "react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface MenuItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

const MenuItem: React.FC<MenuItemProps> = ({ href, icon, children }) => {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#249BA2] transition-all duration-300 rounded-md group overflow-hidden"
      >
        <span className="mr-3 text-gray-500 group-hover:text-[#249BA2] transition-colors duration-200 flex-shrink-0">
          {icon}
        </span>
        <span className="font-medium transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300">
          {children}
        </span>
      </Link>
    </li>
  )
}

const HeaderMenu: React.FC<{ position: number | null }> = ({ position }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString())
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#249BA2] transition-colors duration-200 w-10 h-10 flex items-center justify-center"
        aria-expanded={isMenuOpen}
        aria-label="Открыть меню"
      >
        <div className="w-6 h-6 relative flex items-center justify-center">
          <span
            className={`absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ease-in-out ${
              isMenuOpen ? "rotate-45" : "-translate-y-2"
            }`}
          />

          <span
            className={`absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />

          <span
            className={`absolute h-0.5 w-6 bg-gray-700 transform transition-all duration-300 ease-in-out ${
              isMenuOpen ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </div>
      </button>

      <div
        className={`
          absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 
          transform origin-top-right transition-all duration-300 ease-in-out z-50
          border border-gray-200
          ${isMenuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}
        `}
      >
        <ul className="py-1 space-y-1">
          {position !== null && position >= 2 && (
            <>
              <MenuItem
                href="/dashboard/department/"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 3v18h18" />
                    <rect x="7" y="10" width="3" height="8" />
                    <rect x="12" y="6" width="3" height="12" />
                    <rect x="17" y="14" width="3" height="4" />
                  </svg>
                }
              >
                Статистика отдела
              </MenuItem>

              {position >= 4 && (
                <MenuItem
                  href="/stats"
                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 2L3 5v6c0 5.5 3.5 10.75 9 12 5.5-1.25 9-6.5 9-12V5l-9-3z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                  }
                >
                  Статус работы приложения
                </MenuItem>
              )}
            </>
          )}

          <MenuItem
            href="/report"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M15.5 4l4.5 4.5-1.5 1.5-4.5-4.5z" />
                <path d="M2 22l2-2 4-4-4-4-2 2z" />
              </svg>
            }
          >
            Заполнение отчета
          </MenuItem>

          <MenuItem
            href="/settings"
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          >
            Настройки
          </MenuItem>

          <li className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between px-4 py-2 text-sm">
              <span className="text-gray-500">Время:</span>
              <span className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded-xl">{currentTime}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2 text-sm">
              <span className="text-gray-500">День недели:</span>
              <span className="text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded-xl">
                {new Date().toLocaleString("ru-RU", { weekday: "long" })}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default HeaderMenu

const CompanyLogos = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/profile">
      <img src="/info.png" alt="Info" className="w-auto h-16" />
      </Link>
    </div>
  )
}

const NavLinks = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link href="/report" className="text-gray-700 hover:text-[#249BA2] font-medium">
        Заполнение отчета
      </Link>
      <Link href="/settings" className="text-gray-700 hover:text-[#249BA2] font-medium">
        Настройки
      </Link>
    </nav>
  )
}

export const Header: React.FC<{
  title?: string
  position?: number | null
  showPanel: boolean
  buttons?: boolean
}> = ({ title, position = null, showPanel, buttons = false }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <CompanyLogos />

        <div className="flex items-center space-x-4">
          <NavLinks />

          {showPanel && <HeaderMenu position={position} />}
        </div>
      </div>

      {buttons && (
        <div className="container mx-auto mt-2 flex flex-wrap gap-2 justify-end">
          <Link
            href="/dashboard/department"
            className="px-3 py-1.5 text-sm transition-colors bg-[#249BA2] text-white rounded-xl"
          >
            Статистика за промежуток времени
          </Link>
          <Link
            href="/dashboard/employees"
            className="px-3 py-1.5 text-sm transition-colors bg-[#249BA2] text-white rounded-xl"
          >
            Статистика по сотрудникам
          </Link>
          <Link
            href="/dashboard/general"
            className="px-3 py-1.5 text-sm transition-colors bg-[#249BA2] text-white rounded-xl"
          >
            Статистика по всем департаментам
          </Link>
        </div>
      )}
    </header>
  )
}
