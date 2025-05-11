"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  const router = useRouter()

  const handleStartOnboarding = () => {
    localStorage.setItem("alfred_onboarding_reset", "true")
    localStorage.removeItem("alfred_onboarding_progress")
    localStorage.removeItem("alfred_onboarding_data")
    localStorage.removeItem("alfred_onboarding_completed")
    router.push("/onboarding")
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Alfred Features</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Productivity Tools</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Smart Time Blocking - Schedule tasks based on your preferences</li>
          <li>Pomodoro Technique - Maintain focus during study sessions</li>
          <li>AI Study Assistant - Get help breaking down complex projects</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Organization</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Project Management - Track projects with deadlines and milestones</li>
          <li>Schedule Synchronization - Import your class schedule</li>
          <li>Resource Library - Store and organize study materials</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Insights & Analytics</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Productivity Analytics - Track study hours and completion rates</li>
          <li>Goal Tracking - Set academic goals and track progress</li>
        </ul>
      </div>

      <div className="flex justify-center gap-4 mt-12">
        <Button onClick={handleStartOnboarding}>Start Onboarding</Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
