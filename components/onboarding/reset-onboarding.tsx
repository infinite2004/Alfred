"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ResetOnboardingDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ResetOnboardingDialog({ isOpen, onClose }: ResetOnboardingDialogProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleReset = () => {
    localStorage.removeItem("alfred_onboarding_progress")
    localStorage.removeItem("alfred_onboarding_data")
    localStorage.removeItem("alfred_onboarding_completed")
    localStorage.setItem("alfred_onboarding_reset", "true")
    onClose()
    router.push("/onboarding")
  }

  const handleViewFeatures = () => {
    onClose()
    router.push("/features")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Learn about Alfred</h2>
        <p className="mb-6">Would you like to view a guide to Alfred's features or restart the onboarding process?</p>

        <div className="space-y-3">
          <Button className="w-full" onClick={handleViewFeatures}>
            View Features Guide
          </Button>
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Restart Onboarding
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
