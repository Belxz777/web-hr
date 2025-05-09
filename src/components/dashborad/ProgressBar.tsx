import { convertDataToNormalTime } from "../utils/convertDataToNormalTime";

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

    const progressTime = convertDataToNormalTime(hours);

    return (
      <div>
        <div className="flex justify-between mb-1">
          <div>{label}</div>
          <div>
            {progressTime} ({value.toFixed(1)}%)
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