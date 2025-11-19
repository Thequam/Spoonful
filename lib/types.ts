export interface Profile {
  id: string
  display_name: string
  daily_limit: number
  weekday_limit: number
  weekend_limit: number
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_id: string
  name: string
  spoons: number
  category: string
  description: string | null
  is_default: boolean
  created_at: string
}

export interface TimetableEntry {
  id: string
  user_id: string
  week_start: string
  date: string
  day_name: string
  timeslot: string
  activity_name: string
  spoons: number
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  time: string
  label: string
}

export const TIME_SLOTS: TimeSlot[] = [
  { time: "06:00", label: "06:00" },
  { time: "08:00", label: "08:00" },
  { time: "10:00", label: "10:00" },
  { time: "12:00", label: "12:00" },
  { time: "14:00", label: "14:00" },
  { time: "16:00", label: "16:00" },
  { time: "18:00", label: "18:00" },
  { time: "20:00", label: "20:00" },
  { time: "22:00", label: "22:00" },
  { time: "00:00", label: "00:00" },
  { time: "02:00", label: "02:00" },
  { time: "04:00", label: "04:00" },
]

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const
export type DayName = (typeof DAYS)[number]
