export const CircularDiagram = ({ data, title }: { data: any[]; title: string }) => {
    const total =
      data?.reduce((sum: number, item: any) => sum + item.value, 0) || 0;
  
    const chartData =
      data?.map((item: any) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        return { ...item, percentage };
      }) || [];
  
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
              <span className="text-lg font-bold text-gray-300">0</span>
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
  
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="#1F2937"
                  strokeWidth="1"
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="#1F2937" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-lg font-bold text-gray-200">
              {total.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">часов</span>
          </div>
        </div>
        <div className="mt-4 w-full">
          {chartData.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">{item.label}</span>
              </div>
              <div className="text-sm text-gray-400">
                {item.value.toFixed(1)}ч ({item.percentage.toFixed(0)}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };