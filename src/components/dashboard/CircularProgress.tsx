import { CircularProgressProps } from "@/types";

export function CircularProgress({
  percentage,
  color,
  size = "md",
  strokeWidth = 8,
  children,
}: CircularProgressProps) {
  const sizeMap = {
    sm: 80,
    md: 100,
    lg: 120,
  };
  const viewBoxSize = sizeMap[size];
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClass = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }[size];

  return (
    <div className={`relative ${sizeClass}`}>
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Background circle */}
        <circle
          className="text-gray-600"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          style={{
            transformOrigin: "50% 50%",
            transform: "rotate(-90deg)",
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}