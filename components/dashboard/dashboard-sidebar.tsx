"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EnergyLegend } from "./energy-legend"
import { DailyEnergyGrid } from "./daily-energy-grid"
import { DragActivitiesPanel } from "@/components/activity/drag-activities-panel"
import type { Activity } from "@/lib/types"

interface DashboardSidebarProps {
  dailyLimit: number
  weekdayLimit: number
  weekendLimit: number
  dailyTotals: number[]
  onDragStart: (activity: Activity | null) => void
  onDragEnd: () => void
}

export function DashboardSidebar({
  dailyLimit,
  weekdayLimit,
  weekendLimit,
  dailyTotals,
  onDragStart,
  onDragEnd,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Calculate weekday and weekend totals
  const weekdayTotal = dailyTotals.slice(0, 5).reduce((sum, val) => sum + val, 0)
  const weekendTotal = dailyTotals.slice(5, 7).reduce((sum, val) => sum + val, 0)

  if (isCollapsed) {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
        <Button variant="outline" size="sm" onClick={() => setIsCollapsed(false)} className="rounded-l-none shadow-md">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-80 h-screen border-r border-border bg-[#f5f5f5] dark:bg-[#1a1a1a] flex flex-col transition-all duration-300">
      <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(true)} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Daily Limit Button */}
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-6 text-base font-semibold shadow-sm mb-4">
            Daily Limit: {dailyLimit} spoons
          </Button>

          {/* Daily Energy Usage integrated in same card */}
          <DailyEnergyGrid
            dailyTotals={dailyTotals}
            dailyLimit={dailyLimit}
            weekdayTotal={weekdayTotal}
            weekdayLimit={weekdayLimit}
            weekendTotal={weekendTotal}
            weekendLimit={weekendLimit}
          />
        </div>

        {/* Energy Legend */}
        <EnergyLegend />

        <div className="bg-card rounded-lg p-4 shadow-sm">
          <DragActivitiesPanel onDragStart={onDragStart} onDragEnd={onDragEnd} isInSidebar={true} />
        </div>
      </div>
    </div>
  )
}
