"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { useAuth } from "@/lib/auth"

export default function Home() {
  const { user, isLoading } = useAuth()
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingStatus = localStorage.getItem("alfred_onboarding_completed")
    // Check if we're coming from a reset action
    const resetFlag = localStorage.getItem("alfred_onboarding_reset")

    // If we're resetting, consider onboarding as not completed
    if (resetFlag === "true") {
      setOnboardingCompleted(false)
    } else {
      setOnboardingCompleted(onboardingStatus === "true")
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (onboardingCompleted === false) {
          redirect("/onboarding")
        } else {
          redirect("/dashboard")
        }
      } else {
        redirect("/auth/login")
      }
    }
  }, [user, isLoading, onboardingCompleted])

  // Show nothing while checking auth state
  return null
}
