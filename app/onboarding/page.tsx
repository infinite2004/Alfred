"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth"
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress"
import { WelcomeScreen } from "@/components/onboarding/welcome-screen"
import { ProfileSetup } from "@/components/onboarding/profile-setup"
import { ScheduleImport } from "@/components/onboarding/schedule-import"
import { ProjectInitialization } from "@/components/onboarding/project-initialization"
import { TimeBlockingPreferences } from "@/components/onboarding/time-blocking-preferences"
import { SuccessSummary } from "@/components/onboarding/success-summary"

// Define the onboarding steps
export type OnboardingStep = "welcome" | "profile" | "schedule" | "project" | "timeblock" | "success"

// Define the onboarding data structure
export interface OnboardingData {
  profile: {
    fullName: string
    email: string
    major: string
  }
  schedule: {
    importMethod: "ics" | "manual" | null
    courses: Array<{
      name: string
      days: string[]
      startTime: string
      endTime: string
    }>
    icsFile?: File | null
  }
  project: {
    name: string
    description: string
    dueDate: string
    status: "Not Started" | "In Progress" | "Completed"
    tags: string[]
    collaborators: string[]
  }
  timeblock: {
    workHours: "morning" | "afternoon" | "evening" | "any"
    avoidDays: string[]
    sessionLength: 30 | 60 | 90 | 120
  }
}

// Initial onboarding data
const initialOnboardingData: OnboardingData = {
  profile: {
    fullName: "",
    email: "",
    major: "",
  },
  schedule: {
    importMethod: null,
    courses: [],
    icsFile: null,
  },
  project: {
    name: "",
    description: "",
    dueDate: "",
    status: "Not Started",
    tags: [],
    collaborators: [],
  },
  timeblock: {
    workHours: "any",
    avoidDays: [],
    sessionLength: 60,
  },
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome")
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(initialOnboardingData)
  const [isLoading, setIsLoading] = useState(false)

  // Load saved progress from localStorage on initial render
  useEffect(() => {
    // Check if we're coming from a reset action
    const resetFlag = localStorage.getItem("alfred_onboarding_reset")

    if (resetFlag === "true") {
      // Clear the reset flag
      localStorage.removeItem("alfred_onboarding_reset")
      // Start from the beginning
      setCurrentStep("welcome")
      setOnboardingData(initialOnboardingData)
      return
    }

    const savedProgress = localStorage.getItem("alfred_onboarding_progress")
    const savedData = localStorage.getItem("alfred_onboarding_data")

    if (savedProgress) {
      setCurrentStep(savedProgress as OnboardingStep)
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setOnboardingData(parsedData)
      } catch (error) {
        console.error("Failed to parse saved onboarding data:", error)
      }
    }

    // Pre-fill with user data if available
    if (user) {
      setOnboardingData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          fullName: user.name || prev.profile.fullName,
          email: user.email || prev.profile.email,
        },
      }))
    }
  }, [user])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("alfred_onboarding_progress", currentStep)
    localStorage.setItem("alfred_onboarding_data", JSON.stringify(onboardingData))
  }, [currentStep, onboardingData])

  // Handle navigation between steps
  const goToNextStep = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("profile")
        break
      case "profile":
        setCurrentStep("schedule")
        break
      case "schedule":
        setCurrentStep("project")
        break
      case "project":
        setCurrentStep("timeblock")
        break
      case "timeblock":
        setCurrentStep("success")
        break
      case "success":
        completeOnboarding()
        break
    }
  }

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "profile":
        setCurrentStep("welcome")
        break
      case "schedule":
        setCurrentStep("profile")
        break
      case "project":
        setCurrentStep("schedule")
        break
      case "timeblock":
        setCurrentStep("project")
        break
      case "success":
        setCurrentStep("timeblock")
        break
    }
  }

  const skipStep = () => {
    switch (currentStep) {
      case "schedule":
        setCurrentStep("project")
        break
      case "project":
        setCurrentStep("timeblock")
        break
      case "timeblock":
        setCurrentStep("success")
        break
    }
  }

  // Handle onboarding completion
  const completeOnboarding = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would save the onboarding data to the backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Clear onboarding data from localStorage
      localStorage.removeItem("alfred_onboarding_progress")
      localStorage.removeItem("alfred_onboarding_data")

      // Set onboarding completed flag
      localStorage.setItem("alfred_onboarding_completed", "true")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update onboarding data
  const updateOnboardingData = (step: keyof OnboardingData, data: Partial<OnboardingData[keyof OnboardingData]>) => {
    setOnboardingData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        ...data,
      },
    }))
  }

  // Determine if the current step is a numbered step (for progress indicator)
  const getStepNumber = (step: OnboardingStep): number | null => {
    switch (step) {
      case "profile":
        return 1
      case "schedule":
        return 2
      case "project":
        return 3
      case "timeblock":
        return 4
      default:
        return null
    }
  }

  // Animation variants for page transitions
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: -100,
    },
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Progress indicator (only show for numbered steps) */}
      {getStepNumber(currentStep) && (
        <div className="w-full max-w-3xl mx-auto px-4 pt-8">
          <OnboardingProgress currentStep={getStepNumber(currentStep) || 0} totalSteps={4} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full max-w-3xl"
          >
            {currentStep === "welcome" && <WelcomeScreen onContinue={goToNextStep} />}

            {currentStep === "profile" && (
              <ProfileSetup
                data={onboardingData.profile}
                updateData={(data) => updateOnboardingData("profile", data)}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === "schedule" && (
              <ScheduleImport
                data={onboardingData.schedule}
                updateData={(data) => updateOnboardingData("schedule", data)}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
                onSkip={skipStep}
              />
            )}

            {currentStep === "project" && (
              <ProjectInitialization
                data={onboardingData.project}
                updateData={(data) => updateOnboardingData("project", data)}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
                onSkip={skipStep}
              />
            )}

            {currentStep === "timeblock" && (
              <TimeBlockingPreferences
                data={onboardingData.timeblock}
                updateData={(data) => updateOnboardingData("timeblock", data)}
                onContinue={goToNextStep}
                onBack={goToPreviousStep}
                onSkip={skipStep}
              />
            )}

            {currentStep === "success" && (
              <SuccessSummary data={onboardingData} onComplete={completeOnboarding} isLoading={isLoading} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
