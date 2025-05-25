const formatDisplayDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-")
  return `${day}.${month}.${year}`
}

export const EmptyState = ({ date }: { date: string }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[#6D6D6D]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#000000] mb-2">Нет данных за выбранный период</h3>
      <p className="text-[#6D6D6D] mb-4">За {formatDisplayDate(date)} нет данных по отработанным часам в отделах.</p>

      <div className="bg-gray-50 rounded-xl p-4 mt-4">
        <p className="text-sm text-[#6D6D6D]">
          Попробуйте выбрать другую дату или убедитесь, что данные были внесены в систему.
        </p>
      </div>
    </div>
  )
}
