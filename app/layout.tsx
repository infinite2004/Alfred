import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { OnboardingProvider } from "@/components/onboarding/onboarding-provider"
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Productivity Tool",
  description: "Project tracking with smart time-blocking scheduling for students",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <OnboardingProvider>
              {children}
              <OnboardingProgress />
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
