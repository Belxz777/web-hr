"use client";

import { useState } from "react";

export function DownloadingAllReports() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Отчеты успешно скачаны!");
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="taskSectionStyles">
      <h3 className="mb-4 text-gray-300 dark:text-gray-300">
        Нажмите на кнопку, чтобы скачать все отчеты
      </h3>
      <button
        onClick={handleDownloadAll}
        disabled={downloading}
        className={`bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors ${
          downloading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {downloading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Загрузка...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg
              className="mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Скачать все отчеты
          </span>
        )}
      </button>

      {downloading && (
        <div className="w-full max-w-xs mt-4 bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <div className="bg-red-600 h-1.5 rounded-full animate-pulse w-full"></div>
        </div>
      )}
    </div>
  );
}
