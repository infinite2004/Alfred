import { cn } from "@/lib/utils"

interface OnboardingProgressProps {
  currentStep: number
  totalSteps: number
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            {/* Line before step (except first step) */}
            {index > 0 && (
              <div
                className={cn(
                  "h-1 w-full",
                  index <= currentStep - 1 ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700",
                )}
              />
            )}

            {/* Step circle */}
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                index + 1 === currentStep
                  ? "bg-purple-600 text-white"
                  : index + 1 < currentStep
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
              )}
            >
              {index + 1 < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Line after step (except last step) */}
            {index < totalSteps - 1 && (
              <div
                className={cn("h-1 w-full", index < currentStep ? "bg-purple-600" : "bg-gray-200 dark:bg-gray-700")}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className={cn(currentStep === 1 && "text-purple-600 font-medium")}>Profile</div>
        <div className={cn(currentStep === 2 && "text-purple-600 font-medium")}>Schedule</div>
        <div className={cn(currentStep === 3 && "text-purple-600 font-medium")}>Project</div>
        <div className={cn(currentStep === 4 && "text-purple-600 font-medium")}>Time Blocking</div>
      </div>
    </div>
  )
}
