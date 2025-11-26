"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getSpoonColor } from "@/lib/energy-utils"
import { TIME_SLOTS, DAYS } from "@/lib/types"
import type { Activity } from "@/lib/types"

interface BulkScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  weekStart: Date
  onSave: (slots: Array<{ date: Date; time: string; activityName: string; spoons: number }>) => void
}

export function BulkScheduleModal({ open, onOpenChange, weekStart, onSave }: BulkScheduleModalProps) {
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set())
  const [startTime, setStartTime] = useState<string>("")
  const [duration, setDuration] = useState<string>("")

  const durationOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String((i + 1) * 2),
    label: `${(i + 1) * 2} Hours`,
  }))

  useEffect(() => {
    async function loadActivities() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .eq("spoons", 0)
        .order("name", { ascending: true })

      if (data) {
        setActivities(data)
      }
    }

    if (open) {
      loadActivities()
      setSelectedSlots(new Set())
      setStartTime("")
      setDuration("")
    }
  }, [open, supabase])

  const toggleSlot = (day: number, time: string) => {
    const key = `${day}-${time}`
    const newSlots = new Set(selectedSlots)
    if (newSlots.has(key)) {
      newSlots.delete(key)
    } else {
      newSlots.add(key)
    }
    setSelectedSlots(newSlots)
  }

  const handleSelectAll = () => {
    if (!startTime || !duration) return

    const startIndex = TIME_SLOTS.findIndex((slot) => slot.time === startTime)
    if (startIndex === -1) return

    const durationHours = Number.parseInt(duration)
    const slotsToSelect = durationHours / 2

    const newSlots = new Set(selectedSlots)

    for (let dayIndex = 0; dayIndex < DAYS.length; dayIndex++) {
      for (let i = 0; i < slotsToSelect; i++) {
        const slotIndex = (startIndex + i) % TIME_SLOTS.length
        const slotTime = TIME_SLOTS[slotIndex].time
        const key = `${dayIndex}-${slotTime}`
        newSlots.add(key)
      }
    }

    setSelectedSlots(newSlots)
  }

  const handleSave = () => {
    if (!selectedActivity || selectedSlots.size === 0) return

    const activity = activities.find((a) => a.name === selectedActivity)
    if (!activity) return

    const slots = Array.from(selectedSlots).map((key) => {
      const [dayStr, time] = key.split("-")
      const day = Number.parseInt(dayStr)
      const date = new Date(weekStart)
      date.setDate(date.getDate() + day)

      return {
        date,
        time,
        activityName: activity.name,
        spoons: activity.spoons,
      }
    })

    onSave(slots)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Schedule Activity</DialogTitle>
          <DialogDescription>Select multiple time slots to schedule the same activity</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Activity (0 Spoons Only)</Label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a recharging activity" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => {
                  const colors = getSpoonColor(activity.spoons, activity.name)
                  return (
                    <SelectItem key={activity.id} value={activity.name}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${colors.bg}`} />
                        <span>{activity.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-3">
            <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={!startTime || !duration}>
              Select All
            </Button>

            <div className="flex-1 space-y-1">
              <Label className="text-xs">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Start Time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot.time} value={slot.time}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1">
              <Label className="text-xs">Duration in Hours</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Duration in Hours" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Time Slots</Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-8 bg-muted">
                <div className="p-2 text-xs font-semibold border-r border-border">Time</div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-xs font-semibold text-center border-r border-border last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>
              {TIME_SLOTS.map((slot) => (
                <div key={slot.time} className="grid grid-cols-8 border-t border-border">
                  <div className="p-2 text-xs text-muted-foreground border-r border-border flex items-center">
                    {slot.label}
                  </div>
                  {DAYS.map((_, dayIndex) => {
                    const key = `${dayIndex}-${slot.time}`
                    const isSelected = selectedSlots.has(key)
                    return (
                      <div
                        key={key}
                        className="p-2 flex items-center justify-center border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleSlot(dayIndex, slot.time)}
                      >
                        <Checkbox checked={isSelected} />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{selectedSlots.size} slots selected</span>
            <Button variant="outline" size="sm" onClick={() => setSelectedSlots(new Set())}>
              Clear All
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!selectedActivity || selectedSlots.size === 0} className="flex-1">
              Schedule {selectedSlots.size} Slots
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
