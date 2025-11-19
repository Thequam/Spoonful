export function getSpoonColor(spoons: number, activityName?: string): { bg: string; fg: string } {
  // Special case for Sleep activity
  if (activityName?.toLowerCase() === "sleep") {
    return {
      bg: "bg-[var(--color-energy-sleep)]",
      fg: "text-[var(--color-energy-sleep-fg)]",
    }
  }

  switch (spoons) {
    case 5:
      return {
        bg: "bg-[var(--color-energy-extreme)]",
        fg: "text-[var(--color-energy-extreme-fg)]",
      }
    case 4:
      return {
        bg: "bg-[var(--color-energy-very-high)]",
        fg: "text-[var(--color-energy-very-high-fg)]",
      }
    case 3:
      return {
        bg: "bg-[var(--color-energy-high)]",
        fg: "text-[var(--color-energy-high-fg)]",
      }
    case 2:
      return {
        bg: "bg-[var(--color-energy-medium)]",
        fg: "text-[var(--color-energy-medium-fg)]",
      }
    case 1:
      return {
        bg: "bg-[var(--color-energy-low)]",
        fg: "text-[var(--color-energy-low-fg)]",
      }
    case 0:
      return {
        bg: "bg-[var(--color-energy-recharge)]",
        fg: "text-[var(--color-energy-recharge-fg)]",
      }
    default:
      return {
        bg: "bg-muted",
        fg: "text-muted-foreground",
      }
  }
}

export function getSpoonLabel(spoons: number): string {
  return spoons === 1 ? "1 Spoon" : `${spoons} Spoons`
}

export function getSpoonCategory(spoons: number): string {
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
