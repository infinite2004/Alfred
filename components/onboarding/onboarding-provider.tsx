"use client"

import { createContext, useContext, useEffect, useState, createElement } from "react"
import { usePathname } from "next/navigation"

// Define the onboarding steps
export type OnboardingStep = "dashboard" | "projects" | "project-card" | "schedule" | "schedule-suggest" | "resources"

// Define the onboarding state
interface OnboardingState {
  completedSteps: OnboardingStep[]
  currentTour: OnboardingStep | null
  isActive: boolean
}

// Define the onboarding context
interface OnboardingContextType {
  onboardingState: OnboardingState
  startTour: (tour: OnboardingStep) => void
  endTour: () => void
  markStepComplete: (step: OnboardingStep) => void
  resetOnboarding: () => void
  hideOnboarding: () => void
  showOnboarding: () => void
  isOnboardingHidden: boolean
  progress: number
}

const OnboardingContext = createContext(undefined)

// Define the tour steps for each section
const tourStepTargets = {
  dashboard: "#dashboard-title",
  projects: "#create-project-button",
  "project-card": ".project-card",
  schedule: "#schedule-calendar",
  "schedule-suggest": "#suggest-time-block",
  resources: "#resources-panel",
}

const tourStepContent = {
  dashboard: "This is your dashboard — track your day at a glance!",
  projects: "Start a new project here. Add due dates, collaborators, and break it into tasks.",
  "project-card": "Click your project to view tasks and check them off as you go!",
  schedule: "This is your calendar. We'll help block time for work, study, and rest.",
  "schedule-suggest": "Click this to let Alfred find open slots based on your deadlines.",
  resources: "Find funding, mentorship, and collaboration opportunities here.",
}

export function OnboardingProvider(props) {
  const { children } = props
  const pathname = usePathname()
  const [onboardingState, setOnboardingState] = useState({
    completedSteps: [],
    currentTour: null,
    isActive: false,
  })
  const [isOnboardingHidden, setIsOnboardingHidden] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  // Load onboarding state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem("alfred_onboarding_state")
    const hiddenState = localStorage.getItem("alfred_onboarding_hidden")

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setOnboardingState(parsedState)
      } catch (error) {
        console.error("Failed to parse saved onboarding state:", error)
      }
    }

    if (hiddenState === "true") {
      setIsOnboardingHidden(true)
    }
  }, [])

  // Save onboarding state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("alfred_onboarding_state", JSON.stringify(onboardingState))
  }, [onboardingState])

  // Save hidden state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("alfred_onboarding_hidden", isOnboardingHidden.toString())
  }, [isOnboardingHidden])

  // Position the tooltip when the current tour changes
  useEffect(() => {
    if (!onboardingState.currentTour || !onboardingState.isActive) return

    const targetSelector = tourStepTargets[onboardingState.currentTour]
    const targetElement = document.querySelector(targetSelector)

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      setTooltipPosition({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX + rect.width / 2 - 150, // Center the tooltip (assuming width of 300px)
      })
    }
  }, [onboardingState.currentTour, onboardingState.isActive])

  // Auto-start tours based on pathname
  useEffect(() => {
    if (isOnboardingHidden) return

    // Wait a bit for the page to render
    const timer = setTimeout(() => {
      if (pathname === "/dashboard" && !onboardingState.completedSteps.includes("dashboard")) {
        startTour("dashboard")
      } else if (pathname === "/projects" && !onboardingState.completedSteps.includes("projects")) {
        startTour("projects")
      } else if (pathname === "/schedule" && !onboardingState.completedSteps.includes("schedule")) {
        startTour("schedule")
      } else if (pathname === "/resources" && !onboardingState.completedSteps.includes("resources")) {
        startTour("resources")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, isOnboardingHidden, onboardingState.completedSteps])

  const startTour = (tour) => {
    if (isOnboardingHidden) return
    setOnboardingState((prev) => ({
      ...prev,
      currentTour: tour,
      isActive: true,
    }))
  }

  const endTour = () => {
    setOnboardingState((prev) => ({
      ...prev,
      currentTour: null,
      isActive: false,
    }))
  }

  const markStepComplete = (step) => {
    setOnboardingState((prev) => {
      if (prev.completedSteps.includes(step)) {
        return prev
      }
      return {
        ...prev,
        completedSteps: [...prev.completedSteps, step],
      }
    })
  }

  const resetOnboarding = () => {
    setOnboardingState({
      completedSteps: [],
      currentTour: null,
      isActive: false,
    })
    setIsOnboardingHidden(false)
  }

  const hideOnboarding = () => {
    setIsOnboardingHidden(true)
    endTour()
  }

  const showOnboarding = () => {
    setIsOnboardingHidden(false)
  }

  // Calculate progress percentage
  const totalSteps = Object.keys(tourStepTargets).length
  const completedCount = onboardingState.completedSteps.length
  const progress = Math.round((completedCount / totalSteps) * 100)

  const contextValue = {
    onboardingState,
    startTour,
    endTour,
    markStepComplete,
    resetOnboarding,
    hideOnboarding,
    showOnboarding,
    isOnboardingHidden,
    progress,
  }

  // Create tooltip element if needed
  let tooltipElement = null
  if (!isOnboardingHidden && onboardingState.currentTour && onboardingState.isActive) {
    tooltipElement = createElement(
      "div",
      {
        className: "fixed z-50 bg-white rounded-lg shadow-lg p-4 w-[300px]",
        style: {
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        },
      },
      [
        createElement(
          "p",
          {
            className: "text-gray-800 mb-4",
            key: "tooltip-text",
          },
          tourStepContent[onboardingState.currentTour],
        ),
        createElement(
          "div",
          {
            className: "flex justify-between",
            key: "tooltip-buttons",
          },
          [
            createElement(
              "button",
              {
                onClick: () => {
                  markStepComplete(onboardingState.currentTour)
                  endTour()
                },
                className: "px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700",
                key: "got-it-button",
              },
              "Got it",
            ),
            createElement(
              "button",
              {
                onClick: () => {
                  hideOnboarding()
                },
                className: "px-4 py-2 text-gray-600 hover:text-gray-800",
                key: "skip-button",
              },
              "Skip tour",
            ),
          ],
        ),
      ],
    )
  }

  // Use createElement instead of JSX
  return createElement(OnboardingContext.Provider, { value: contextValue }, [tooltipElement, children])
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
