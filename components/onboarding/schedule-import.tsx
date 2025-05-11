"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OnboardingData } from "@/app/onboarding/page"
import { Calendar, Upload, Plus, X } from "lucide-react"

interface ScheduleImportProps {
  data: OnboardingData["schedule"]
  updateData: (data: Partial<OnboardingData["schedule"]>) => void
  onContinue: () => void
  onBack: () => void
  onSkip: () => void
}

export function ScheduleImport({ data, updateData, onContinue, onBack, onSkip }: ScheduleImportProps) {
  const [activeTab, setActiveTab] = useState<"ics" | "manual">(data.importMethod || "ics")
  const [newCourse, setNewCourse] = useState({
    name: "",
    days: [] as string[],
    startTime: "",
    endTime: "",
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value as "ics" | "manual")
    updateData({ importMethod: value as "ics" | "manual" })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateData({ icsFile: file })
    }
  }

  const handleDayToggle = (day: string) => {
    const currentDays = [...newCourse.days]
    if (currentDays.includes(day)) {
      setNewCourse({
        ...newCourse,
        days: currentDays.filter((d) => d !== day),
      })
    } else {
      setNewCourse({
        ...newCourse,
        days: [...currentDays, day],
      })
    }
  }

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.days.length > 0 && newCourse.startTime && newCourse.endTime) {
      updateData({
        courses: [...data.courses, { ...newCourse }],
      })
      setNewCourse({
        name: "",
        days: [],
        startTime: "",
        endTime: "",
      })
    }
  }

  const handleRemoveCourse = (index: number) => {
    const updatedCourses = [...data.courses]
    updatedCourses.splice(index, 1)
    updateData({ courses: updatedCourses })
  }

  const dayButtons = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
    <Button
      key={day}
      type="button"
      variant={newCourse.days.includes(day) ? "default" : "outline"}
      size="sm"
      onClick={() => handleDayToggle(day)}
      className={`w-12 ${newCourse.days.includes(day) ? "bg-purple-600 hover:bg-purple-700" : ""}`}
    >
      {day}
    </Button>
  ))

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Step 2: Import Your Class Schedule</CardTitle>
        <CardDescription>Add your classes to Alfred to help with time management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ics">Upload Calendar File</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="ics" className="space-y-4 pt-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 text-purple-500 mx-auto mb-4" />
              <h3 className="font-medium mb-1">Upload your calendar file</h3>
              <p className="text-sm text-gray-500 mb-4">Supports .ics files from NYU Albert or Google Calendar</p>
              <Input id="calendar-file" type="file" accept=".ics" onChange={handleFileChange} className="hidden" />
              <Label
                htmlFor="calendar-file"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple-600 text-white hover:bg-purple-700 h-10 px-4 py-2 cursor-pointer"
              >
                Select File
              </Label>
              {data.icsFile && (
                <div className="mt-4 text-sm">
                  Selected file: <span className="font-medium">{data.icsFile.name}</span>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                <h3 className="font-medium">Calendar Preview</h3>
              </div>
              {data.icsFile ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    Your schedule will be imported when you continue to the next step.
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Upload a file to see a preview of your schedule.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium">Add Course</h3>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="Introduction to Computer Science"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Days</Label>
                <div className="flex flex-wrap gap-2">{dayButtons}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newCourse.startTime}
                    onChange={(e) => setNewCourse({ ...newCourse, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newCourse.endTime}
                    onChange={(e) => setNewCourse({ ...newCourse, endTime: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddCourse} className="w-full bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            {data.courses.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Your Courses</h3>
                <div className="space-y-2">
                  {data.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-gray-500">
                          {course.days.join(", ")} • {course.startTime} - {course.endTime}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCourse(index)}
                        className="h-8 w-8 text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
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
        <Button
          onClick={onContinue}
          disabled={activeTab === "ics" ? !data.icsFile : data.courses.length === 0}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
