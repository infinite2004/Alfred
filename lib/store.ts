"use client"

import { useState, useEffect } from "react"

// Project Types
export interface Task {
  id: string
  title: string
  completed: boolean
  subtasks: Task[]
}

export interface Project {
  id: string
  name: string
  description: string
  dueDate: string
  status: "Not Started" | "In Progress" | "Done"
  collaborators: string[]
  tags: string[]
  tasks: Task[]
}

// Schedule Types
export type EventCategory = "Class" | "Work" | "Personal Project" | "Break"

export interface ScheduleEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  category: EventCategory
  date: string
  projectId?: string
}

// Local Storage Keys
const PROJECTS_STORAGE_KEY = "student-productivity-projects"
const SCHEDULE_STORAGE_KEY = "student-productivity-schedule"

// Helper Functions
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue, isLoading] as const
}

// Project Hooks
export function useProjects() {
  return useLocalStorage<Project[]>(PROJECTS_STORAGE_KEY, [])
}

// Schedule Hooks
export function useSchedule() {
  return useLocalStorage<ScheduleEvent[]>(SCHEDULE_STORAGE_KEY, [])
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
