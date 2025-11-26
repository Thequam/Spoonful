"use client"

import type React from "react"

import { Plus, X } from "lucide-react"
import { getSpoonColor } from "@/lib/energy-utils"

interface TimeSlotProps {
  date: Date
  time: string
  activity?: {
    name: string
    spoons: number
  } | null
  onClick: () => void
  onDelete?: () => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
  onDragStart?: (e: React.DragEvent) => void
  onDragEnd?: () => void
  isDragOver?: boolean
  isDuplicateMode?: boolean
}

export function TimeSlot({
  date,
  time,
  activity,
  onClick,
  onDelete,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  isDragOver = false,
  isDuplicateMode = false,
}: TimeSlotProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.()
  }

  if (activity) {
    const colors = getSpoonColor(activity.spoons, activity.name)

    return (
      <div
        className={`h-[60px] border-b border-r border-border/40 relative cursor-pointer group bg-muted ${
          isDragOver ? "ring-2 ring-primary" : ""
        } ${isDuplicateMode ? "ring-2 ring-blue-500" : ""}`}
        onClick={onClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div
          className={`absolute inset-1 ${colors.bg} ${colors.fg} rounded-md shadow-sm px-2 py-1 flex flex-col justify-between items-center text-center cursor-grab active:cursor-grabbing`}
        >
          <button
            onClick={handleDelete}
            className="absolute top-0.5 right-0.5 p-0.5 rounded-full hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete activity"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="text-xs font-semibold leading-tight line-clamp-2 w-full break-words">{activity.name}</div>
          <div className="text-[10px] font-medium">
            {activity.spoons} {activity.spoons === 1 ? "Spoon" : "Spoons"}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-[60px] border-b border-r border-border/40 relative cursor-pointer hover:bg-card transition-colors group bg-muted ${
        isDragOver ? "bg-primary/5 ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-100">
        <Plus className="h-4 w-4 text-muted-foreground/30" />
      </div>
    </div>
  )
}
