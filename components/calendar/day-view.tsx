"use client"

import type React from "react"
import { useState, useRef } from "react"
import { TimeSlot } from "./time-slot"
import { TIME_SLOTS } from "@/lib/types"
import { format } from "date-fns"
import { formatDateForDB, isToday } from "@/lib/date-utils"
import { AlertTriangle } from "lucide-react"
import type { TimetableEntry } from "@/lib/types"

interface DayViewProps {
  date: Date
  entries: TimetableEntry[]
  dailyLimit: number
  onSlotClick: (date: Date, time: string) => void
  onDropActivity?: (date: Date, time: string, activityName: string, spoons: number) => void
  onMoveActivity?: (fromDate: Date, fromTime: string, toDate: Date, toTime: string) => void
  onDeleteActivity?: (date: Date, time: string) => void
  touchDragOverSlot?: string | null
}

export function DayView({
  date,
  entries,
  dailyLimit,
  onSlotClick,
  onDropActivity,
  onMoveActivity,
  onDeleteActivity,
  touchDragOverSlot,
}: DayViewProps) {
  const dateStr = formatDateForDB(date)
  const dayEntries = entries.filter((entry) => entry.date === dateStr)
  const totalSpoons = dayEntries.reduce((sum, entry) => sum + entry.spoons, 0)
  const isOverLimit = totalSpoons > dailyLimit
  const progressPercent = Math.min((totalSpoons / dailyLimit) * 100, 100)
  const isTodayDate = isToday(date)
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null)
  const [draggedSlot, setDraggedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [draggedActivity, setDraggedActivity] = useState<{ name: string; spoons: number } | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const duplicatedSlots = useRef<Set<string>>(new Set())

  const getActivity = (time: string) => {
    const entry = dayEntries.find((e) => e.timeslot === time)
    return entry ? { name: entry.activity_name, spoons: entry.spoons } : null
  }

  const handleDragOver = (e: React.DragEvent, time: string) => {
    e.preventDefault()
    setDragOverSlot(time)

    if (isDuplicateMode && draggedActivity && !getActivity(time)) {
      if (!duplicatedSlots.current.has(time)) {
        duplicatedSlots.current.add(time)
        onDropActivity?.(date, time, draggedActivity.name, draggedActivity.spoons)
      }
    }
  }

  const handleDragLeave = () => {
    setDragOverSlot(null)
  }

  const handleDrop = (e: React.DragEvent, time: string) => {
    e.preventDefault()
    setDragOverSlot(null)

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setIsDuplicateMode(false)
    setDraggedActivity(null)
    duplicatedSlots.current.clear()

    if (draggedSlot && !isDuplicateMode) {
      onMoveActivity?.(draggedSlot.date, draggedSlot.time, date, time)
      setDraggedSlot(null)
      return
    }

    const activityData = e.dataTransfer.getData("application/json")
    if (activityData) {
      try {
        const activity = JSON.parse(activityData)
        onDropActivity?.(date, time, activity.name, activity.spoons)
      } catch (error) {
        console.error("[v0] Error parsing activity data:", error)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, time: string) => {
    const activity = getActivity(time)
    if (activity) {
      setDraggedSlot({ date, time })
      setDraggedActivity(activity)
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", activity.name)

      longPressTimer.current = setTimeout(() => {
        console.log("[v0] Long press detected - entering duplicate mode")
        setIsDuplicateMode(true)
      }, 1500)
    }
  }

  const handleDragEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setDraggedSlot(null)
    setDraggedActivity(null)
    setIsDuplicateMode(false)
    duplicatedSlots.current.clear()
    setDragOverSlot(null)
  }

  return (
    <div className="w-full">
      <div className="border border-border/40 rounded-lg overflow-hidden bg-background shadow-sm">
        <div
          className={`h-[85px] border-b border-border/40 flex flex-col items-center justify-center py-2 px-2 bg-background ${
            isTodayDate ? "bg-primary/5 dark:bg-primary/10" : ""
          }`}
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

          <div className="w-[95%] mt-1.5">
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

        <div className="grid grid-cols-[80px_1fr]">
          <div className="bg-background">
            {TIME_SLOTS.map((slot, index) => (
              <div
                key={slot.time}
                className="h-[60px] border-b border-r border-border/40 flex items-center justify-center px-2"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium text-muted-foreground/70">{slot.time}</span>
                  <span className="text-xs font-medium text-muted-foreground/70">
                    {TIME_SLOTS[index + 1]?.time || "22:00"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card">
            {TIME_SLOTS.map((slot) => {
              const slotKey = `${dateStr}-${slot.time}`
              const isDragOver = dragOverSlot === slot.time || touchDragOverSlot === slotKey

              return (
                <TimeSlot
                  key={slot.time}
                  date={date}
                  time={slot.time}
                  activity={getActivity(slot.time)}
                  onClick={() => onSlotClick(date, slot.time)}
                  onDelete={() => onDeleteActivity?.(date, slot.time)}
                  onDragOver={(e) => handleDragOver(e, slot.time)}
                  onDrop={(e) => handleDrop(e, slot.time)}
                  onDragStart={(e) => handleDragStart(e, slot.time)}
                  onDragEnd={handleDragEnd}
                  isDragOver={isDragOver}
                  isDuplicateMode={isDuplicateMode}
                  slotDate={dateStr}
                  slotTime={slot.time}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
