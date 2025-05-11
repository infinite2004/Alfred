"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash2, Plus, Flame } from "lucide-react"
import { format } from "date-fns"
import { type Project, type Task, generateId } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreateProjectModal } from "@/components/create-project-modal"
import { TaskItem } from "@/components/task-item"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

interface ProjectCardProps {
  project: Project
  onUpdate: (project: Project) => void
  onDelete: (projectId: string) => void
}

export function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: generateId(),
        title: newTaskTitle,
        completed: false,
        subtasks: [],
      }

      const updatedProject = {
        ...project,
        tasks: [...project.tasks, newTask],
      }

      onUpdate(updatedProject)
      setNewTaskTitle("")
    }
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = project.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))

    onUpdate({
      ...project,
      tasks: updatedTasks,
    })
  }

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = project.tasks.filter((task) => task.id !== taskId)

    onUpdate({
      ...project,
      tasks: updatedTasks,
    })
  }

  const getStatusColor = () => {
    switch (project.status) {
      case "Not Started":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const completedTasksCount = project.tasks.filter((task) => task.completed).length
  const totalTasksCount = project.tasks.length

  const handleMagicBreakdown = (taskInput: string, granularity = 2) => {
    // This would ideally call the same function from create-project-modal.tsx
    // For simplicity, we'll implement a similar function here

    // Simulate API call delay
    setTimeout(() => {
      // Generate tasks based on input and granularity
      const newTasks: Task[] = []

      // Example tasks for "research paper"
      if (taskInput.toLowerCase().includes("research")) {
        if (granularity === 1) {
          newTasks.push(
            { id: generateId(), title: "Define research topic", completed: false, subtasks: [] },
            { id: generateId(), title: "Gather information", completed: false, subtasks: [] },
            { id: generateId(), title: "Analyze and conclude", completed: false, subtasks: [] },
          )
        } else if (granularity === 2) {
          newTasks.push(
            { id: generateId(), title: "Define research question", completed: false, subtasks: [] },
            { id: generateId(), title: "Review existing literature", completed: false, subtasks: [] },
            { id: generateId(), title: "Design research methodology", completed: false, subtasks: [] },
            { id: generateId(), title: "Collect data", completed: false, subtasks: [] },
            { id: generateId(), title: "Analyze findings", completed: false, subtasks: [] },
            { id: generateId(), title: "Draw conclusions", completed: false, subtasks: [] },
          )
        } else {
          newTasks.push(
            { id: generateId(), title: "Identify specific research question", completed: false, subtasks: [] },
            { id: generateId(), title: "Conduct preliminary background research", completed: false, subtasks: [] },
            { id: generateId(), title: "Review existing literature", completed: false, subtasks: [] },
            { id: generateId(), title: "Refine research question", completed: false, subtasks: [] },
            { id: generateId(), title: "Design detailed research methodology", completed: false, subtasks: [] },
            { id: generateId(), title: "Create data collection instruments", completed: false, subtasks: [] },
            { id: generateId(), title: "Collect data systematically", completed: false, subtasks: [] },
            { id: generateId(), title: "Analyze data using appropriate methods", completed: false, subtasks: [] },
            { id: generateId(), title: "Interpret results", completed: false, subtasks: [] },
            { id: generateId(), title: "Draw conclusions", completed: false, subtasks: [] },
            { id: generateId(), title: "Prepare research report", completed: false, subtasks: [] },
          )
        }
      } else {
        // Default tasks for other inputs
        newTasks.push(
          { id: generateId(), title: `Plan ${taskInput}`, completed: false, subtasks: [] },
          { id: generateId(), title: `Execute ${taskInput}`, completed: false, subtasks: [] },
          { id: generateId(), title: `Review ${taskInput}`, completed: false, subtasks: [] },
        )
      }

      // Update the project with new tasks
      onUpdate({
        ...project,
        tasks: [...project.tasks, ...newTasks],
      })

      // Reset the input
      setNewTaskTitle("")
    }, 800)
  }

  return (
    <>
      <Card className="project-card overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                {project.dueDate && (
                  <span className="text-sm">Due: {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                )}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className={getStatusColor()}>
              {project.status}
            </Badge>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          {project.description && <p className="text-sm text-muted-foreground mb-2">{project.description}</p>}

          <div className="flex justify-between items-center">
            <div className="text-sm">
              {totalTasksCount > 0 ? (
                <span>
                  {completedTasksCount} of {totalTasksCount} tasks completed
                </span>
              ) : (
                <span>No tasks yet</span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="p-0 h-8 w-8">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="border-t my-2" />

            {project.tasks.length > 0 ? (
              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} onDelete={handleTaskDelete} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-2">No tasks yet. Add your first task below.</p>
            )}

            <div className="flex flex-col gap-2 mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTask()
                    }
                  }}
                />
                <Button onClick={handleAddTask} size="icon" title="Add task">
                  <Plus className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" title="Magic breakdown">
                      <Flame className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleMagicBreakdown(newTaskTitle, 1)}>
                      <Flame className="mr-2 h-4 w-4" />
                      Basic Breakdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMagicBreakdown(newTaskTitle, 2)}>
                      <div className="mr-2 flex">
                        <Flame className="h-4 w-4" />
                        <Flame className="h-4 w-4" />
                      </div>
                      Detailed Breakdown
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMagicBreakdown(newTaskTitle, 3)}>
                      <div className="mr-2 flex">
                        <Flame className="h-4 w-4" />
                        <Flame className="h-4 w-4" />
                        <Flame className="h-4 w-4" />
                      </div>
                      Comprehensive Breakdown
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground">Tip: Use the flame button for automatic task breakdown</p>
            </div>
          </CardContent>
        )}

        <CardFooter className="pt-2">
          {project.collaborators.length > 0 && (
            <div className="text-xs text-muted-foreground">Collaborators: {project.collaborators.join(", ")}</div>
          )}
        </CardFooter>
      </Card>

      <CreateProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCreateProject={onUpdate}
        existingProject={project}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.name}" and all its tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(project.id)}
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
