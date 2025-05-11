"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateEventModal } from "@/components/create-event-modal"
import { type ScheduleEvent, type EventCategory, useProjects } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DailyScheduleProps {
  events: ScheduleEvent[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  onEventUpdate: (event: ScheduleEvent) => void
  onEventDelete: (eventId: string) => void
  onAddEvent: () => void
}

export function DailySchedule({
  events,
  selectedDate,
  onDateChange,
  onEventUpdate,
  onEventDelete,
  onAddEvent,
}: DailyScheduleProps) {
  const [projects] = useProjects()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)

  const handlePreviousDay = () => {
    onDateChange(addDays(selectedDate, -1))
  }

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1))
  }

  const handleEditEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event)
    setIsEditModalOpen(true)
  }

  const handleDeleteEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteEvent = () => {
    if (selectedEvent) {
      onEventDelete(selectedEvent.id)
      setIsDeleteDialogOpen(false)
    }
  }

  const getEventsForSelectedDate = () => {
    const dateString = format(selectedDate, "yyyy-MM-dd")
    return events.filter((event) => event.date === dateString)
  }

  const getEventCategoryClass = (category: EventCategory) => {
    switch (category) {
      case "Class":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-l-blue-500"
      case "Work":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 border-l-amber-500"
      case "Personal Project":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-l-purple-500"
      case "Break":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-l-green-500"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-l-gray-500"
    }
  }

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : null
  }

  const sortedEvents = getEventsForSelectedDate().sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={onAddEvent}>
            Add Event
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-md border-l-4 ${getEventCategoryClass(event.category)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm">
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.projectId && (
                        <Badge variant="outline" className="mt-1">
                          {getProjectName(event.projectId)}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Event
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(event)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No events scheduled for this day.</p>
                <Button variant="outline" onClick={onAddEvent} className="mt-4">
                  Add your first event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedEvent && (
        <CreateEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onCreateEvent={onEventUpdate}
          selectedDate={selectedDate}
          existingEvent={selectedEvent}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{selectedEvent?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
