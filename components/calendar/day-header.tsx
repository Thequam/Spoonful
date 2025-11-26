"use client"

import { format } from "date-fns"
import { AlertTriangle } from "lucide-react"
import { isToday } from "@/lib/date-utils"

interface DayHeaderProps {
  date: Date
  totalSpoons: number
  dailyLimit: number
  onClick?: () => void
}

export function DayHeader({ date, totalSpoons, dailyLimit, onClick }: DayHeaderProps) {
  const isOverLimit = totalSpoons > dailyLimit
  const isTodayDate = isToday(date)

  const progressPercent = Math.min((totalSpoons / dailyLimit) * 100, 100)

  return (
    <div
      className={`h-[85px] border-b border-r border-border/40 flex flex-col items-center justify-center py-2 px-2 cursor-pointer hover:bg-muted/50 transition-colors bg-background ${
        isTodayDate ? "bg-primary/5 dark:bg-primary/10" : ""
      }`}
      onClick={onClick}
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{format(date, "EEE")}</div>
      <div className="relative flex items-center justify-center mt-0.5">
        <span
          className={`text-sm font-semibold ${
            isTodayDate
              ? "bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center"
              : "text-foreground"
          }`}
        >
          {format(date, "d")}
        </span>
        {isOverLimit && <AlertTriangle className="absolute -right-4 h-3 w-3 text-destructive" />}
      </div>
      <div className={`text-xs mt-0.5 font-medium ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
        {totalSpoons} / {dailyLimit} Spoons
      </div>

      <div className="w-full mt-1.5 px-1">
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOverLimit ? "bg-destructive" : "bg-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
