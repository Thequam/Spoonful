"use client"

import type React from "react"

import { useState, useRef } from "react"
import { TimeSlot } from "./time-slot"
import { TIME_SLOTS } from "@/lib/types"
import { format } from "date-fns"
import { formatDateForDB } from "@/lib/date-utils"
import { getSpoonLabel } from "@/lib/energy-utils"
import { AlertTriangle } from "lucide-react"
import type { TimetableEntry } from "@/lib/types"

interface DayViewProps {
  date: Date
  entries: TimetableEntry[]
  dailyLimit: number
  onSlotClick: (date: Date, time: string) => void
  onDropActivity?: (date: Date, time: string, activityName: string, spoons: number) => void
  onMoveActivity?: (fromDate: Date, fromTime: string, toDate: Date, toTime: string) => void
}

export function DayView({ date, entries, dailyLimit, onSlotClick, onDropActivity, onMoveActivity }: DayViewProps) {
  const dateStr = formatDateForDB(date)
  const dayEntries = entries.filter((entry) => entry.date === dateStr)
  const totalSpoons = dayEntries.reduce((sum, entry) => sum + entry.spoons, 0)
  const isOverLimit = totalSpoons > dailyLimit
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
      <div className="border-2 border-border rounded-lg overflow-hidden bg-background shadow-sm">
        <div className="border-b-2 border-border bg-background p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{format(date, "EEEE, MMMM d, yyyy")}</h2>
              <div
                className={`text-sm mt-1 ${isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground"}`}
              >
                {getSpoonLabel(totalSpoons)} used
                {isOverLimit && (
                  <span className="inline-flex items-center gap-1 ml-2">
                    <AlertTriangle className="h-3 w-3" />
                    Over limit
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Daily limit: {getSpoonLabel(dailyLimit)}</div>
          </div>
        </div>

        <div className="grid grid-cols-[80px_1fr]">
          <div className="bg-background">
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot.time}
                className="h-[60px] border-b border-r-2 border-border flex items-center justify-center px-2"
              >
                <span className="text-sm font-medium text-muted-foreground">{slot.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-card">
            {TIME_SLOTS.map((slot) => {
              const isDragOver = dragOverSlot === slot.time

              return (
                <TimeSlot
                  key={slot.time}
                  date={date}
                  time={slot.time}
                  activity={getActivity(slot.time)}
                  onClick={() => onSlotClick(date, slot.time)}
                  onDragOver={(e) => handleDragOver(e, slot.time)}
                  onDrop={(e) => handleDrop(e, slot.time)}
                  onDragStart={(e) => handleDragStart(e, slot.time)}
                  onDragEnd={handleDragEnd}
                  isDragOver={isDragOver}
                  isDuplicateMode={isDuplicateMode}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
