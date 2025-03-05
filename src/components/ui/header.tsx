import { PulseLogo } from "@/svgs/Logo";
import Link from "next/link";
import { useState } from "react";

const MenuItem: React.FC<{
  href: string;
  icon: JSX.Element;
  children: React.ReactNode;
}> = ({ href, icon, children }) => {
  if (!href) {
    throw new Error("Missing required prop 'href' in MenuItem");
  }

  if (!children) {
    throw new Error("Missing required prop 'children' in MenuItem");
  }

  return (
    <li>
      <Link
        href={href}
        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
      >
        {icon && <span className="w-5 h-5 mr-3">{icon}</span>}
        {children}
      </Link>
    </li>
  );
};

const HeaderMenu: React.FC<{}> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const employeePos = localStorage.getItem("lc-pos-x");
  const employeePosBool = JSON.parse(employeePos);

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-300 hover:text-white focus:outline-none"
      >
        <span className="sr-only">Открыть меню</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      {isMenuOpen && employeePos && (
        <ul className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg py-1">
          {employeePosBool && (
            <>
              <MenuItem
                href="/department/report/download"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                }
              >
                Скачивание подробного отчета
              </MenuItem>

              <MenuItem
                href="/dashboard"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                Анализ отдела
              </MenuItem>

              <MenuItem
                href="/admin"
                icon={
                  <svg
                    className="w-6 h-6  dark:text-white"
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                }
              >
                Панель администрации
              </MenuItem>
            </>
          )}
          <MenuItem
            href="/report"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
          <MenuItem
            href="/createTask"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
          >
            Создать задачу
          </MenuItem>
          <li>
            <div className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-red-600 select-none">
              <span className="mr-3">{new Date().toLocaleTimeString()}</span>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center">
      <Link href="/profile" prefetch={false}>
        <div className="inline-flex items-center">
          <PulseLogo className="w-16 h-16 text-red-600 animate-pulse" />
          <h1 className="text-2xl pl-4 font-bold">
            {title || "Тестовое название"}
          </h1>
        </div>
      </Link>
      <HeaderMenu />
    </header>
  );
};

export { Header };
