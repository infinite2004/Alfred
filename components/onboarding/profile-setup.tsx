"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "@/app/onboarding/page"

interface ProfileSetupProps {
  data: OnboardingData["profile"]
  updateData: (data: Partial<OnboardingData["profile"]>) => void
  onContinue: () => void
  onBack: () => void
}

export function ProfileSetup({ data, updateData, onContinue, onBack }: ProfileSetupProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (!data.email.includes(".edu") && !data.email.endsWith("@nyu.edu")) {
      newErrors.email = "Please use your university email"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      onContinue()
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Step 1: User Profile Setup</CardTitle>
        <CardDescription>Tell us a bit about yourself to personalize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">University Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@university.edu"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="major">Major / Department (Optional)</Label>
          <Input
            id="major"
            placeholder="Computer Science"
            value={data.major}
            onChange={(e) => updateData({ major: e.target.value })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700">
          Save & Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
