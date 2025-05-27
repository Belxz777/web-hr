import { convertDataToNormalTime } from "../utils/convertDataToNormalTime"

interface ProgressBarProps {
  label: string
  value: number
  color: string
  hours: number
  showClickHint?: boolean
  isSubItem?: boolean
}

export const ProgressBar = ({
  label,
  value,
  color,
  hours,
  showClickHint = false,
  isSubItem = false,
}: ProgressBarProps) => {
  const convertedTime = convertDataToNormalTime(hours)

  return (
    <div
      className={`${isSubItem ? "bg-background/30" : "bg-background/50"} backdrop-blur-sm rounded-lg p-4 border border-border/50 transition-all duration-200 ${showClickHint ? "hover:shadow-md" : ""}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isSubItem ? "text-sm text-foreground/80" : "text-foreground"}`}>{label}</span>
          {showClickHint && (
            <span className="text-xs text-muted-foreground bg-secondary/10 px-2 py-1 rounded-full">
              Кликните для детализации
            </span>
          )}
        </div>
        <div className="text-right">
          <div className={`font-bold ${isSubItem ? "text-sm" : "text-base"} text-foreground`}>{value.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">{convertedTime}</div>
        </div>
      </div>

      <div className="w-full bg-border/30 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{
            width: `${Math.min(value, 100)}%`,
            backgroundColor: color,
          }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

    
    </div>
  )
}
