import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from "date-fns"

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 }) // Monday
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6)
  return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
}

export function getNextWeek(currentWeekStart: Date): Date {
  return addWeeks(currentWeekStart, 1)
}

export function getPreviousWeek(currentWeekStart: Date): Date {
  return subWeeks(currentWeekStart, 1)
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function formatDateForDB(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function parseDateFromDB(dateString: string): Date {
  return parseISO(dateString)
}
