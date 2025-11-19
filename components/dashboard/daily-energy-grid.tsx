"use client"

import { AlertTriangle } from "lucide-react"
import { DAYS } from "@/lib/types"

interface DailyEnergyGridProps {
  dailyTotals: number[]
  dailyLimit: number
  weekdayTotal: number
  weekdayLimit: number
  weekendTotal: number
  weekendLimit: number
}

export function DailyEnergyGrid({
  dailyTotals,
  dailyLimit,
  weekdayTotal,
  weekdayLimit,
  weekendTotal,
  weekendLimit,
}: DailyEnergyGridProps) {
  const isWeekdayOver = weekdayTotal > weekdayLimit
  const isWeekendOver = weekendTotal > weekendLimit
  const totalWeek = weekdayTotal + weekendTotal
  const totalLimit = weekdayLimit + weekendLimit

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Daily Energy Usage</h3>

      <div className="flex justify-between items-center gap-1">
        {DAYS.map((day, index) => {
          const total = dailyTotals[index]
          const dayAbbrev = day.slice(0, 3)
          const isOverLimit = total > dailyLimit

          return (
            <div key={day} className="flex flex-col items-center">
              <div className="text-[10px] font-medium text-muted-foreground mb-1">{dayAbbrev}</div>
              <div className={`text-sm font-semibold text-primary ${isOverLimit ? "text-destructive" : ""}`}>{total}</div>
              {isOverLimit && <AlertTriangle className="h-3 w-3 text-destructive mx-auto mt-1" />}
            </div>
          )
        })}
      </div>

      <div className="space-y-1 pt-2 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-2">Weekly Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Weekday:</span>
          <span className={`text-xs font-semibold ${isWeekdayOver ? "text-destructive" : "text-primary"}`}>
            {weekdayTotal}/{weekdayLimit}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Weekend:</span>
          <span className={`text-xs font-semibold ${isWeekendOver ? "text-destructive" : "text-primary"}`}>
            {weekendTotal}/{weekendLimit}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Total:</span>
          <span className="text-xs font-semibold text-primary">
            {totalWeek}/{totalLimit}
          </span>
        </div>
      </div>
    </div>
  )
}
