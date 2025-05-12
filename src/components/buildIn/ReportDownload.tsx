'use client';

import { useRouter } from 'next/navigation';


export function RoutesBoss() {
  const router = useRouter();


  return (
    <section className="relative min-h-[300px] w-full max-w-3xl mx-auto my-5 px-4">
    {/* Background decorative elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl -z-10"></div>
    <div className="absolute top-10 left-10 w-20 h-20 bg-purple-100 rounded-full blur-xl opacity-50 -z-10"></div>
    <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-100 rounded-full blur-xl opacity-50 -z-10"></div>

    {/* Inline button layout */}
    <div className="relative flex flex-col items-stretch gap-4 mt-20">
      {/* First button */}
      <div className="transform hover:-translate-y-2 transition-all duration-300 w-full">
        <button
          onClick={() => router.push("dashboard/employees")}
          className="group flex items-center gap-3 bg-gray-700 border border-slate-200 shadow-lg hover:shadow-xl hover:border-purple-200 rounded-xl px-5 py-4 transition-all duration-300 w-full"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
            {/* Users icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-purple-600"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="text-lg font-medium">Аналитика сотрудников</span>
        </button>
      </div>

      {/* Second button */}
      <div className="transform hover:-translate-y-2 transition-all duration-300 w-full">
        <button
          onClick={() => router.push("/dashboard/department/")}
          className="group flex items-center gap-3 bg-gray-700 border border-slate-200 shadow-lg hover:shadow-xl hover:border-blue-200 rounded-xl px-5 py-4 transition-all duration-300 w-full"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
            {/* File Text icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-blue-600"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="text-lg font-medium">Аналитика отдела </span>
        </button>
      </div>

      {/* Third button */}
      <div className="transform hover:-translate-y-2 transition-all duration-300 w-full">
        <button
          onClick={() => router.push("/analytics/tasks")}
          className="group flex items-center gap-3 bg-gray-700 border border-slate-200 shadow-lg hover:shadow-xl hover:border-teal-200 rounded-xl px-5 py-4 transition-all duration-300 w-full"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
            {/* Bar Chart icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-teal-600"
            >
              <rect x="3" y="12" width="6" height="8" />
              <rect x="9" y="8" width="6" height="12" />
              <rect x="15" y="4" width="6" height="16" />
            </svg>
          </div>
          <span className="text-lg font-medium">Анализ общий</span>
        </button>
      </div>    </div>
  </section>
  );
}