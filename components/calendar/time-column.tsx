import { TIME_SLOTS } from "@/lib/types"

export function TimeColumn() {
  return (
    <div className="sticky left-0 z-10 bg-background">
      {/* Empty header cell */}
      <div className="h-[60px] border-b-2 border-r-2 border-border bg-background" />

      {/* Time labels */}
      {TIME_SLOTS.map((slot) => (
        <div
          key={slot.time}
          className="h-[60px] border-b border-r-2 border-border flex items-center justify-center px-2"
        >
          <span className="text-sm font-medium text-muted-foreground">{slot.label}</span>
        </div>
      ))}
    </div>
  )
}
