"use client"

import { format } from "date-fns"
import { AlertTriangle } from "lucide-react"
import { isToday } from "@/lib/date-utils"
import { getSpoonLabel } from "@/lib/energy-utils"

interface DayHeaderProps {
  date: Date
  totalSpoons: number
  dailyLimit: number
  onClick?: () => void
}

export function DayHeader({ date, totalSpoons, dailyLimit, onClick }: DayHeaderProps) {
  const isOverLimit = totalSpoons > dailyLimit
  const isTodayDate = isToday(date)

  return (
    <div
      className={`h-[60px] border-b border-r border-border/40 flex flex-col items-center justify-center py-1 px-1 cursor-pointer hover:bg-muted/50 transition-colors bg-background ${
        isTodayDate ? "bg-primary/5 dark:bg-primary/10" : ""
      }`}
      onClick={onClick}
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{format(date, "EEE")}</div>
      <div className="relative flex items-center justify-center mt-0">
        <span className={`text-sm font-semibold ${isTodayDate ? "text-primary" : "text-foreground"}`}>
          {format(date, "d")}
        </span>
        {isOverLimit && <AlertTriangle className="absolute -right-4 h-3 w-3 text-destructive" />}
      </div>
      <div
        className={`text-xs mt-0 text-primary font-bold ${isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}
      >
        {getSpoonLabel(totalSpoons)}
      </div>
    </div>
  )
}
