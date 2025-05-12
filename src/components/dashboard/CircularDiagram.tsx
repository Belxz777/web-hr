import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";

export const CircularDiagram = ({
  data,
  title,
}: {
  data: any[];
  title: string;
}) => {
  const total =
    data?.reduce((sum: number, item: any) => sum + item.value, 0) || 0;

  const chartData =
    data?.map((item: any) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      return { ...item, percentage };
    }) || [];
  const funcsTotalTime = convertDataToNormalTime(total || 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-red-400 mb-3">{title}</h3>
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4B5563"
              strokeWidth="8"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-bold text-gray-300">0</span>
            <span className="text-xs text-gray-400">часов</span>
          </div>
        </div>
      </div>
    );
  }

  let cumulativePercentage = 0;

  return (
  <div className="flex flex-col items-center">
    <h3 className="text-lg font-semibold text-red-400 mb-3">{title}</h3>
    <div className="relative w-50 h-50">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {chartData.map((item: any, index: number) => {
          if (item.value === 0) return null;

          const startAngle = cumulativePercentage * 3.6;
          cumulativePercentage += item.percentage;
          const endAngle = cumulativePercentage * 3.6;

          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;

          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);

          const largeArcFlag = item.percentage > 50 ? 1 : 0;

          const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          const midAngle = (startAngle + endAngle) / 2;
          const midRad = ((midAngle - 90) * Math.PI) / 180;
          const textX = 48 + 30 * Math.cos(midRad);
          const textY = 55 + 30 * Math.sin(midRad);

          return (
            <g key={index}>
              <path
                d={pathData}
                fill={item.color}
                stroke="#1F2937"
                strokeWidth="4"
              />
              {item.percentage > 5 && (
                <text
                  x={textX}
                  y={textY}
                  fill="black"
                  fontSize="5"
                  fontWeight={"bold"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {item.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}
        <circle cx="50" cy="50" r="20" fill="#1F2937" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold text-gray-200 z-10 bg-[#1F2937] px-2 rounded">
          {funcsTotalTime}
        </span>
      </div>
    </div>
    <div className="mt-4 w-full">
      {chartData.map((item: any, index: number) => {
        const funcsTime = convertDataToNormalTime(item.value || 0);

        return (
          <div key={index} className="flex items-center justify-between mb-1">
            <div 
              className="flex items-center"
            >
              <div
                className="w-3 h-3 rounded-sm mr-2"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
            <div className="text-sm text-gray-400">
              {funcsTime} ({item.percentage.toFixed(0)}%)
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};
