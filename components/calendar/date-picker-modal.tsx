"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addYears,
  subYears,
  isSameDay,
  isSameMonth,
  isSameWeek,
} from "date-fns"
import { getWeekStart } from "@/lib/date-utils"

interface DatePickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentWeekStart: Date
  onSelectDate: (date: Date) => void
}

export function DatePickerModal({ open, onOpenChange, currentWeekStart, onSelectDate }: DatePickerModalProps) {
  const [viewDate, setViewDate] = useState(new Date())
  const today = new Date()

  const handlePrevYear = () => setViewDate(subYears(viewDate, 1))
  const handleNextYear = () => setViewDate(addYears(viewDate, 1))
  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1))
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1))

  const handleSelectDate = (date: Date) => {
    const weekStart = getWeekStart(date)
    onSelectDate(weekStart)
    onOpenChange(false)
  }

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(viewDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const days: Date[] = []
    let currentDay = calendarStart

    while (currentDay <= calendarEnd) {
      days.push(currentDay)
      currentDay = addDays(currentDay, 1)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const weekDayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const isInCurrentWeek = (date: Date) => {
    return isSameWeek(date, currentWeekStart, { weekStartsOn: 1 })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-foreground">Select Date</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 pt-2">
          {/* Year Navigation */}
          <div className="flex items-center justify-between mb-2">
            <Button variant="outline" size="icon" onClick={handlePrevYear} className="h-8 w-8 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-foreground">{format(viewDate, "yyyy")}</span>
            <Button variant="outline" size="icon" onClick={handleNextYear} className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-8 w-8 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-foreground">{format(viewDate, "MMMM yyyy")}</span>
            <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDayHeaders.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isCurrentMonth = isSameMonth(day, viewDate)
              const isCurrentDay = isSameDay(day, today)
              const isSelectedWeek = isInCurrentWeek(day)

              return (
                <button
                  key={index}
                  onClick={() => handleSelectDate(day)}
                  className={`
                    h-9 w-full rounded-md text-sm font-medium transition-colors
                    ${!isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
                    ${isCurrentDay ? "bg-primary text-primary-foreground" : ""}
                    ${isSelectedWeek && !isCurrentDay ? "bg-primary/20" : ""}
                    ${!isCurrentDay && !isSelectedWeek ? "hover:bg-muted" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/20" />
              <span className="text-xs text-muted-foreground">Current Week</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
