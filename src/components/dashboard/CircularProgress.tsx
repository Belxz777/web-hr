import type React from "react"

interface CircularProgressProps {
  percentage: number
  color: string
  children?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  strokeWidth?: number
  showBackground?: boolean
  animated?: boolean
}

export function CircularProgress({
  percentage,
  color,
  children,
  size = "lg",
  strokeWidth,
  showBackground = true,
  animated = true,
}: CircularProgressProps) {
  // Size configurations
  const sizeConfig = {
    sm: { diameter: 60, stroke: 4, text: "text-xs" },
    md: { diameter: 80, stroke: 6, text: "text-sm" },
    lg: { diameter: 120, stroke: 8, text: "text-base" },
    xl: { diameter: 160, stroke: 10, text: "text-lg" },
  }

  const config = sizeConfig[size]
  const finalStrokeWidth = strokeWidth || config.stroke
  const diameter = config.diameter
  const radius = (diameter - finalStrokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (Math.min(Math.max(percentage, 0), 100) / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow effect */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-sm"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          width: diameter + 20,
          height: diameter + 20,
          left: -10,
          top: -10,
        }}
      />

      {/* Main SVG */}
      <svg
        width={diameter}
        height={diameter}
        className="transform -rotate-90 drop-shadow-sm"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
      >
        {/* Background circle */}
        {showBackground && (
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth={finalStrokeWidth}
            fill="transparent"
            className="opacity-15"
          />
        )}

        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={color}
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${animated ? "transition-all duration-1000 ease-out" : ""} filter drop-shadow-sm`}
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />

        {/* Inner highlight circle for depth */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius - finalStrokeWidth / 2}
          stroke="none"
          fill="transparent"
          className="opacity-5"
          style={{ fill: `${color}08` }}
        />
      </svg>

      {/* Content in the center */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${config.text}`}
        style={{
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        <div className="text-center font-bold leading-tight">{children}</div>
      </div>

      {/* Progress indicator dots */}
      {percentage > 0 && (
        <div
          className="absolute w-2 h-2 rounded-full shadow-sm"
          style={{
            backgroundColor: color,
            top: finalStrokeWidth / 2,
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      )}
    </div>
  )
}
