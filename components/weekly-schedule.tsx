"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, LightbulbIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateEventModal } from "@/components/create-event-modal"
import { type ScheduleEvent, type EventCategory, useProjects } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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

interface WeeklyScheduleProps {
  events: ScheduleEvent[]
  selectedDate: Date
  onDateChange: (date: Date) => void
  onEventUpdate: (event: ScheduleEvent) => void
  onEventDelete: (eventId: string) => void
  onAddEvent: () => void
  onSuggestTimeBlock?: () => void
}

export function WeeklySchedule({
  events,
  selectedDate,
  onDateChange,
  onEventUpdate,
  onEventDelete,
  onAddEvent,
  onSuggestTimeBlock,
}: WeeklyScheduleProps) {
  const [projects] = useProjects()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [showSuggestionTooltip, setShowSuggestionTooltip] = useState(false)

  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 0 })

  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(startOfCurrentWeek, index)
    return {
      date,
      dayName: format(date, "EEE"),
      dayNumber: format(date, "d"),
    }
  })

  const handlePreviousWeek = () => {
    onDateChange(addDays(startOfCurrentWeek, -7))
  }

  const handleNextWeek = () => {
    onDateChange(addDays(startOfCurrentWeek, 7))
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

  const getEventsByDay = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return events.filter((event) => event.date === dateString)
  }

  const getEventCategoryClass = (category: EventCategory) => {
    switch (category) {
      case "Class":
        return "event-class"
      case "Work":
        return "event-work"
      case "Personal Project":
        return "event-project"
      case "Break":
        return "event-break"
      default:
        return ""
    }
  }

  const getProjectName = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : null
  }

  const handleSuggestTimeBlock = () => {
    setShowSuggestionTooltip(true)
    setTimeout(() => {
      setShowSuggestionTooltip(false)
    }, 5000)

    if (onSuggestTimeBlock) {
      onSuggestTimeBlock()
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(startOfCurrentWeek, "MMMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMMM d, yyyy")}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip open={showSuggestionTooltip} onOpenChange={setShowSuggestionTooltip}>
              <TooltipTrigger asChild>
                <Button id="suggest-time-block" variant="outline" onClick={handleSuggestTimeBlock}>
                  <LightbulbIcon className="mr-2 h-4 w-4" />
                  Suggest Time Block
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-4">
                <p className="font-semibold">Why this time?</p>
                <p className="text-sm mt-1">
                  Based on your schedule, Tuesday at 2:00 PM is recommended for your "Research Paper" task because:
                </p>
                <ul className="text-sm mt-1 list-disc pl-4">
                  <li>It's a free time block</li>
                  <li>It's before your project due date</li>
                  <li>You tend to be productive in the afternoon</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div id="schedule-calendar" className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day.dayName} className="flex flex-col">
              <div
                className={`text-center p-2 rounded-t-md ${
                  isSameDay(day.date, new Date()) ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="text-sm font-medium">{day.dayName}</div>
                <div className="text-lg">{day.dayNumber}</div>
              </div>

              <Card className="flex-1 rounded-t-none border-t-0">
                <CardContent className="p-2 space-y-2 min-h-[300px]">
                  {getEventsByDay(day.date).map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded-md border-l-4 ${getEventCategoryClass(event.category)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.projectId && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {getProjectName(event.projectId)}
                            </Badge>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
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
                  ))}
                  <Button
                    variant="ghost"
                    className="w-full h-8 text-xs justify-start text-muted-foreground"
                    onClick={onAddEvent}
                  >
                    + Add event
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <CreateEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onCreateEvent={onEventUpdate}
          selectedDate={new Date(selectedEvent.date)}
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
