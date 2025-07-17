"use client"

interface TabSwitcherProps {
  activeTab: string
  onTabChange: (value: string) => void
}

const SingleDayIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    <circle cx="12" cy="16" r="2" fill="currentColor" />
  </svg>
)

const DateRangeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    <circle cx="9" cy="16" r="1.5" fill="currentColor" />
    <circle cx="15" cy="16" r="1.5" fill="currentColor" />
    <line x1="10.5" y1="16" x2="13.5" y2="16" strokeWidth="2" />
  </svg>
)

export const TabSwitcher = ({ activeTab, onTabChange }: TabSwitcherProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-muted/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTabChange("day")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "day"
                ? "bg-background text-foreground shadow-md border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <SingleDayIcon className="w-5 h-5" />
            <span className="text-lg">День</span>
          </button>

          <button
            onClick={() => onTabChange("interval")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "interval"
                ? "bg-background text-foreground shadow-md border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            <DateRangeIcon className="w-5 h-5" />
            <span className="text-lg">Интервал</span>
          </button>
        </div>
      </div>
    </div>
  )
}
