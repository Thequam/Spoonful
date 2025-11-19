"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getSpoonColor, getSpoonCategory } from "@/lib/energy-utils"

export function EnergyLegend() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const spoonLevels = [
    { spoons: 5, examples: ["Running Long Distance", "Power Gym Session", "Sports Match"] },
    { spoons: 4, examples: ["Gym/Exercise", "Heavy Socialising", "Dancing"] },
    { spoons: 3, examples: ["Laptop Work", "Conversations/Meetings", "Shopping"] },
    { spoons: 2, examples: ["House Chores", "Light Cooking", "Relaxing/TV"] },
    { spoons: 1, examples: ["Reading", "Short Phone Call", "Gentle Stretching"] },
    { spoons: 0, examples: ["Sleep", "Rest in Bed", "Meditation"] },
  ]

  return (
    <div className="border border-border rounded-lg bg-card shadow-sm">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">Energy Legend</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {spoonLevels.map(({ spoons, examples }) => {
            const colors = getSpoonColor(spoons)
            return (
              <div key={spoons} className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colors.bg}`} />
                  <span className="text-xs font-semibold">
                    {spoons} {spoons === 1 ? "Spoon" : "Spoons"} - {getSpoonCategory(spoons)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground ml-6">{examples.join(", ")}</div>
              </div>
            )
          })}

          <div className="pt-3 border-t border-border">
            <h4 className="text-xs font-semibold mb-2">Spoons Theory</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Spoon Theory is a metaphor used to describe the limited energy available to people with chronic
              illness. Each "spoon" represents a unit of energy needed to complete daily tasks. Plan your activities to
              stay within your energy limits.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
