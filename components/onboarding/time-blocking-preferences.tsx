"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "@/app/onboarding/page"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface TimeBlockingPreferencesProps {
  data: OnboardingData["timeblock"]
  updateData: (data: Partial<OnboardingData["timeblock"]>) => void
  onContinue: () => void
  onBack: () => void
  onSkip: () => void
}

export function TimeBlockingPreferences({
  data,
  updateData,
  onContinue,
  onBack,
  onSkip,
}: TimeBlockingPreferencesProps) {
  const handleWorkHoursChange = (value: string) => {
    updateData({ workHours: value as OnboardingData["timeblock"]["workHours"] })
  }

  const handleSessionLengthChange = (value: string) => {
    updateData({ sessionLength: Number.parseInt(value) as OnboardingData["timeblock"]["sessionLength"] })
  }

  const handleDayToggle = (day: string) => {
    const currentDays = [...data.avoidDays]
    if (currentDays.includes(day)) {
      updateData({ avoidDays: currentDays.filter((d) => d !== day) })
    } else {
      updateData({ avoidDays: [...currentDays, day] })
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Step 4: Customize Your Time Blocking</CardTitle>
        <CardDescription>Set your preferences for how Alfred should schedule your work</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Ideal Work Hours</Label>
          <RadioGroup
            value={data.workHours}
            onValueChange={handleWorkHoursChange}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <div>
              <RadioGroupItem value="morning" id="morning" className="peer sr-only" />
              <Label
                htmlFor="morning"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="text-xl mb-1">🌅</span>
                <span className="font-medium">Morning</span>
                <span className="text-xs text-muted-foreground">6AM - 12PM</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="afternoon" id="afternoon" className="peer sr-only" />
              <Label
                htmlFor="afternoon"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="text-xl mb-1">☀️</span>
                <span className="font-medium">Afternoon</span>
                <span className="text-xs text-muted-foreground">12PM - 5PM</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="evening" id="evening" className="peer sr-only" />
              <Label
                htmlFor="evening"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="text-xl mb-1">🌆</span>
                <span className="font-medium">Evening</span>
                <span className="text-xs text-muted-foreground">5PM - 10PM</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="any" id="any" className="peer sr-only" />
              <Label
                htmlFor="any"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="text-xl mb-1">🕒</span>
                <span className="font-medium">Any Time</span>
                <span className="text-xs text-muted-foreground">Flexible</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Days to Avoid Scheduling</Label>
          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="flex flex-col items-center">
                <Checkbox
                  id={`day-${day}`}
                  checked={data.avoidDays.includes(day)}
                  onCheckedChange={() => handleDayToggle(day)}
                  className="mb-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor={`day-${day}`} className="text-sm">
                  {day}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Select days you'd prefer not to have work scheduled</p>
        </div>

        <div className="space-y-3">
          <Label>Work Session Length</Label>
          <RadioGroup
            value={data.sessionLength.toString()}
            onValueChange={handleSessionLengthChange}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            <div>
              <RadioGroupItem value="30" id="thirty" className="peer sr-only" />
              <Label
                htmlFor="thirty"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="font-medium">30 min</span>
                <span className="text-xs text-muted-foreground">Short bursts</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="60" id="sixty" className="peer sr-only" />
              <Label
                htmlFor="sixty"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="font-medium">60 min</span>
                <span className="text-xs text-muted-foreground">Standard</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="90" id="ninety" className="peer sr-only" />
              <Label
                htmlFor="ninety"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="font-medium">90 min</span>
                <span className="text-xs text-muted-foreground">Deep work</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="120" id="onetwenty" className="peer sr-only" />
              <Label
                htmlFor="onetwenty"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-600 [&:has([data-state=checked])]:border-purple-600"
              >
                <span className="font-medium">120 min</span>
                <span className="text-xs text-muted-foreground">Extended</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mr-2">
            Back
          </Button>
          <Button variant="ghost" onClick={onSkip}>
            Skip for now
          </Button>
        </div>
        <Button onClick={onContinue} className="bg-purple-600 hover:bg-purple-700">
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
