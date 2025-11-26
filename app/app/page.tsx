"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { ActivityModal } from "@/components/activity/activity-modal"
import { BulkScheduleModal } from "@/components/activity/bulk-schedule-modal"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { SettingsModal } from "@/components/settings/settings-modal"
import { LoadPreviousWeekModal } from "@/components/settings/load-previous-week-modal"
import { DatePickerModal } from "@/components/calendar/date-picker-modal" // Import the new DatePickerModal component
import { ThemeToggle } from "@/components/settings/theme-toggle"
import {
  getWeekStart,
  getNextWeek,
  getPreviousWeek,
  formatDateForDB,
  getWeekDays,
  getPreviousWeek as getPrevWeekStart,
} from "@/lib/date-utils"
import { DEFAULT_ACTIVITIES } from "@/lib/default-activities"
import type { TimetableEntry, Profile, Activity } from "@/lib/types"
import { DataPersistence } from "@/lib/data-persistence"
import { HistoryManager } from "@/lib/history-manager"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, RefreshCw, Settings, Download, Save, Undo, Redo, Menu } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function AppPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const [view, setView] = useState<"week" | "day">("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()))
  const [entries, setEntries] = useState<TimetableEntry[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const dataPersistenceRef = useRef<DataPersistence | null>(null)
  const historyManagerRef = useRef<HistoryManager | null>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [activityModalOpen, setActivityModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<{ name: string; spoons: number } | null>(null)

  const [bulkScheduleOpen, setBulkScheduleOpen] = useState(false)

  const [settingsOpen, setSettingsOpen] = useState(false)

  const [loadPreviousWeekOpen, setLoadPreviousWeekOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false) // Add state for date picker modal

  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // Added state for mobile menu

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserId(user.id)
      dataPersistenceRef.current = new DataPersistence(user.id)

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      const { data: activities } = await supabase.from("activities").select("*").eq("user_id", user.id)

      if (!activities || activities.length === 0) {
        // No activities at all - seed all defaults
        const defaultActivities = DEFAULT_ACTIVITIES.map((activity) => ({
          user_id: user.id,
          name: activity.name,
          spoons: activity.spoons,
          category: activity.category,
          description: activity.description,
          is_default: true,
        }))

        await supabase.from("activities").insert(defaultActivities)
      } else {
        // Check for missing default activities (e.g., new extreme energy activities)
        const existingActivityNames = new Set(activities.map((a) => a.name))
        const missingActivities = DEFAULT_ACTIVITIES.filter(
          (defaultActivity) => !existingActivityNames.has(defaultActivity.name),
        )

        if (missingActivities.length > 0) {
          const activitiesToAdd = missingActivities.map((activity) => ({
            user_id: user.id,
            name: activity.name,
            spoons: activity.spoons,
            category: activity.category,
            description: activity.description,
            is_default: true,
          }))

          await supabase.from("activities").insert(activitiesToAdd)
          console.log(`[v0] Added ${missingActivities.length} missing default activities`)
        }
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  useEffect(() => {
    if (!userId) return

    const weekKey = formatDateForDB(weekStart)
    historyManagerRef.current = new HistoryManager(weekKey)
    updateUndoRedoState()
  }, [weekStart, userId])

  useEffect(() => {
    async function loadEntries() {
      if (!dataPersistenceRef.current) return

      const weekStartStr = formatDateForDB(weekStart)
      const loadedEntries = await dataPersistenceRef.current.loadTimetableEntries(weekStartStr)

      const transformedEntries: TimetableEntry[] = loadedEntries.map((entry) => ({
        week_start: entry.week_start,
        date: entry.date,
        day_name: entry.day_name,
        timeslot: entry.timeslot,
        activity_name: entry.activity_name,
        spoons: entry.spoons,
      }))

      setEntries(transformedEntries)

      if (historyManagerRef.current) {
        historyManagerRef.current.pushState(transformedEntries)
        updateUndoRedoState()
      }
    }

    if (!isLoading && userId) {
      loadEntries()
    }
  }, [weekStart, isLoading, userId])

  useEffect(() => {
    if (!dataPersistenceRef.current || entries.length === 0) return

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await dataPersistenceRef.current?.saveTimetableEntries(entries)
        console.log("[v0] Auto-saved timetable entries")
      } catch (error) {
        console.error("[v0] Auto-save failed:", error)
      }
    }, 2000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [entries])

  const updateUndoRedoState = () => {
    if (historyManagerRef.current) {
      setCanUndo(historyManagerRef.current.canUndo())
      setCanRedo(historyManagerRef.current.canRedo())
    }
  }

  const pushToHistory = (newEntries: TimetableEntry[]) => {
    if (historyManagerRef.current) {
      historyManagerRef.current.pushState(newEntries)
      updateUndoRedoState()
    }
  }

  const calculateDailyTotals = () => {
    const weekDays = getWeekDays(weekStart)
    return weekDays.map((day) => {
      const dayStr = formatDateForDB(day)
      return entries.filter((entry) => entry.date === dayStr).reduce((sum, entry) => sum + entry.spoons, 0)
    })
  }

  const handlePrevious = () => {
    if (view === "week") {
      const newWeekStart = getPreviousWeek(weekStart)
      setWeekStart(newWeekStart)
      setCurrentDate(newWeekStart)
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 1)
      setCurrentDate(newDate)
    }
  }

  const handleNext = () => {
    if (view === "week") {
      const newWeekStart = getNextWeek(weekStart)
      setWeekStart(newWeekStart)
      setCurrentDate(newWeekStart)
    } else {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 1)
      setCurrentDate(newDate)
    }
  }

  const handleSlotClick = (date: Date, time: string) => {
    const dateStr = formatDateForDB(date)
    const existingEntry = entries.find((e) => e.date === dateStr && e.timeslot === time)

    setSelectedSlot({ date, time })
    setSelectedActivity(existingEntry ? { name: existingEntry.activity_name, spoons: existingEntry.spoons } : null)
    setActivityModalOpen(true)
  }

  const handleSaveActivity = async (activityName: string, spoons: number) => {
    if (!selectedSlot || !userId) return

    const dateStr = formatDateForDB(selectedSlot.date)
    const weekStartStr = formatDateForDB(weekStart)
    const dayName = selectedSlot.date.toLocaleDateString("en-US", { weekday: "short" })

    const existingEntry = entries.find((e) => e.date === dateStr && e.timeslot === selectedSlot.time)

    let newEntries: TimetableEntry[]

    if (existingEntry) {
      newEntries = entries.map((e) =>
        e.date === dateStr && e.timeslot === selectedSlot.time
          ? { ...e, activity_name: activityName, spoons: spoons }
          : e,
      )
    } else {
      const newEntry: TimetableEntry = {
        week_start: weekStartStr,
        date: dateStr,
        day_name: dayName,
        timeslot: selectedSlot.time,
        activity_name: activityName,
        spoons: spoons,
      }
      newEntries = [...entries, newEntry]
    }

    setEntries(newEntries)
    pushToHistory(newEntries)
  }

  const handleDeleteActivity = async () => {
    if (!selectedSlot) return

    const dateStr = formatDateForDB(selectedSlot.date)
    const newEntries = entries.filter((e) => !(e.date === dateStr && e.timeslot === selectedSlot.time))

    setEntries(newEntries)
    pushToHistory(newEntries)
  }

  const handleDeleteActivityDirect = async (date: Date, time: string) => {
    const dateStr = formatDateForDB(date)
    const newEntries = entries.filter((e) => !(e.date === dateStr && e.timeslot === time))
    setEntries(newEntries)
    pushToHistory(newEntries)
  }

  const handleDropActivity = async (date: Date, time: string, activityName: string, spoons: number) => {
    if (!userId) return

    const dateStr = formatDateForDB(date)
    const weekStartStr = formatDateForDB(weekStart)
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

    const existingEntry = entries.find((e) => e.date === dateStr && e.timeslot === time)

    let newEntries: TimetableEntry[]

    if (existingEntry) {
      newEntries = entries.map((e) =>
        e.date === dateStr && e.timeslot === time ? { ...e, activity_name: activityName, spoons: spoons } : e,
      )
    } else {
      const newEntry: TimetableEntry = {
        week_start: weekStartStr,
        date: dateStr,
        day_name: dayName,
        timeslot: time,
        activity_name: activityName,
        spoons: spoons,
      }
      newEntries = [...entries, newEntry]
    }

    setEntries(newEntries)
    pushToHistory(newEntries)
  }

  const handleMoveActivity = async (fromDate: Date, fromTime: string, toDate: Date, toTime: string) => {
    const fromDateStr = formatDateForDB(fromDate)
    const toDateStr = formatDateForDB(toDate)

    const movingEntry = entries.find((e) => e.date === fromDateStr && e.timeslot === fromTime)
    if (!movingEntry) return

    const destinationEntry = entries.find((e) => e.date === toDateStr && e.timeslot === toTime)

    let newEntries: TimetableEntry[]

    if (destinationEntry) {
      newEntries = entries.map((e) => {
        if (e.date === fromDateStr && e.timeslot === fromTime) {
          return { ...e, date: toDateStr, timeslot: toTime }
        }
        if (e.date === toDateStr && e.timeslot === toTime) {
          return { ...e, date: fromDateStr, timeslot: fromTime }
        }
        return e
      })
    } else {
      newEntries = entries.map((e) =>
        e.date === fromDateStr && e.timeslot === fromTime ? { ...e, date: toDateStr, timeslot: toTime } : e,
      )
    }

    setEntries(newEntries)
    pushToHistory(newEntries)
  }

  const handleBulkSave = async (slots: Array<{ date: Date; time: string; activityName: string; spoons: number }>) => {
    if (!userId) return

    const weekStartStr = formatDateForDB(weekStart)

    const newEntries: TimetableEntry[] = slots.map((slot) => ({
      week_start: weekStartStr,
      date: formatDateForDB(slot.date),
      day_name: slot.date.toLocaleDateString("en-US", { weekday: "short" }),
      timeslot: slot.time,
      activity_name: slot.activityName,
      spoons: slot.spoons,
    }))

    const updatedEntries = [...entries, ...newEntries]
    setEntries(updatedEntries)
    pushToHistory(updatedEntries)
  }

  const handleLoadPreviousWeek = async () => {
    if (!dataPersistenceRef.current) return

    const weekStartStr = formatDateForDB(weekStart)
    const previousEntries = await dataPersistenceRef.current.loadPreviousWeekEntries(weekStartStr)

    if (previousEntries.length === 0) {
      toast({
        title: "No previous week data",
        description: "There are no activities from the previous week to load.",
      })
      return
    }

    const nonConflictingEntries = previousEntries.filter(
      (newEntry) => !entries.some((e) => e.date === newEntry.date && e.timeslot === newEntry.timeslot),
    )

    if (nonConflictingEntries.length === 0) {
      toast({
        title: "All slots occupied",
        description: "All time slots from the previous week are already filled.",
      })
      return
    }

    const updatedEntries = [...entries, ...nonConflictingEntries]
    setEntries(updatedEntries)
    pushToHistory(updatedEntries)

    toast({
      title: "Previous week loaded",
      description: `Loaded ${nonConflictingEntries.length} activities from the previous week.`,
    })
  }

  const handleDateClick = (date: Date) => {
    setCurrentDate(date)
    setView("day")
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleRefresh = async () => {
    const newEntries: TimetableEntry[] = []
    setEntries(newEntries)
    pushToHistory(newEntries)

    toast({
      title: "Week cleared",
      description: "All activities for this week have been removed.",
    })
  }

  const handleManualSave = async () => {
    if (!dataPersistenceRef.current) return

    try {
      await dataPersistenceRef.current.saveTimetableEntries(entries)
      toast({
        title: "Saved successfully",
        description: "Your timetable has been saved.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save your timetable. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUndo = () => {
    if (!historyManagerRef.current) return

    const previousState = historyManagerRef.current.undo()
    if (previousState) {
      setEntries(previousState)
      updateUndoRedoState()
      toast({
        title: "Undo successful",
        description: "Reverted to previous state.",
      })
    }
  }

  const handleRedo = () => {
    if (!historyManagerRef.current) return

    const nextState = historyManagerRef.current.redo()
    if (nextState) {
      setEntries(nextState)
      updateUndoRedoState()
      toast({
        title: "Redo successful",
        description: "Restored next state.",
      })
    }
  }

  const handleDateSelect = (newWeekStart: Date) => {
    // Add handler for date selection from picker
    setWeekStart(newWeekStart)
    setCurrentDate(newWeekStart)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-foreground">Spoonful</h1>

              {/* Mobile/Tablet menu - shown on all screens */}
              <div className="flex items-center gap-2">
                {/* Action buttons */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="h-9 w-9 p-0 bg-background text-primary"
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="h-9 w-9 p-0 text-primary bg-background"
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleManualSave}
                  className="gap-2 bg-background text-primary"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>

                {/* Existing buttons */}
                <ThemeToggle />
                <Button
                  size="sm"
                  onClick={() => setSettingsOpen(true)}
                  className="bg-primary/90 text-primary-foreground hover:bg-primary backdrop-blur-sm shadow-sm"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Menu className="h-4 w-4 text-primary" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white border-l border-border/30 p-0">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="px-6 py-5 border-b border-border/20">
                        <SheetHeader className="space-y-1">
                          <SheetTitle className="text-xl font-semibold text-foreground">Menu</SheetTitle>
                          {profile?.display_name && (
                            <SheetDescription className="text-sm text-muted-foreground/80">
                              {profile.display_name}
                            </SheetDescription>
                          )}
                        </SheetHeader>
                      </div>

                      {/* Menu Content */}
                      <div className="flex-1 px-4 py-4 space-y-6">
                        {/* Schedule Section */}
                        <div className="space-y-1">
                          <h3 className="px-3 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-2">
                            Schedule
                          </h3>
                          <button
                            onClick={() => {
                              setLoadPreviousWeekOpen(true)
                              setMobileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                          >
                            <Download className="h-[18px] w-[18px] text-muted-foreground/70" />
                            Load Previous Week
                          </button>
                          <button
                            onClick={() => {
                              setBulkScheduleOpen(true)
                              setMobileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                          >
                            <Calendar className="h-[18px] w-[18px] text-muted-foreground/70" />
                            Bulk Schedule
                          </button>
                          <button
                            onClick={() => {
                              handleRefresh()
                              setMobileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                          >
                            <RefreshCw className="h-[18px] w-[18px] text-muted-foreground/70" />
                            Clear Week
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-border/20 mx-2" />

                        {/* Account Section */}
                        <div className="space-y-1">
                          <h3 className="px-3 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-2">
                            Account
                          </h3>
                          <button
                            onClick={() => {
                              setSettingsOpen(true)
                              setMobileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                          >
                            <Settings className="h-[18px] w-[18px] text-muted-foreground/70" />
                            Settings
                          </button>
                          <button
                            onClick={() => {
                              handleSignOut()
                              setMobileMenuOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                          >
                            <LogOut className="h-[18px] w-[18px] text-muted-foreground/70" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {profile && (
            <DashboardSidebar
              dailyLimit={profile.daily_limit}
              weekdayLimit={profile.weekday_limit}
              weekendLimit={profile.weekend_limit}
              dailyTotals={calculateDailyTotals()}
              onDragStart={setDraggedActivity}
              onDragEnd={() => setDraggedActivity(null)}
            />
          )}

          <main className="flex-1 overflow-auto scrollbar-hide text-card">
            <div className="container mx-auto px-4 py-6 bg-card">
              <CalendarHeader
                currentDate={view === "week" ? weekStart : currentDate}
                view={view}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onViewChange={setView}
                onDateClick={() => setDatePickerOpen(true)} // Add onDateClick handler to open date picker
                dailyLimit={profile?.daily_limit || 15}
              />

              {view === "week" ? (
                <WeekView
                  weekStart={weekStart}
                  entries={entries}
                  dailyLimit={profile?.daily_limit || 15}
                  onSlotClick={handleSlotClick}
                  onDateClick={handleDateClick}
                  onDropActivity={handleDropActivity}
                  onMoveActivity={handleMoveActivity}
                  onDeleteActivity={handleDeleteActivityDirect}
                />
              ) : (
                <DayView
                  date={currentDate}
                  entries={entries}
                  dailyLimit={profile?.daily_limit || 15}
                  onSlotClick={handleSlotClick}
                  onDropActivity={handleDropActivity}
                  onMoveActivity={handleMoveActivity}
                  onDeleteActivity={handleDeleteActivityDirect}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Activity Modal */}
      {selectedSlot && (
        <ActivityModal
          open={activityModalOpen}
          onOpenChange={setActivityModalOpen}
          date={selectedSlot.date}
          time={selectedSlot.time}
          existingActivity={selectedActivity}
          onSave={handleSaveActivity}
          onDelete={selectedActivity ? handleDeleteActivity : undefined}
          onOpenBulkSchedule={() => setBulkScheduleOpen(true)}
        />
      )}

      {/* Bulk Schedule Modal */}
      <BulkScheduleModal
        open={bulkScheduleOpen}
        onOpenChange={setBulkScheduleOpen}
        weekStart={weekStart}
        onSave={handleBulkSave}
      />

      {/* Settings Modal */}
      {profile && (
        <SettingsModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          profile={profile}
          onProfileUpdate={setProfile}
        />
      )}

      {/* Load Previous Week Modal */}
      <LoadPreviousWeekModal
        open={loadPreviousWeekOpen}
        onOpenChange={setLoadPreviousWeekOpen}
        currentWeekStart={weekStart}
        previousWeekStart={getPrevWeekStart(weekStart)}
        onConfirm={handleLoadPreviousWeek}
      />

      {/* DatePicker Modal */}
      <DatePickerModal
        open={datePickerOpen}
        onOpenChange={setDatePickerOpen}
        currentWeekStart={weekStart}
        onSelectDate={handleDateSelect}
      />
    </div>
  )
}
