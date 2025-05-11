import { MainLayout } from "@/components/main-layout"

export default function AlfredPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alfred</h1>
          <p className="text-muted-foreground">Your personal productivity assistant</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Welcome to Alfred</h3>
            <p className="text-sm text-muted-foreground">
              Alfred is your personal productivity assistant. This feature is coming soon.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
