export function ProgressBar({
    label,
    value,
    color,
    hours,
  }: {
    label: string;
    value: number;
    color: string;
    hours: number;
  }) {
    return (
      <div>
        <div className="flex justify-between mb-1">
          <div>{label}</div>
          <div>
            {hours.toFixed(2)} ч ({value.toFixed(1)}%)
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className={`${color} h-2.5 rounded-full`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );
  }