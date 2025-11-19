"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { formatWeekRange } from "@/lib/date-utils"
import { format } from "date-fns"

interface CalendarHeaderProps {
  currentDate: Date
  view: "week" | "day"
  onPrevious: () => void
  onNext: () => void
  onViewChange: (view: "week" | "day") => void
  onDateClick?: () => void
  dailyLimit?: number
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onViewChange,
  onDateClick,
  dailyLimit = 15,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Date display */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrevious} className="text-xs bg-background">
          <ChevronLeft className="h-4 w-4 text-primary" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDateClick}
          className="min-w-[200px] font-semibold text-foreground text-sm"
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          {view === "week" ? formatWeekRange(currentDate) : format(currentDate, "MMMM d, yyyy")}
        </Button>

        <Button variant="outline" size="sm" onClick={onNext} className="text-xs text-primary bg-background">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-sm">
        <div className="text-xs font-semibold">Daily Limit: {dailyLimit} spoons</div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 border border-border rounded-md p-1">
        <Button
          variant={view === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("week")}
          className={`text-xs ${view === "week" ? "text-primary-foreground" : "text-foreground"}`}
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("day")}
          className="text-xs text-foreground"
        >
          Day
        </Button>
      </div>
    </div>
  )
}
