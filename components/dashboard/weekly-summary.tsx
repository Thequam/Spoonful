"use client"

import { AlertTriangle } from "lucide-react"

interface WeeklySummaryProps {
  weekdayTotal: number
  weekdayLimit: number
  weekendTotal: number
  weekendLimit: number
}

export function WeeklySummary({ weekdayTotal, weekdayLimit, weekendTotal, weekendLimit }: WeeklySummaryProps) {
  const isWeekdayOver = weekdayTotal > weekdayLimit
  const isWeekendOver = weekendTotal > weekendLimit

  return (
    <div className="border border-border rounded-lg bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Weekly Summary</h3>
      </div>

      <div className="p-4 space-y-3">
        {/* Weekday Summary */}
        <div
          className={`p-3 rounded-md border ${
            isWeekdayOver ? "border-destructive bg-destructive/5" : "border-border bg-muted/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Weekdays (Mon-Fri)</span>
            {isWeekdayOver && <AlertTriangle className="h-3 w-3 text-destructive" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${isWeekdayOver ? "text-destructive" : ""}`}>{weekdayTotal}</span>
            <span className="text-xs text-muted-foreground">/ {weekdayLimit} spoons</span>
          </div>
          {isWeekdayOver && (
            <div className="text-xs text-destructive mt-1">Over by {weekdayTotal - weekdayLimit} spoons</div>
          )}
        </div>

        {/* Weekend Summary */}
        <div
          className={`p-3 rounded-md border ${
            isWeekendOver ? "border-destructive bg-destructive/5" : "border-border bg-muted/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Weekend (Sat-Sun)</span>
            {isWeekendOver && <AlertTriangle className="h-3 w-3 text-destructive" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${isWeekendOver ? "text-destructive" : ""}`}>{weekendTotal}</span>
            <span className="text-xs text-muted-foreground">/ {weekendLimit} spoons</span>
          </div>
          {isWeekendOver && (
            <div className="text-xs text-destructive mt-1">Over by {weekendTotal - weekendLimit} spoons</div>
          )}
        </div>

        {/* Total Week */}
        <div className="p-3 rounded-md border border-border bg-primary/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Total Week</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{weekdayTotal + weekendTotal}</span>
            <span className="text-xs text-muted-foreground">/ {weekdayLimit + weekendLimit} spoons</span>
          </div>
        </div>
      </div>
    </div>
  )
}
