"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { OnboardingData } from "@/app/onboarding/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus } from "lucide-react"

interface ProjectInitializationProps {
  data: OnboardingData["project"]
  updateData: (data: Partial<OnboardingData["project"]>) => void
  onContinue: () => void
  onBack: () => void
  onSkip: () => void
}

export function ProjectInitialization({ data, updateData, onContinue, onBack, onSkip }: ProjectInitializationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState("")
  const [collaboratorInput, setCollaboratorInput] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.name.trim()) {
      newErrors.name = "Project name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      onContinue()
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      updateData({ tags: [...data.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    updateData({ tags: data.tags.filter((t) => t !== tag) })
  }

  const handleAddCollaborator = () => {
    if (collaboratorInput.trim() && !data.collaborators.includes(collaboratorInput.trim())) {
      updateData({ collaborators: [...data.collaborators, collaboratorInput.trim()] })
      setCollaboratorInput("")
    }
  }

  const handleRemoveCollaborator = (collaborator: string) => {
    updateData({ collaborators: data.collaborators.filter((c) => c !== collaborator) })
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Step 3: Start Your First Project</CardTitle>
        <CardDescription>Create a project to organize your tasks and deadlines</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            placeholder="Research Paper"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Write a brief description of your project..."
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={data.dueDate}
            onChange={(e) => updateData({ dueDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={data.status}
            onValueChange={(value) => updateData({ status: value as OnboardingData["project"]["status"] })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} size="icon" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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

        <div className="space-y-2">
          <Label htmlFor="collaborators">Collaborators</Label>
          <div className="flex gap-2">
            <Input
              id="collaborators"
              placeholder="Enter email address"
              value={collaboratorInput}
              onChange={(e) => setCollaboratorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCollaborator()
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddCollaborator}
              size="icon"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.collaborators.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.collaborators.map((collaborator) => (
                <Badge key={collaborator} variant="outline" className="flex items-center gap-1">
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
        <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700">
          Create Project
        </Button>
      </CardFooter>
    </Card>
  )
}
