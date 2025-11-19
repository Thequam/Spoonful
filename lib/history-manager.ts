"use client"

import type { TimetableEntry } from "./types"

export interface HistoryState {
  entries: TimetableEntry[]
  timestamp: number
}

const MAX_HISTORY_STEPS = 35

export class HistoryManager {
  private history: HistoryState[] = []
  private currentIndex = -1
  private weekKey: string

  constructor(weekKey: string) {
    this.weekKey = weekKey
    this.loadHistory()
  }

  private getStorageKey(): string {
    return `history_${this.weekKey}`
  }

  private loadHistory(): void {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(this.getStorageKey())
      if (stored) {
        const data = JSON.parse(stored)
        this.history = data.history || []
        this.currentIndex = data.currentIndex ?? -1
      }
    } catch (error) {
      console.error("[v0] Failed to load history:", error)
    }
  }

  private saveHistory(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(
        this.getStorageKey(),
        JSON.stringify({
          history: this.history,
          currentIndex: this.currentIndex,
        }),
      )
    } catch (error) {
      console.error("[v0] Failed to save history:", error)
    }
  }

  pushState(entries: TimetableEntry[]): void {
    // Remove any states after current index
    this.history = this.history.slice(0, this.currentIndex + 1)

    // Add new state
    this.history.push({
      entries: JSON.parse(JSON.stringify(entries)), // Deep clone
      timestamp: Date.now(),
    })

    // Limit history size
    if (this.history.length > MAX_HISTORY_STEPS) {
      this.history.shift()
    } else {
      this.currentIndex++
    }

    this.saveHistory()
  }

  canUndo(): boolean {
    return this.currentIndex > 0
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  undo(): TimetableEntry[] | null {
    if (!this.canUndo()) return null

    this.currentIndex--
    this.saveHistory()
    return JSON.parse(JSON.stringify(this.history[this.currentIndex].entries))
  }

  redo(): TimetableEntry[] | null {
    if (!this.canRedo()) return null

    this.currentIndex++
    this.saveHistory()
    return JSON.parse(JSON.stringify(this.history[this.currentIndex].entries))
  }

  getCurrentState(): TimetableEntry[] | null {
    if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
      return null
    }
    return JSON.parse(JSON.stringify(this.history[this.currentIndex].entries))
  }

  clear(): void {
    this.history = []
    this.currentIndex = -1
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.getStorageKey())
    }
  }
}
