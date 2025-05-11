"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  Calendar,
  FolderKanban,
  BookOpen,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ResetOnboardingDialog } from "@/components/onboarding/reset-onboarding"

export function MainLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // If no user is logged in, redirect to login page
    if (isMounted && !user) {
      router.push("/auth/login")
    }
  }, [user, isMounted, router])

  const navItems = [
    { name: "Alfred", path: "/alfred", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Schedule", path: "/schedule", icon: Calendar },
    { name: "Projects", path: "/projects", icon: FolderKanban },
    { name: "Resources", path: "/resources", icon: BookOpen },
  ]

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!isMounted || !user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-600",
                    isActive ? "text-purple-600" : "text-muted-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", pathname.includes(item.path) && "text-purple-600")} />
                  <span className={cn(pathname.includes(item.path) && "font-semibold text-purple-600")}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsResetDialogOpen(true)} title="Learn about Alfred">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsResetDialogOpen(true)}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Learn about Alfred</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-background border-r w-64 p-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <div className="pt-4 mt-4 border-t">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-accent text-muted-foreground"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors hover:bg-accent text-muted-foreground"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-2 w-full justify-start text-muted-foreground"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsResetDialogOpen(true)
                }}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Learn about Alfred</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground mt-2"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container py-6">{children}</main>

      {/* Reset Onboarding Dialog */}
      <ResetOnboardingDialog isOpen={isResetDialogOpen} onClose={() => setIsResetDialogOpen(false)} />
    </div>
  )
}
