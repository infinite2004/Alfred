import { MainLayout } from "@/components/main-layout"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 id="dashboard-title" className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome to your productivity dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
              <p className="text-sm text-muted-foreground">
                You have no upcoming tasks. Create a project to get started.
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">Today's Schedule</h3>
              <p className="text-sm text-muted-foreground">You have no events scheduled for today.</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">Project Status</h3>
              <p className="text-sm text-muted-foreground">No active projects. Visit the Projects tab to create one.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
