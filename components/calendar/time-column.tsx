import { TIME_SLOTS } from "@/lib/types"

export function TimeColumn() {
  return (
    <div className="sticky left-0 z-10 bg-background">
      <div className="h-[60px] border-b border-r border-border/40 bg-background flex items-center justify-center">
        <span className="text-xs font-medium text-muted-foreground/70">Time</span>
      </div>

      {/* Time labels - Show start and end time stacked vertically */}
      {TIME_SLOTS.map((slot, index) => {
        const nextSlot = TIME_SLOTS[(index + 1) % TIME_SLOTS.length]
        return (
          <div
            key={slot.time}
            className="h-[60px] border-b border-r border-border/40 flex flex-col items-center justify-center px-2"
          >
            <span className="text-xs font-medium text-muted-foreground/70">{slot.label}</span>
            <span className="text-xs font-medium text-muted-foreground/70">{nextSlot.label}</span>
          </div>
        )
      })}
    </div>
  )
}
