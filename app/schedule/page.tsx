"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus } from "lucide-react"
import { WeeklySchedule } from "@/components/weekly-schedule"
import { DailySchedule } from "@/components/daily-schedule"
import { CreateEventModal } from "@/components/create-event-modal"
import { useSchedule, type ScheduleEvent } from "@/lib/store"
import { useOnboarding } from "@/components/onboarding/onboarding-provider"

export default function SchedulePage() {
  const [schedule, setSchedule, isLoading] = useSchedule()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<"weekly" | "daily">("weekly")
  const { markStepComplete } = useOnboarding()

  const handleCreateEvent = (event: ScheduleEvent) => {
    setSchedule([...schedule, event])
    setIsModalOpen(false)
  }

  const handleUpdateEvent = (updatedEvent: ScheduleEvent) => {
    setSchedule(schedule.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const handleDeleteEvent = (eventId: string) => {
    setSchedule(schedule.filter((event) => event.id !== eventId))
  }

  const handleSuggestTimeBlock = () => {
    markStepComplete("schedule-suggest")
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading schedule...</h2>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground">Manage your time with smart scheduling</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <Tabs
          defaultValue="weekly"
          className="space-y-4"
          onValueChange={(value) => setView(value as "weekly" | "daily")}
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="weekly" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="daily" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Daily
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="weekly" className="space-y-4">
            <WeeklySchedule
              events={schedule}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onEventUpdate={handleUpdateEvent}
              onEventDelete={handleDeleteEvent}
              onAddEvent={() => setIsModalOpen(true)}
              onSuggestTimeBlock={handleSuggestTimeBlock}
            />
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <DailySchedule
              events={schedule}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onEventUpdate={handleUpdateEvent}
              onEventDelete={handleDeleteEvent}
              onAddEvent={() => setIsModalOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateEvent={handleCreateEvent}
        selectedDate={selectedDate}
      />
    </MainLayout>
  )
}
