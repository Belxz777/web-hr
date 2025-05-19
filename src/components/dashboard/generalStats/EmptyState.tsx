
const formatDisplayDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

export const EmptyState = ({ date }: { date: string }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-8 text-center">
      <div className="text-5xl text-red-500 mb-4">📊</div>
      <h3 className="text-xl font-bold text-gray-200 mb-2">Нет данных за выбранный период</h3>
      <p className="text-gray-400">За {formatDisplayDate(date)} нет данных по отработанным часам в отделах.</p>
    </div>
  );
};