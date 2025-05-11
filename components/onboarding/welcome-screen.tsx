"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface WelcomeScreenProps {
  onContinue: () => void
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">👋</span>
          </div>
        </motion.div>
        <CardTitle className="text-3xl font-bold">Welcome to Alfred</CardTitle>
        <CardDescription className="text-lg">
          Your personal productivity assistant for managing projects, schedules, and academic resources.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p>
          Alfred helps you organize your academic life with smart time-blocking, project tracking, and resource
          management.
        </p>
        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium">Project Tracking</h3>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl mb-2">⏰</div>
            <h3 className="font-medium">Time Blocking</h3>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-medium">Resources</h3>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" onClick={onContinue} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
          Let&apos;s Get Started
        </Button>
      </CardFooter>
    </Card>
  )
}
