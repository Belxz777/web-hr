export const CircularDepartmentDiagram = ({ functionHours, deputyHours }: { functionHours: number; deputyHours: number }) => {
  const total = functionHours + deputyHours;

  if (total === 0) {
    return (
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#4B5563" strokeWidth="8" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-sm font-bold text-gray-300">0</span>
          <span className="text-xs text-gray-400">часов</span>
        </div>
      </div>
    );
  }

  const functionPercentage = (functionHours / total) * 100;
  const deputyPercentage = (deputyHours / total) * 100;

  return (
    <div className="relative w-24 h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {functionHours > 0 && (
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#EF4444"
            strokeWidth="16"
            strokeDasharray={`${(functionPercentage * 251.2) / 100} 251.2`}
            transform="rotate(-90 50 50)"
          />
        )}
        {deputyHours > 0 && (
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#F87171"
            strokeWidth="16"
            strokeDasharray={`${(deputyPercentage * 251.2) / 100} 251.2`}
            strokeDashoffset={`${-((functionPercentage * 251.2) / 100)}`}
            transform="rotate(-90 50 50)"
          />
        )}
        <circle cx="50" cy="50" r="32" fill="#1F2937" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-sm font-bold text-gray-200">{total.toFixed(1)}</span>
        <span className="text-xs text-gray-400">часов</span>
      </div>
    </div>
  );
};