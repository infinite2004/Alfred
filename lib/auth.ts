"use client"

import React from "react"

import { createContext, useContext, useState } from "react"

// Define user type
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    avatar: "/stylized-jd-initials.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    avatar: "/javascript-code.png",
  },
]

// Auth provider component
export function AuthProvider(props) {
  const { children } = props

  // Get stored user from localStorage on initial render
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize user from localStorage
  useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Failed to parse stored user:", error)
        }
      }
    }
  })

  // Login function
  const login = async (email, password) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = MOCK_USERS.find((u) => u.email === email)

    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return { success: true, message: "Login successful" }
    }

    setIsLoading(false)
    return { success: false, message: "Invalid email or password" }
  }

  // Signup function
  const signup = async (name, email, password) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUser = MOCK_USERS.find((u) => u.email === email)

    if (existingUser) {
      setIsLoading(false)
      return { success: false, message: "Email already in use" }
    }

    // In a real app, you would create a new user in your database
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      avatar: `/placeholder.svg?height=40&width=40&query=${name.charAt(0)}${name.split(" ")[1]?.charAt(0) || ""}`,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
    return { success: true, message: "Account created successfully" }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Create the context value
  const contextValue = {
    user,
    isLoading,
    login,
    signup,
    logout,
  }

  // Use createElement instead of JSX
  return React.createElement(AuthContext.Provider, { value: contextValue }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
