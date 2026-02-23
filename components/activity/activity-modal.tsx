"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2, Plus, Check, CalendarRange, Search } from "lucide-react"
import { getSpoonColor, getSpoonLabel } from "@/lib/energy-utils"
import type { Activity } from "@/lib/types"
import { format } from "date-fns"

interface ActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: Date
  time: string
  existingActivity?: {
    name: string
    spoons: number
  } | null
  onSave: (activityName: string, spoons: number) => void
  onDelete?: () => void
  onOpenBulkSchedule?: () => void
}

export function ActivityModal({
  open,
  onOpenChange,
  date,
  time,
  existingActivity,
  onSave,
  onDelete,
  onOpenBulkSchedule,
}: ActivityModalProps) {
  const supabase = createClient()
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newActivityName, setNewActivityName] = useState("")
  const [newActivitySpoons, setNewActivitySpoons] = useState<number>(2)
  const [newActivityCategory, setNewActivityCategory] = useState("")
  const [newActivityDescription, setNewActivityDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
        .order("category", { ascending: true })
        .order("name", { ascending: true })

      if (data) {
        setActivities(data)
      }
    }

    if (open) {
      loadActivities()
      if (existingActivity) {
        setSelectedActivity(existingActivity.name)
      }
    }
  }, [open, existingActivity, supabase])

  const handleSave = async () => {
    if (isCreatingNew) {
      // Create new activity first
      if (!newActivityName.trim()) return

      setIsLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("activities").insert({
        user_id: user.id,
        name: newActivityName,
        spoons: newActivitySpoons,
        category: newActivityCategory || getSpoonCategory(newActivitySpoons),
        description: newActivityDescription || null,
        is_default: false,
      })

      if (error) {
        console.error("[v0] Error creating activity:", error)
        setIsLoading(false)
        return
      }

      onSave(newActivityName, newActivitySpoons)
      setIsLoading(false)
      onOpenChange(false)
      resetForm()
    } else {
      // Use existing activity
      if (!selectedActivity) return

      const activity = activities.find((a) => a.name === selectedActivity)
      if (activity) {
        onSave(activity.name, activity.spoons)
        onOpenChange(false)
        resetForm()
      }
    }
  }

  const handleDeleteActivity = async (activityId: string, isDefault: boolean) => {
    if (isDefault) return // Cannot delete default activities

    const { error } = await supabase.from("activities").delete().eq("id", activityId)

    if (!error) {
      setActivities(activities.filter((a) => a.id !== activityId))
    }
  }

  const resetForm = () => {
    setSelectedActivity("")
    setIsCreatingNew(false)
    setNewActivityName("")
    setNewActivitySpoons(2)
    setNewActivityCategory("")
    setNewActivityDescription("")
    setSearchQuery("")
  }

  const getSpoonCategory = (spoons: number): string => {
    switch (spoons) {
      case 5:
        return "Very High Energy"
      case 4:
        return "High Energy"
      case 3:
        return "Medium Energy"
      case 2:
        return "Low Energy"
      case 1:
        return "Very Low Energy"
      case 0:
        return "Recharging"
      default:
        return "Unknown"
    }
  }

  // Filter activities based on search query
  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedActivities = filteredActivities.reduce(
    (acc, activity) => {
      const spoonKey = activity.spoons.toString()
      if (!acc[spoonKey]) {
        acc[spoonKey] = []
      }
      acc[spoonKey].push(activity)
      return acc
    },
    {} as Record<string, Activity[]>,
  )

  // Sort activities within each group by name
  Object.keys(groupedActivities).forEach((key) => {
    groupedActivities[key].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Define energy levels in descending order (5 → 0)
  const energyLevels = [
    { spoons: 5, label: "Very High Energy", category: "Very High Energy" },
    { spoons: 4, label: "High Energy", category: "High Energy" },
    { spoons: 3, label: "Medium Energy", category: "Medium Energy" },
    { spoons: 2, label: "Low Energy", category: "Low Energy" },
    { spoons: 1, label: "Very Low Energy", category: "Very Low Energy" },
    { spoons: 0, label: "Recharge", category: "Recharging" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[383px] max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg">{existingActivity ? "Edit Activity" : "Add Activity"}</DialogTitle>
          <DialogDescription className="text-sm">
            {format(date, "EEEE, MMMM d, yyyy")} at {time}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 flex-1 overflow-hidden flex flex-col">
          {!isCreatingNew ? (
            <>
              <div className="space-y-1.5 flex-1 flex flex-col overflow-hidden">
                <Label className="text-sm flex-shrink-0">Select Activity</Label>
                <div className="relative flex-shrink-0">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                <div className="border rounded-md flex-1 overflow-y-auto scrollbar-hide bg-card">
                  <Accordion type="multiple" className="w-full">
                    {energyLevels.map((level) => {
                      const activitiesInLevel = groupedActivities[level.spoons.toString()] || []
                      if (activitiesInLevel.length === 0) return null

                      const colors = getSpoonColor(level.spoons)

                      return (
                        <AccordionItem
                          key={level.spoons}
                          value={`level-${level.spoons}`}
                          className="border-b last:border-b-0"
                        >
                          <AccordionTrigger className="px-3 py-2 hover:bg-card">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                              <span className="font-medium text-xs">
                                {level.label} - {level.spoons} {level.spoons === 1 ? "Spoon" : "Spoons"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({activitiesInLevel.length} {activitiesInLevel.length === 1 ? "activity" : "activities"}
                                )
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-3 pb-1.5">
                            <div className="space-y-0.5">
                              {activitiesInLevel.map((activity) => {
                                const activityTextColor =
                                  activity.spoons === 5 || activity.spoons === 4 ? "text-white" : "text-foreground"
                                const spoonTextColor =
                                  activity.spoons === 5 || activity.spoons === 4
                                    ? "text-white"
                                    : activity.spoons === 1 || activity.spoons === 0
                                      ? "text-foreground"
                                      : "text-muted-foreground"

                                return (
                                  <div
                                    key={activity.id}
                                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${colors.bg} bg-opacity-20 hover:bg-opacity-30 border ${
                                      selectedActivity === activity.name
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent"
                                    }`}
                                    onClick={() => setSelectedActivity(activity.name)}
                                  >
                                    <div className="flex items-center gap-1.5 flex-1">
                                      {selectedActivity === activity.name && <Check className="h-3.5 w-3.5 text-primary" />}
                                      <div className="flex items-center gap-1.5">
                                        <span className={`text-xs font-medium ${activityTextColor}`}>
                                          {activity.name}
                                        </span>
                                        <span className={`text-[10px] ${spoonTextColor}`}>
                                          - {activity.spoons} {activity.spoons === 1 ? "Spoon" : "Spoons"}
                                        </span>
                                      </div>
                                    </div>
                                    {!activity.is_default && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteActivity(activity.id, activity.is_default)
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3 text-destructive" />
                                      </Button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </div>
              </div>

              <div className="flex-shrink-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="bg-transparent h-9 text-sm" onClick={() => setIsCreatingNew(true)}>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New Activity
                  </Button>

                  {onOpenBulkSchedule && (
                    <Button
                      variant="outline"
                      className="bg-transparent h-9 text-sm"
                      onClick={() => {
                        onOpenChange(false)
                        onOpenBulkSchedule()
                      }}
                    >
                      <CalendarRange className="h-3.5 w-3.5 mr-1" />
                      Bulk Schedule
                    </Button>
                  )}
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isLoading || !selectedActivity}
                  className="w-full h-9 text-sm"
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-2">
                <div className="space-y-1.5">
                  <Label htmlFor="activity-name" className="text-sm">Activity Name</Label>
                  <Input
                    id="activity-name"
                    value={newActivityName}
                    onChange={(e) => setNewActivityName(e.target.value)}
                    placeholder="e.g., Morning Walk"
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="spoons" className="text-sm">Energy Level (Spoons)</Label>
                  <Select
                    value={newActivitySpoons.toString()}
                    onValueChange={(value) => setNewActivitySpoons(Number.parseInt(value))}
                  >
                    <SelectTrigger id="spoons">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5].map((spoons) => {
                        const colors = getSpoonColor(spoons)
                        return (
                          <SelectItem key={spoons} value={spoons.toString()}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded ${colors.bg}`} />
                              <span>
                                {getSpoonLabel(spoons)} - {getSpoonCategory(spoons)}
                              </span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-sm">Category (Optional)</Label>
                  <Input
                    id="category"
                    value={newActivityCategory}
                    onChange={(e) => setNewActivityCategory(e.target.value)}
                    placeholder="Auto-filled based on spoons"
                    className="h-9 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newActivityDescription}
                    onChange={(e) => setNewActivityDescription(e.target.value)}
                    placeholder="Add notes about this activity"
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex-shrink-0 space-y-2">
                <Button variant="outline" className="w-full bg-transparent h-9 text-sm" onClick={() => setIsCreatingNew(false)}>
                  Back to Activity List
                </Button>

                <div className="flex gap-2">
                  {existingActivity && onDelete && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        onDelete()
                        onOpenChange(false)
                        resetForm()
                      }}
                      className="flex-1 h-9 text-sm"
                    >
                      Remove
                    </Button>
                  )}
                  <Button
                    onClick={handleSave}
                    disabled={isLoading || !newActivityName.trim()}
                    className="flex-1 h-9 text-sm"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
