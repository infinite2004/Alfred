"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Calendar, CheckCircle2, Clock, Award, BookOpen } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [bio, setBio] = useState("Computer Science student at NYU. Interested in web development and AI.")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate passwords match if changing password
      if (newPassword && newPassword !== confirmPassword) {
        setError("New passwords do not match")
        setIsLoading(false)
        return
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the user profile in your backend
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for statistics
  const stats = [
    { label: "Projects Completed", value: 12, icon: CheckCircle2 },
    { label: "Hours Tracked", value: 87, icon: Clock },
    { label: "Streak", value: "14 days", icon: Award },
    { label: "Resources Saved", value: 23, icon: BookOpen },
  ]

  // Mock data for recent activity
  const recentActivity = [
    { type: "project", action: "completed", name: "Research Paper", date: "2 days ago" },
    { type: "task", action: "added", name: "Study for Finals", date: "3 days ago" },
    { type: "schedule", action: "created", name: "Group Meeting", date: "5 days ago" },
    { type: "resource", action: "saved", name: "NYU MakerSpace Guide", date: "1 week ago" },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <p className="mt-2 text-sm">{bio}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline">Computer Science</Badge>
                      <Badge variant="outline">Web Development</Badge>
                      <Badge variant="outline">AI</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Your productivity metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex flex-col items-center p-3 border rounded-lg">
                        <stat.icon className="h-8 w-8 text-primary mb-2" />
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Schedule</CardTitle>
                <CardDescription>Your next 3 scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {["Group Project Meeting", "Study Session", "Office Hours"][index]}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {["Tomorrow, 2:00 PM", "Friday, 10:00 AM", "Monday, 3:30 PM"][index]}
                        </p>
                      </div>
                      <Badge variant="outline" className={index === 0 ? "bg-purple-100" : ""}>
                        {["Project", "Study", "Class"][index]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {success && (
                      <Alert>
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="text-2xl">{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Profile Picture</Label>
                      <Input id="avatar" type="file" className="cursor-pointer" />
                      <p className="text-xs text-muted-foreground">Recommended: Square image, at least 300x300px</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button type="button">Change Password</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent actions and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "project"
                            ? "bg-purple-100 text-purple-600"
                            : activity.type === "task"
                              ? "bg-blue-100 text-blue-600"
                              : activity.type === "schedule"
                                ? "bg-green-100 text-green-600"
                                : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {activity.type === "project" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : activity.type === "task" ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : activity.type === "schedule" ? (
                          <Calendar className="h-5 w-5" />
                        ) : (
                          <BookOpen className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p>
                          You {activity.action}{" "}
                          <span className="font-medium">
                            {activity.type === "project" || activity.type === "resource"
                              ? "the "
                              : activity.type === "task"
                                ? "a task: "
                                : "an event: "}
                            {activity.name}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
