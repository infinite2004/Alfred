"use client"

import { useState } from "react"
import { type Task, generateId } from "@/lib/store"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, Check, X } from "lucide-react"

interface TaskItemProps {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  level?: number
}

export function TaskItem({ task, onUpdate, onDelete, level = 0 }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")
  const [showAddSubtask, setShowAddSubtask] = useState(false)

  const handleToggleComplete = () => {
    onUpdate({
      ...task,
      completed: !task.completed,
    })
  }

  const handleSaveEdit = () => {
    if (editedTitle.trim()) {
      onUpdate({
        ...task,
        title: editedTitle,
      })
      setIsEditing(false)
    }
  }

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Task = {
        id: generateId(),
        title: newSubtaskTitle,
        completed: false,
        subtasks: [],
      }

      onUpdate({
        ...task,
        subtasks: [...task.subtasks, newSubtask],
      })

      setNewSubtaskTitle("")
      setShowAddSubtask(false)
      setIsExpanded(true)
    }
  }

  const handleSubtaskUpdate = (updatedSubtask: Task) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === updatedSubtask.id ? updatedSubtask : subtask,
    )

    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    })
  }

  const handleSubtaskDelete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId)

    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    })
  }

  const hasSubtasks = task.subtasks.length > 0

  return (
    <div className={`pl-${level * 4}`}>
      <div className="flex items-center gap-2 group">
        <Checkbox checked={task.completed} onCheckedChange={handleToggleComplete} id={`task-${task.id}`} />

        {isEditing ? (
          <div className="flex-1 flex gap-1">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveEdit()
                } else if (e.key === "Escape") {
                  setIsEditing(false)
                  setEditedTitle(task.title)
                }
              }}
            />
            <Button variant="ghost" size="icon" onClick={handleSaveEdit} className="h-8 w-8">
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsEditing(false)
                setEditedTitle(task.title)
              }}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor={`task-${task.id}`}
            className={`flex-1 text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {task.title}
          </label>
        )}

        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {hasSubtasks && (
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6">
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-6 w-6">
              <Edit className="h-3 w-3" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} className="h-6 w-6 text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setShowAddSubtask(!showAddSubtask)} className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {showAddSubtask && (
        <div className="flex gap-1 mt-1 ml-6">
          <Input
            placeholder="Add subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="h-7 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddSubtask()
              } else if (e.key === "Escape") {
                setShowAddSubtask(false)
                setNewSubtaskTitle("")
              }
            }}
          />
          <Button variant="ghost" size="icon" onClick={handleAddSubtask} className="h-7 w-7">
            <Check className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowAddSubtask(false)
              setNewSubtaskTitle("")
            }}
            className="h-7 w-7"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {isExpanded && hasSubtasks && (
        <div className="ml-6 mt-1 space-y-1">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onUpdate={handleSubtaskUpdate}
              onDelete={handleSubtaskDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
