"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { OnboardingData } from "@/app/onboarding/page"
import { CheckCircle2, Calendar, FolderKanban, Clock, Loader2 } from "lucide-react"

interface SuccessSummaryProps {
  data: OnboardingData
  onComplete: () => void
  isLoading: boolean
}

export function SuccessSummary({ data, onComplete, isLoading }: SuccessSummaryProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-purple-600" />
        </div>
        <CardTitle className="text-2xl">You&apos;re all set, {data.profile.fullName.split(" ")[0]}!</CardTitle>
        <CardDescription>Your Alfred workspace is ready to use</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Your Schedule</h3>
              {data.schedule.importMethod === "ics" ? (
                <p className="text-sm text-gray-500">Calendar imported from {data.schedule.icsFile?.name || "file"}</p>
              ) : data.schedule.courses.length > 0 ? (
                <p className="text-sm text-gray-500">
                  {data.schedule.courses.length} course{data.schedule.courses.length !== 1 ? "s" : ""} added to your
                  schedule
                </p>
              ) : (
                <p className="text-sm text-gray-500">No schedule imported yet</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <FolderKanban className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Your First Project</h3>
              {data.project.name ? (
                <>
                  <p className="font-medium">{data.project.name}</p>
                  <p className="text-sm text-gray-500">
                    {data.project.dueDate
                      ? `Due: ${new Date(data.project.dueDate).toLocaleDateString()}`
                      : "No due date set"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No project created yet</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Time Blocking Preferences</h3>
              <p className="text-sm text-gray-500">
                {data.timeblock.workHours === "morning"
                  ? "Morning work sessions"
                  : data.timeblock.workHours === "afternoon"
                    ? "Afternoon work sessions"
                    : data.timeblock.workHours === "evening"
                      ? "Evening work sessions"
                      : "Flexible work hours"}
                {data.timeblock.avoidDays.length > 0 ? `, avoiding ${data.timeblock.avoidDays.join(", ")}` : ""},{" "}
                {data.timeblock.sessionLength} minute sessions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
          <h3 className="font-medium mb-2">What&apos;s Next?</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
              <span>Explore your dashboard to see your schedule and projects</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
              <span>Break down your project into manageable tasks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5" />
              <span>Check out the resources section for academic tools</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onComplete} disabled={isLoading} size="lg" className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up your workspace...
            </>
          ) : (
            "Go to Dashboard"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
