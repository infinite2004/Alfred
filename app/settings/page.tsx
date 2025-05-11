"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Loader2,
  Bell,
  Shield,
  Palette,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Laptop,
  KeyRound,
  LogOut,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [deadlineNotifications, setDeadlineNotifications] = useState(true)
  const [notificationSound, setNotificationSound] = useState(true)
  const [notificationTime, setNotificationTime] = useState("30")

  // Appearance settings
  const [theme, setTheme] = useState("system")
  const [colorScheme, setColorScheme] = useState("purple")
  const [compactMode, setCompactMode] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState("medium")

  // Privacy settings
  const [shareActivity, setShareActivity] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [autoLogout, setAutoLogout] = useState("never")
  const [dataCollection, setDataCollection] = useState(true)

  // Account settings
  const [timezone, setTimezone] = useState("America/New_York")
  const [language, setLanguage] = useState("en")
  const [deviceSync, setDeviceSync] = useState(true)

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the settings in your backend
      setSuccess(`${section} settings saved successfully`)

      toast({
        title: "Settings updated",
        description: `Your ${section.toLowerCase()} settings have been saved.`,
      })
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsLoading(true)
    setError(null)

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    // In a real app, you would delete the user's account
    // For now, just log them out
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully.",
      variant: "destructive",
    })
    logout()
    router.push("/auth/login")
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

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

        <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notification Sounds</h4>
                      <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                    </div>
                    <Switch checked={notificationSound} onCheckedChange={setNotificationSound} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="notificationTime">Notification Timing</Label>
                    <Select value={notificationTime} onValueChange={setNotificationTime}>
                      <SelectTrigger id="notificationTime">
                        <SelectValue placeholder="Select timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="120">2 hours before</SelectItem>
                        <SelectItem value="1440">1 day before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>Task Reminders</p>
                          <p className="text-sm text-muted-foreground">Get reminded about upcoming tasks</p>
                        </div>
                        <Switch checked={reminderNotifications} onCheckedChange={setReminderNotifications} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p>Deadline Alerts</p>
                          <p className="text-sm text-muted-foreground">Get alerted about approaching deadlines</p>
                        </div>
                        <Switch checked={deadlineNotifications} onCheckedChange={setDeadlineNotifications} />
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("Notification")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Notification Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 gap-2"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-6 w-6" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 gap-2"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-6 w-6" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center h-20 gap-2"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-6 w-6" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="colorScheme">Color Scheme</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Button
                        variant={colorScheme === "purple" ? "default" : "outline"}
                        className="bg-purple-600 hover:bg-purple-700 text-white h-10"
                        onClick={() => setColorScheme("purple")}
                      >
                        Purple
                      </Button>
                      <Button
                        variant={colorScheme === "blue" ? "default" : "outline"}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-10"
                        onClick={() => setColorScheme("blue")}
                      >
                        Blue
                      </Button>
                      <Button
                        variant={colorScheme === "green" ? "default" : "outline"}
                        className="bg-green-600 hover:bg-green-700 text-white h-10"
                        onClick={() => setColorScheme("green")}
                      >
                        Green
                      </Button>
                      <Button
                        variant={colorScheme === "red" ? "default" : "outline"}
                        className="bg-red-600 hover:bg-red-700 text-white h-10"
                        onClick={() => setColorScheme("red")}
                      >
                        Red
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select value={fontSize} onValueChange={setFontSize}>
                      <SelectTrigger id="fontSize">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium (Default)</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Compact Mode</h4>
                      <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Reduced Motion</h4>
                      <p className="text-sm text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("Appearance")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Appearance Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Share Activity</h4>
                      <p className="text-sm text-muted-foreground">Allow others to see your activity</p>
                    </div>
                    <Switch checked={shareActivity} onCheckedChange={setShareActivity} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show Email</h4>
                      <p className="text-sm text-muted-foreground">Make your email visible to other users</p>
                    </div>
                    <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Collection</h4>
                      <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                    </div>
                    <Switch checked={dataCollection} onCheckedChange={setDataCollection} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="autoLogout">Auto Logout</Label>
                    <Select value={autoLogout} onValueChange={setAutoLogout}>
                      <SelectTrigger id="autoLogout">
                        <SelectValue placeholder="Select auto logout time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="15">After 15 minutes</SelectItem>
                        <SelectItem value="30">After 30 minutes</SelectItem>
                        <SelectItem value="60">After 1 hour</SelectItem>
                        <SelectItem value="1440">After 1 day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>

                  {twoFactorAuth && (
                    <div className="border p-4 rounded-md bg-muted/50">
                      <h4 className="font-medium mb-2">Set Up Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan the QR code with an authenticator app or enter the code manually.
                      </p>
                      <div className="flex justify-center mb-4">
                        <div className="bg-white p-4 rounded-md">
                          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">QR Code Placeholder</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input id="verificationCode" placeholder="Enter 6-digit code" />
                      </div>
                      <Button className="mt-4">Verify</Button>
                    </div>
                  )}
                </div>

                <Button onClick={() => handleSaveSettings("Privacy")} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Privacy Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                          <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Device Sync</h4>
                        <p className="text-sm text-muted-foreground">Sync settings across devices</p>
                      </div>
                      <Switch checked={deviceSync} onCheckedChange={setDeviceSync} />
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Connected Devices</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-3">
                            <Laptop className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">MacBook Pro</p>
                              <p className="text-xs text-muted-foreground">Last active: Today</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Current
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium">iPhone 13</p>
                              <p className="text-xs text-muted-foreground">Last active: Yesterday</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSaveSettings("Account")} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Account Settings"
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
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
                        {confirmPassword && newPassword !== confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                      >
                        Change Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-red-100 dark:border-red-900">
                  <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                    <CardDescription>Actions that can't be undone</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Log Out of All Devices</h4>
                      <p className="text-sm text-muted-foreground">
                        This will log you out from all devices except this one.
                      </p>
                      <Button variant="outline" className="mt-2">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out Everywhere
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteAccount}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
