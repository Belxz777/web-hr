import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";

export const CircularDiagramForDeps = ({
  functionHours,
  deputyHours,
}: {
  functionHours: number;
  deputyHours: number;
}) => {
  const total = functionHours + deputyHours;
  const convertedTotalHours = convertDataToNormalTime(total)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#4B5563"
            strokeWidth="8"
          />
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
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {functionHours > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#32CD32"
            strokeWidth="16"
            strokeDasharray={`${
              (functionPercentage / 100) * circumference
            } ${circumference}`}
            transform="rotate(-90 50 50)"
          />
        )}
        {deputyHours > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F0E68C"
            strokeWidth="16"
            strokeDasharray={`${
              (deputyPercentage / 100) * circumference
            } ${circumference}`}
            strokeDashoffset={-circumference * (functionPercentage / 100)}
            transform="rotate(-90 50 50)"
          />
        )}
        <circle cx="50" cy="50" r="32" fill="#1F2937" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-sm font-bold text-gray-200 bg-gray-800 rounded-xl ">
          {convertedTotalHours}
        </span>
        <span className="text-xs text-gray-400">ч.</span>
      </div>
    </div>
  );
};