"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateProjectModal } from "@/components/create-project-modal"
import { ProjectCard } from "@/components/project-card"
import { useProjects, type Project } from "@/lib/store"
import { useOnboarding } from "@/components/onboarding/onboarding-provider"

export default function ProjectsPage() {
  const [projects, setProjects, isLoading] = useProjects()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { markStepComplete, startTour } = useOnboarding()

  useEffect(() => {
    // If there are projects and the project-card step hasn't been completed yet
    if (projects.length > 0) {
      // Wait a bit for the project card to render
      const timer = setTimeout(() => {
        startTour("project-card")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [projects, startTour])

  const handleCreateProject = (project: Project) => {
    setProjects([...projects, project])
    setIsModalOpen(false)
    markStepComplete("project-card")
  }

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map((project) => (project.id === updatedProject.id ? updatedProject : project)))
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Loading projects...</h2>
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
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and tasks</p>
          </div>
          <Button id="create-project-button" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No projects yet</h3>
              <p className="text-sm text-muted-foreground">Create your first project to get started</p>
              <Button variant="outline" onClick={() => setIsModalOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={handleUpdateProject}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </MainLayout>
  )
}
