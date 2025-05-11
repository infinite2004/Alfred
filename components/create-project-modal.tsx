"use client"

import { useState } from "react"
import { X, Plus, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { type Project, generateId, type Task } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateProject: (project: Project) => void
  existingProject?: Project
}

export function CreateProjectModal({ isOpen, onClose, onCreateProject, existingProject }: CreateProjectModalProps) {
  const [name, setName] = useState(existingProject?.name || "")
  const [description, setDescription] = useState(existingProject?.description || "")
  const [dueDate, setDueDate] = useState(existingProject?.dueDate || "")
  const [status, setStatus] = useState<"Not Started" | "In Progress" | "Done">(existingProject?.status || "Not Started")
  const [collaboratorInput, setCollaboratorInput] = useState("")
  const [collaborators, setCollaborators] = useState<string[]>(existingProject?.collaborators || [])
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(existingProject?.tags || [])

  const [breakdownInput, setBreakdownInput] = useState("")
  const [granularityLevel, setGranularityLevel] = useState(2) // Default to medium (1-3)
  const [isBreakingDown, setIsBreakingDown] = useState(false)

  const handleAddCollaborator = () => {
    if (collaboratorInput.trim() && !collaborators.includes(collaboratorInput.trim())) {
      setCollaborators([...collaborators, collaboratorInput.trim()])
      setCollaboratorInput("")
    }
  }

  const handleRemoveCollaborator = (collaborator: string) => {
    setCollaborators(collaborators.filter((c) => c !== collaborator))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleBreakdown = () => {
    if (!breakdownInput.trim()) return

    setIsBreakingDown(true)

    // Simulate API call delay
    setTimeout(() => {
      const newTasks: Task[] = generateBreakdownTasks(breakdownInput, granularityLevel)

      // Add the generated tasks to the project
      const updatedTasks = [...(existingProject?.tasks || []), ...newTasks]

      // Update the tasks state (this will be included in the project when submitted)
      existingProject ? onCreateProject({ ...existingProject, tasks: updatedTasks }) : null

      // Reset the input
      setBreakdownInput("")
      setIsBreakingDown(false)
    }, 1000)
  }

  // Helper function to generate tasks based on input and granularity
  const generateBreakdownTasks = (input: string, granularity: number): Task[] => {
    // This would ideally call an AI service, but for demo we'll use predefined breakdowns
    const breakdowns: Record<string, string[][]> = {
      study: [
        // Low granularity (1 flame)
        ["Research study materials", "Create a study schedule", "Complete study sessions"],
        // Medium granularity (2 flames)
        [
          "Identify learning objectives",
          "Find and select learning resources",
          "Create a study schedule",
          "Take notes during study sessions",
          "Review and practice regularly",
        ],
        // High granularity (3 flames)
        [
          "Identify specific learning objectives",
          "Research and compare learning resources",
          "Select the best resources for your learning style",
          "Create a detailed study schedule with time blocks",
          "Set up an optimal study environment",
          "Take comprehensive notes during study sessions",
          "Create flashcards or summaries for key concepts",
          "Practice with exercises or sample problems",
          "Review material regularly using spaced repetition",
          "Test your knowledge with self-assessments",
        ],
      ],
      project: [
        // Low granularity
        ["Plan the project", "Execute the project", "Review and finalize"],
        // Medium granularity
        [
          "Define project scope and objectives",
          "Create a project timeline",
          "Gather necessary resources",
          "Execute project tasks",
          "Review and make adjustments",
          "Finalize and deliver",
        ],
        // High granularity
        [
          "Define specific project goals and objectives",
          "Identify all stakeholders and their requirements",
          "Create a detailed project scope document",
          "Break down the project into specific tasks",
          "Estimate time required for each task",
          "Create a comprehensive timeline with milestones",
          "Identify and acquire necessary resources",
          "Assign responsibilities to team members",
          "Set up regular progress check-ins",
          "Execute project tasks according to timeline",
          "Monitor progress and address issues promptly",
          "Conduct quality assurance checks",
          "Gather feedback from stakeholders",
          "Make necessary adjustments",
          "Prepare final deliverables",
          "Conduct a project retrospective",
        ],
      ],
      research: [
        // Low granularity
        ["Define research topic", "Gather information", "Analyze and conclude"],
        // Medium granularity
        [
          "Define research question",
          "Review existing literature",
          "Design research methodology",
          "Collect data",
          "Analyze findings",
          "Draw conclusions",
        ],
        // High granularity
        [
          "Identify specific research question or hypothesis",
          "Conduct preliminary background research",
          "Review existing literature and identify gaps",
          "Refine research question based on findings",
          "Design detailed research methodology",
          "Create data collection instruments",
          "Identify and recruit participants if applicable",
          "Collect data systematically",
          "Organize and prepare data for analysis",
          "Analyze data using appropriate methods",
          "Interpret results in context of research question",
          "Compare findings with existing literature",
          "Draw conclusions and identify implications",
          "Prepare research report or presentation",
          "Review and revise final document",
        ],
      ],
    }

    // Default to medium granularity if not specified
    const granularityIndex = Math.min(Math.max(granularity - 1, 0), 2)

    // Find the best match for the input
    const inputLower = input.toLowerCase()
    let bestMatch = "project" // Default

    for (const key of Object.keys(breakdowns)) {
      if (inputLower.includes(key)) {
        bestMatch = key
        break
      }
    }

    // Get the tasks for the best match and granularity
    const tasks = breakdowns[bestMatch][granularityIndex]

    // Convert to Task objects
    return tasks.map((title) => ({
      id: generateId(),
      title,
      completed: false,
      subtasks: [],
    }))
  }

  const handleSubmit = () => {
    if (!name.trim()) return

    const project: Project = {
      id: existingProject?.id || generateId(),
      name,
      description,
      dueDate,
      status,
      collaborators,
      tags,
      tasks: existingProject?.tasks || [],
    }

    onCreateProject(project)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setDueDate("")
    setStatus("Not Started")
    setCollaboratorInput("")
    setCollaborators([])
    setTagInput("")
    setTags([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{existingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {existingProject ? "Update your project details below." : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Project Name
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter project name" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </label>
            <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "Not Started" | "In Progress" | "Done")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="collaborators" className="text-sm font-medium">
              Collaborators
            </label>
            <div className="flex gap-2">
              <Input
                id="collaborators"
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                placeholder="Enter email address"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCollaborator()
                  }
                }}
              />
              <Button type="button" onClick={handleAddCollaborator} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {collaborators.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {collaborators.map((collaborator) => (
                  <Badge key={collaborator} variant="secondary" className="flex items-center gap-1">
                    {collaborator}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveCollaborator(collaborator)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Tasks</TabsTrigger>
              <TabsTrigger value="magic">Magic Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <p className="text-sm text-muted-foreground mb-2">
                You can add tasks manually after creating the project.
              </p>
            </TabsContent>
            <TabsContent value="magic" className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="breakdown" className="text-sm font-medium flex justify-between">
                  <span>Enter a task to break down</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">Detail level:</span>
                    {[1, 2, 3].map((level) => (
                      <Button
                        key={level}
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 ${granularityLevel === level ? "text-primary" : "text-muted-foreground"}`}
                        onClick={() => setGranularityLevel(level)}
                      >
                        <Flame className="h-4 w-4" fill={granularityLevel >= level ? "currentColor" : "none"} />
                      </Button>
                    ))}
                  </div>
                </label>
                <div className="flex gap-2">
                  <Textarea
                    id="breakdown"
                    value={breakdownInput}
                    onChange={(e) => setBreakdownInput(e.target.value)}
                    placeholder="e.g., Study for finals, Research paper, Group project..."
                    rows={2}
                  />
                  <Button
                    onClick={handleBreakdown}
                    className="self-end"
                    disabled={!breakdownInput.trim() || isBreakingDown}
                  >
                    {isBreakingDown ? "Breaking down..." : "Break Down"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Magic Breakdown will automatically create subtasks based on your input. More flames = more detailed
                  breakdown.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {existingProject ? "Update Project" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
