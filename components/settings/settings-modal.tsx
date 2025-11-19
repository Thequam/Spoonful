"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Profile } from "@/lib/types"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile
  onProfileUpdate: (profile: Profile) => void
}

export function SettingsModal({ open, onOpenChange, profile, onProfileUpdate }: SettingsModalProps) {
  const supabase = createClient()
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [dailyLimit, setDailyLimit] = useState(profile.daily_limit)
  const [weekdayLimit, setWeekdayLimit] = useState(profile.weekday_limit)
  const [weekendLimit, setWeekendLimit] = useState(profile.weekend_limit)
  const [isLoading, setIsLoading] = useState(false)

  const minWeekdayLimit = dailyLimit * 5
  const minWeekendLimit = dailyLimit * 2

  useEffect(() => {
    if (open) {
      setDisplayName(profile.display_name)
      setDailyLimit(profile.daily_limit)
      setWeekdayLimit(profile.weekday_limit)
      setWeekendLimit(profile.weekend_limit)
    }
  }, [open, profile])

  useEffect(() => {
    // Ensure weekday limit is at least the minimum
    if (weekdayLimit < minWeekdayLimit) {
      setWeekdayLimit(minWeekdayLimit)
    }
    // Ensure weekend limit is at least the minimum
    if (weekendLimit < minWeekendLimit) {
      setWeekendLimit(minWeekendLimit)
    }
  }, [dailyLimit, minWeekdayLimit, minWeekendLimit, weekdayLimit, weekendLimit])

  const handleSave = async () => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        daily_limit: dailyLimit,
        weekday_limit: weekdayLimit,
        weekend_limit: weekendLimit,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select()
      .single()

    if (!error && data) {
      onProfileUpdate(data)
      onOpenChange(false)
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your profile and energy limits</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="limits" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="limits">Energy Limits</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="limits" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="daily-limit">Daily Limit (Spoons)</Label>
              <Input
                id="daily-limit"
                type="number"
                min="1"
                max="100"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number.parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">Maximum spoons you can use per day</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekday-limit">Weekday Limit (Mon-Fri)</Label>
              <Input
                id="weekday-limit"
                type="number"
                min={minWeekdayLimit}
                max="500"
                value={weekdayLimit}
                onChange={(e) => setWeekdayLimit(Number.parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Total spoons for Monday through Friday (minimum: {minWeekdayLimit})
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekend-limit">Weekend Limit (Sat-Sun)</Label>
              <Input
                id="weekend-limit"
                type="number"
                min={minWeekendLimit}
                max="200"
                value={weekendLimit}
                onChange={(e) => setWeekendLimit(Number.parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Total spoons for Saturday and Sunday (minimum: {minWeekendLimit})
              </p>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
