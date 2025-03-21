"use client"

import { useState } from "react"
import Link from "next/link"
import { PulseLogo } from "@/svgs/Logo"
import { useRouter } from "next/navigation"
import { Header } from "@/components/ui/header"
import { Notes } from "@/components/buildIn/Notes"

const documentationSections = [
  { id: "frontend", title: "Фронтенд" },
  { id: "backend", title: "Бэкенд" },
  { id: "database", title: "База данных" },
  { id: "security", title: "Безопасность" },
  { id: "deployment", title: "Деплой" },
  { id: "technologies", title: "Технологии" },
  { id: "future", title: "Потенциальное развитие" },
  { id: "bugs", title: "Документация багов" },
  { id: "fuck", title: "Потенциальные проблемы " },
  { id: "structure", title: "Структура приложения" },
  { id: "build", title: "Процессы доработки" },
  { id: "notes", title: "Заметки " },

]

export default function DocumentationPage() {
    const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("frontend")
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  return (
    <div className="mainProfileDiv">
     <Header  title="Документация"/>

      <main className="container mx-auto p-4 flex flex-col md:flex-row">
        <nav className="w-full md:w-1/4 mb-4 md:mb-0">
          <ul className="bg-gray-800 rounded-lg p-4">
            {documentationSections.map((section) => (
              <li key={section.id} className="mb-2">
                <button
                  onClick={() => handleSectionChange(section.id)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeSection === section.id ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section className="w-full md:w-3/4 md:ml-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {documentationSections.find((section) => section.id === activeSection)?.title}
            </h2>
            <div className="prose prose-invert max-w-none">
              {activeSection === "frontend" && (
                <div>
                  <h3>Обзор фронтенда</h3>
                  <p>
                    Фронтенд нашего приложения построен с использованием React и Next.js. Мы используем Tailwind CSS для
                    стилизации и обеспечения отзывчивого дизайна.
                  </p>
                  <h4>Ключевые компоненты:</h4>
                  <ul>
                    <li>Страница входа</li>
                    <li>Дашборд</li>
                    <li>Профиль пользователя</li>
                    <li>Страница отчетов</li>
                  </ul>
                </div>
              )}
              {activeSection === "backend" && (
                <div>
                  <h3>Архитектура бэкенда</h3>
                  <p>
                    Бэкенд реализован на Node.js с использованием Express.js. Мы используем RESTful API для
                    взаимодействия с фронтендом.
                  </p>
                  <h4>Основные эндпоинты:</h4>
                  <ul>
                    <li>/api/auth - аутентификация пользователей</li>
                    <li>/api/users - управление пользователями</li>
                    <li>/api/reports - генерация и получение отчетов</li>
                  </ul>
                </div>
              )}
              {activeSection === "database" && (
                <div>
                  <h3>Структура базы данных</h3>
                  <p>Мы используем PostgreSQL в качестве основной базы данных. Основные таблицы включают:</p>
                  <ul>
                    <li>users - информация о пользователях</li>
                    <li>tasks - задачи пользователей</li>
                    <li>reports - сгенерированные отчеты</li>
                  </ul>
                </div>
              )}
              {activeSection === "security" && (
                <div>
                  <h3>Меры безопасности</h3>
                  <p>Безопасность приложения обеспечивается следующими мерами:</p>
                  <ul>
                    <li>Шифрование паролей с использованием bcrypt</li>
                    <li>Использование JWT для аутентификации</li>
                    <li>HTTPS для всех соединений</li>
                    <li>Защита от SQL-инъекций и XSS-атак</li>
                  </ul>
                </div>
              )}
              {activeSection === "deployment" && (
                <div>
                  <h3>Процесс деплоя</h3>
                  <p>Мы используем CI/CD pipeline для автоматизации процесса деплоя:</p>
                  <ol>
                    <li>Код проходит автоматическое тестирование при каждом push в репозиторий</li>
                    <li>После успешного прохождения тестов, приложение автоматически деплоится на staging-сервер</li>
                    <li>После проверки на staging, приложение может быть вручную задеплоено на production</li>
                  </ol>
                </div>
              )}
              {activeSection === "technologies" && (
                <div>
                  <h3>Используемые технологии</h3>
                  <ul>
                    <li>Frontend: React, Next.js, Tailwind CSS</li>
                    <li>Backend: Node.js, Express.js</li>
                    <li>Database: PostgreSQL</li>
                    <li>Authentication: JWT</li>
                    <li>Testing: Jest, React Testing Library</li>
                    <li>CI/CD: GitHub Actions</li>
                  </ul>
                </div>
              )}
              {activeSection === "future" && (
                <div>
                  <h3>Планы по развитию</h3>
                  <p>В будущем мы планируем реализовать следующие функции:</p>
                  <ul>
                    <li>Интеграция с внешними системами учета времени</li>
                    <li>Внедрение системы уведомлений</li>
                    <li>Разработка мобильного приложения</li>
                    <li>Улучшение аналитических возможностей для генерации отчетов</li>
                  </ul>
                </div>
              )}
              {activeSection === "bugs" && (
                <div>
                  <h3>Документация багов</h3>
                  <p>
                    Для отслеживания и документирования багов мы используем систему issue tracking в GitHub. Процесс
                    работы с багами:
                  </p>
                  <ol>
                    <li>Обнаружение и регистрация бага в GitHub Issues</li>
                    <li>Присвоение приоритета и назначение ответственного разработчика</li>
                    <li>Воспроизведение и анализ бага</li>
                    <li>Исправление бага и создание pull request</li>
                    <li>Код ревью и тестирование исправления</li>
                    <li>Мерж исправления в основную ветку</li>
                  </ol>
                </div>
              )}
               {activeSection === "fuck" && (
                <div>
                  <h3>Баги</h3>
                  <p>
                    Для отслеживания и документирования багов мы используем систему issue tracking в GitHub. Процесс
                    работы с багами:
                  </p>
                  <ol>
                    <li>

Удалить мусор, использовать только если не запускается:
docker system prune
s</li>
                    <li>Присвоение приоритета и назначение ответственного разработчика</li>
                    <li>Воспроизведение и анализ бага</li>
                    <li>Исправление бага и создание pull request</li>
                    <li>Код ревью и тестирование исправления</li>
                    <li>Мерж исправления в основную ветку</li>
                  </ol>
                </div>
              )}
              {activeSection === "structure" && (
                <div>
                  <h3>Структура</h3>
                  <p>
                    Для отслеживания и документирования багов мы используем систему issue tracking в GitHub. Процесс
                    работы с багами:
                  </p>
                  <ol>
                    <li>Обнаружение и регистрация бага в GitHub Issues</li>
                    <li>Присвоение приоритета и назначение ответственного разработчика</li>
                    <li>Воспроизведение и анализ бага</li>
                    <li>Исправление бага и создание pull request</li>
                    <li>Код ревью и тестирование исправления</li>
                    <li>Мерж исправления в основную ветку</li>
                  </ol>
                </div>
              )}
              {activeSection === "build" && (
                <div>
                  <h3>Тем кто собирается дорабатывать </h3>
                  <p>
                    Для отслеживания и документирования багов мы используем систему issue tracking в GitHub. Процесс
                    работы с багами:
                  </p>
                  <ol>
                    <li>Обнаружение и регистрация бага в GitHub Issues</li>
                    <li>Присвоение приоритета и назначение ответственного разработчика</li>
                    <li>Воспроизведение и анализ бага</li>
                    <li>Исправление бага и создание pull request</li>
                    <li>Код ревью и тестирование исправления</li>
                    <li>Мерж исправления в основную ветку</li>
                  </ol>
                </div>
              )}
              {activeSection === "notes" && (
                <div>
                  <h3>Заметки</h3>
                  <p>
                   В поле ниже вы можете написать заметки, которые будут видны только вам
                  </p>
                  <ol>
                      <Notes/>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

