"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChevronDown } from "lucide-react"
import { getSpoonColor } from "@/lib/energy-utils"
import type { Activity } from "@/lib/types"

interface DragActivitiesPanelProps {
  onDragStart?: (activity: Activity) => void
  onDragEnd?: () => void
  isInSidebar?: boolean
  onTouchDragStart?: (activity: Activity, element: HTMLElement) => void
  onTouchDragMove?: (x: number, y: number) => void
  onTouchDragEnd?: (x: number, y: number, activity: Activity) => void
}

const SPOON_LEVELS = [
  { spoons: 5, label: "Very High Energy", shortLabel: "5 Spoons" },
  { spoons: 4, label: "High Energy", shortLabel: "4 Spoons" },
  { spoons: 3, label: "Medium Energy", shortLabel: "3 Spoons" },
  { spoons: 2, label: "Low Energy", shortLabel: "2 Spoons" },
  { spoons: 1, label: "Very Low Energy", shortLabel: "1 Spoon" },
  { spoons: 0, label: "Recharge", shortLabel: "0 Spoons" },
]

export function DragActivitiesPanel({
  onDragStart,
  onDragEnd,
  isInSidebar = false,
  onTouchDragStart,
  onTouchDragMove,
  onTouchDragEnd,
}: DragActivitiesPanelProps) {
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5]))
  const touchDragRef = useRef<{ activity: Activity; startX: number; startY: number } | null>(null)
  const dragCloneRef = useRef<HTMLElement | null>(null)

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
        .order("spoons", { ascending: false })
        .order("name", { ascending: true })

      if (data) {
        setActivities(data)
      }
    }

    loadActivities()
  }, [supabase])

  const handleDragStart = (e: React.DragEvent, activity: Activity) => {
    e.dataTransfer.effectAllowed = "copy"
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        name: activity.name,
        spoons: activity.spoons,
      }),
    )
    onDragStart?.(activity)
  }

  const handleDragEnd = () => {
    onDragEnd?.()
  }

  const handleTouchStart = (e: React.TouchEvent, activity: Activity) => {
    const touch = e.touches[0]
    touchDragRef.current = {
      activity,
      startX: touch.clientX,
      startY: touch.clientY,
    }

    const target = e.currentTarget as HTMLElement
    const clone = target.cloneNode(true) as HTMLElement
    clone.style.position = "fixed"
    clone.style.left = `${touch.clientX - 40}px`
    clone.style.top = `${touch.clientY - 20}px`
    clone.style.width = `${target.offsetWidth}px`
    clone.style.zIndex = "9999"
    clone.style.opacity = "0.9"
    clone.style.pointerEvents = "none"
    clone.style.transform = "scale(1.05)"
    clone.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
    document.body.appendChild(clone)
    dragCloneRef.current = clone

    onDragStart?.(activity)
    onTouchDragStart?.(activity, target)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDragRef.current || !dragCloneRef.current) return

    e.preventDefault()
    const touch = e.touches[0]

    dragCloneRef.current.style.left = `${touch.clientX - 40}px`
    dragCloneRef.current.style.top = `${touch.clientY - 20}px`

    onTouchDragMove?.(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchDragRef.current) return

    const touch = e.changedTouches[0]
    const activity = touchDragRef.current.activity

    if (dragCloneRef.current) {
      document.body.removeChild(dragCloneRef.current)
      dragCloneRef.current = null
    }

    onTouchDragEnd?.(touch.clientX, touch.clientY, activity)
    onDragEnd?.()

    touchDragRef.current = null
  }

  const toggleLevel = (spoons: number) => {
    const newExpanded = new Set(expandedLevels)
    if (newExpanded.has(spoons)) {
      newExpanded.delete(spoons)
    } else {
      newExpanded.add(spoons)
    }
    setExpandedLevels(newExpanded)
  }

  const getEnergyColorClass = (spoons: number) => {
    switch (spoons) {
      case 5:
        return "text-[var(--color-energy-extreme)]"
      case 4:
        return "text-[var(--color-energy-very-high)]"
      case 3:
        return "text-[var(--color-energy-high)]"
      case 2:
        return "text-[var(--color-energy-medium)]"
      case 1:
        return "text-[var(--color-energy-low)]"
      case 0:
        return "text-[var(--color-energy-recharge)]"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div
      className={
        isInSidebar
          ? "space-y-3"
          : "w-64 border-r border-border bg-card p-4 space-y-4 overflow-y-auto transition-all duration-300"
      }
    >
      {!isInSidebar && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Drag Activities</h3>
        </div>
      )}

      {isInSidebar && <h3 className="text-sm font-semibold text-foreground">Drag Activities</h3>}

      <div className="space-y-2.5">
        {SPOON_LEVELS.map((level) => {
          const levelActivities = activities.filter((a) => a.spoons === level.spoons)
          const isExpanded = expandedLevels.has(level.spoons)

          if (levelActivities.length === 0) return null

          return (
            <div key={level.spoons} className="rounded-lg overflow-hidden bg-card shadow-sm border border-border/50">
              <button
                onClick={() => toggleLevel(level.spoons)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/20 hover:bg-muted/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getEnergyColorClass(level.spoons).replace("text-", "bg-")}`}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-foreground">{level.label}</span>
                    <span className="text-[10px] text-muted-foreground">{level.shortLabel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                    {levelActivities.length}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="p-2.5 space-y-2 bg-card/50">
                  {levelActivities.map((activity) => {
                    const colors = getSpoonColor(activity.spoons, activity.name)
                    return (
                      <div
                        key={activity.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, activity)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, activity)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className={`${colors.bg} ${colors.fg} px-3 py-2.5 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:scale-[1.02] transition-all duration-200 border border-black/5 touch-none`}
                      >
                        <div className="text-xs font-semibold line-clamp-2 leading-tight">{activity.name}</div>
                        <div className="text-[10px] mt-1 opacity-90">
                          {activity.spoons} {activity.spoons === 1 ? "spoon" : "spoons"}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
