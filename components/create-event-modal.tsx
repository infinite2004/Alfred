"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ScheduleEvent, type EventCategory, generateId, useProjects } from "@/lib/store"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateEvent: (event: ScheduleEvent) => void
  selectedDate: Date
  existingEvent?: ScheduleEvent
}

export function CreateEventModal({
  isOpen,
  onClose,
  onCreateEvent,
  selectedDate,
  existingEvent,
}: CreateEventModalProps) {
  const [projects] = useProjects()
  const [title, setTitle] = useState(existingEvent?.title || "")
  const [date, setDate] = useState(existingEvent?.date || format(selectedDate, "yyyy-MM-dd"))
  const [startTime, setStartTime] = useState(existingEvent?.startTime || "09:00")
  const [endTime, setEndTime] = useState(existingEvent?.endTime || "10:00")
  const [category, setCategory] = useState<EventCategory>(existingEvent?.category || "Class")
  const [projectId, setProjectId] = useState<string | undefined>(existingEvent?.projectId)

  const handleSubmit = () => {
    if (!title.trim()) return

    const event: ScheduleEvent = {
      id: existingEvent?.id || generateId(),
      title,
      date,
      startTime,
      endTime,
      category,
      projectId,
    }

    onCreateEvent(event)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setDate(format(selectedDate, "yyyy-MM-dd"))
    setStartTime("09:00")
    setEndTime("10:00")
    setCategory("Class")
    setProjectId(undefined)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{existingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
          <DialogDescription>
            {existingEvent
              ? "Update your event details below."
              : "Fill in the details to add a new event to your schedule."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Event Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </label>
              <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={(value) => setCategory(value as EventCategory)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Class">Class</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal Project">Personal Project</SelectItem>
                <SelectItem value="Break">Break</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {category === "Personal Project" && projects.length > 0 && (
            <div className="grid gap-2">
              <label htmlFor="project" className="text-sm font-medium">
                Related Project
              </label>
              <Select value={projectId || ""} onValueChange={setProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none-selected">None</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            {existingEvent ? "Update Event" : "Add Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
