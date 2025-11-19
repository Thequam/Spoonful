"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { TimetableEntry, Activity } from "./types"

export class DataPersistence {
  private supabase
  private userId: string

  constructor(userId: string) {
    this.userId = userId
    this.supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  async saveTimetableEntries(entries: TimetableEntry[]): Promise<void> {
    try {
      const weekKey = entries.length > 0 ? entries[0].week_start : null
      if (!weekKey) return

      const { data: existingEntries } = await this.supabase
        .from("timetable_entries")
        .select("id, date, timeslot")
        .eq("user_id", this.userId)
        .eq("week_start", weekKey)

      const existingMap = new Map(existingEntries?.map((e) => [`${e.date}_${e.timeslot}`, e.id]) || [])

      const uniqueEntriesMap = new Map<string, TimetableEntry>()
      entries.forEach((entry) => {
        const key = `${entry.date}_${entry.timeslot}`
        uniqueEntriesMap.set(key, entry) // Last occurrence wins
      })
      const uniqueEntries = Array.from(uniqueEntriesMap.values())

      const entriesToUpsert = uniqueEntries.map((entry) => ({
        user_id: this.userId,
        week_start: entry.week_start,
        date: entry.date,
        day_name: entry.day_name,
        timeslot: entry.timeslot,
        activity_name: entry.activity_name,
        spoons: entry.spoons,
      }))

      if (entriesToUpsert.length > 0) {
        const { error } = await this.supabase.from("timetable_entries").upsert(entriesToUpsert, {
          onConflict: "user_id,date,timeslot",
        })

        if (error) throw error
      }

      const currentKeys = new Set(uniqueEntries.map((e) => `${e.date}_${e.timeslot}`))
      const idsToDelete = Array.from(existingMap.entries())
        .filter(([key]) => !currentKeys.has(key))
        .map(([, id]) => id)

      if (idsToDelete.length > 0) {
        const { error } = await this.supabase.from("timetable_entries").delete().in("id", idsToDelete)

        if (error) throw error
      }

      console.log("[v0] Auto-saved timetable entries")
    } catch (error) {
      console.error("[v0] Failed to save timetable entries:", error)
      throw error
    }
  }

  async loadTimetableEntries(weekKey: string): Promise<TimetableEntry[]> {
    try {
      const { data, error } = await this.supabase
        .from("timetable_entries")
        .select("*")
        .eq("user_id", this.userId)
        .eq("week_start", weekKey)
        .order("date", { ascending: true })
        .order("timeslot", { ascending: true })

      if (error) throw error

      return (data || []).map((entry) => ({
        id: entry.id,
        user_id: entry.user_id,
        week_start: entry.week_start,
        date: entry.date,
        day_name: entry.day_name,
        timeslot: entry.timeslot,
        activity_name: entry.activity_name,
        spoons: entry.spoons,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      }))
    } catch (error) {
      console.error("[v0] Failed to load timetable entries:", error)
      return []
    }
  }

  async loadPreviousWeekEntries(currentWeekKey: string): Promise<TimetableEntry[]> {
    try {
      const currentDate = new Date(currentWeekKey)
      const previousDate = new Date(currentDate)
      previousDate.setDate(previousDate.getDate() - 7)
      const previousWeekKey = previousDate.toISOString().split("T")[0]

      const { data, error } = await this.supabase
        .from("timetable_entries")
        .select("*")
        .eq("user_id", this.userId)
        .eq("week_start", previousWeekKey)
        .order("date", { ascending: true })
        .order("timeslot", { ascending: true })

      if (error) throw error

      return (data || []).map((entry) => {
        const entryDate = new Date(entry.date)
        const newDate = new Date(entryDate)
        newDate.setDate(newDate.getDate() + 7)

        return {
          id: entry.id,
          user_id: this.userId,
          week_start: currentWeekKey,
          date: newDate.toISOString().split("T")[0],
          day_name: entry.day_name,
          timeslot: entry.timeslot,
          activity_name: entry.activity_name,
          spoons: entry.spoons,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        }
      })
    } catch (error) {
      console.error("[v0] Failed to load previous week entries:", error)
      return []
    }
  }

  async saveActivity(activity: Omit<Activity, "id" | "created_at">): Promise<Activity | null> {
    try {
      const { data, error } = await this.supabase
        .from("activities")
        .insert({
          user_id: this.userId,
          name: activity.name,
          spoons: activity.spoons,
          category: activity.category,
          description: activity.description,
          is_default: activity.is_default,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("[v0] Failed to save activity:", error)
      return null
    }
  }

  async loadActivities(): Promise<Activity[]> {
    try {
      const { data, error } = await this.supabase
        .from("activities")
        .select("*")
        .eq("user_id", this.userId)
        .order("spoons", { ascending: false })
        .order("name", { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("[v0] Failed to load activities:", error)
      return []
    }
  }

  async deleteActivity(activityId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("activities")
        .delete()
        .eq("id", activityId)
        .eq("user_id", this.userId)
        .eq("is_default", false)

      if (error) throw error
      return true
    } catch (error) {
      console.error("[v0] Failed to delete activity:", error)
      return false
    }
  }
}
