"use client"

import type React from "react"

import { useState, useRef } from "react"
import { TimeColumn } from "./time-column"
import { DayHeader } from "./day-header"
import { TimeSlot } from "./time-slot"
import { TIME_SLOTS } from "@/lib/types"
import { getWeekDays, formatDateForDB } from "@/lib/date-utils"
import type { TimetableEntry } from "@/lib/types"

interface WeekViewProps {
  weekStart: Date
  entries: TimetableEntry[]
  dailyLimit: number
  onSlotClick: (date: Date, time: string) => void
  onDateClick?: (date: Date) => void
  onDropActivity?: (date: Date, time: string, activityName: string, spoons: number) => void
  onMoveActivity?: (fromDate: Date, fromTime: string, toDate: Date, toTime: string) => void
}

export function WeekView({
  weekStart,
  entries,
  dailyLimit,
  onSlotClick,
  onDateClick,
  onDropActivity,
  onMoveActivity,
}: WeekViewProps) {
  const weekDays = getWeekDays(weekStart)
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null)
  const [draggedSlot, setDraggedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [draggedActivity, setDraggedActivity] = useState<{ name: string; spoons: number } | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const duplicatedSlots = useRef<Set<string>>(new Set())

  const dailyTotals = weekDays.map((day) => {
    const dayStr = formatDateForDB(day)
    return entries.filter((entry) => entry.date === dayStr).reduce((sum, entry) => sum + entry.spoons, 0)
  })

  const getActivity = (date: Date, time: string) => {
    const dateStr = formatDateForDB(date)
    const entry = entries.find((e) => e.date === dateStr && e.timeslot === time)
    return entry ? { name: entry.activity_name, spoons: entry.spoons } : null
  }

  const handleDragOver = (e: React.DragEvent, date: Date, time: string) => {
    e.preventDefault()
    const slotKey = `${formatDateForDB(date)}-${time}`
    setDragOverSlot(slotKey)

    if (isDuplicateMode && draggedActivity && !getActivity(date, time)) {
      if (!duplicatedSlots.current.has(slotKey)) {
        duplicatedSlots.current.add(slotKey)
        onDropActivity?.(date, time, draggedActivity.name, draggedActivity.spoons)
      }
    }
  }

  const handleDragLeave = () => {
    setDragOverSlot(null)
  }

  const handleDrop = (e: React.DragEvent, date: Date, time: string) => {
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

  const handleDragStart = (e: React.DragEvent, date: Date, time: string) => {
    const activity = getActivity(date, time)
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
    <div className="w-full overflow-auto scrollbar-hide">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-2 border-border rounded-lg overflow-hidden bg-background shadow-sm">
          {/* Time column */}
          <TimeColumn />

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={day.toISOString()} className="flex flex-col bg-card">
              {/* Day header */}
              <DayHeader
                date={day}
                totalSpoons={dailyTotals[dayIndex]}
                dailyLimit={dailyLimit}
                onClick={() => onDateClick?.(day)}
              />

              {/* Time slots */}
              {TIME_SLOTS.map((slot) => {
                const slotKey = `${formatDateForDB(day)}-${slot.time}`
                const isDragOver = dragOverSlot === slotKey

                return (
                  <TimeSlot
                    key={slotKey}
                    date={day}
                    time={slot.time}
                    activity={getActivity(day, slot.time)}
                    onClick={() => onSlotClick(day, slot.time)}
                    onDragOver={(e) => handleDragOver(e, day, slot.time)}
                    onDrop={(e) => handleDrop(e, day, slot.time)}
                    onDragStart={(e) => handleDragStart(e, day, slot.time)}
                    onDragEnd={handleDragEnd}
                    isDragOver={isDragOver}
                    isDuplicateMode={isDuplicateMode}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
