"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { formatWeekRange } from "@/lib/date-utils"

interface LoadPreviousWeekModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentWeekStart: Date
  previousWeekStart: Date
  onConfirm: () => void
}

export function LoadPreviousWeekModal({
  open,
  onOpenChange,
  currentWeekStart,
  previousWeekStart,
  onConfirm,
}: LoadPreviousWeekModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    await onConfirm()
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Load from Previous Week</DialogTitle>
          <DialogDescription>Copy activities from the previous week into the current week</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-md bg-muted">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1">This will copy all activities from:</p>
              <p className="text-muted-foreground">{formatWeekRange(previousWeekStart)}</p>
              <p className="font-semibold mt-2 mb-1">To the current week:</p>
              <p className="text-muted-foreground">{formatWeekRange(currentWeekStart)}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Existing activities in the current week will not be affected. Only empty time slots will be filled.
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading} className="flex-1">
              {isLoading ? "Loading..." : "Load Previous Week"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
