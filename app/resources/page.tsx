"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the ResourceCard component at the top level
function ResourceCard({
  title,
  description,
  items,
  badge,
  badgeColor,
}: {
  title: string
  description: string
  items: string[]
  badge: string
  badgeColor: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className={badgeColor}>
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
        <Button variant="link" className="mt-4 p-0 h-auto" size="sm">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          More Info
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("makerspace")

  // Define resource data
  const makerspaceResources = [
    {
      title: "Prototyping Fund",
      description: "Funding and support for student prototyping projects",
      items: [
        "Funding: Up to $500 in Phase 1 and up to $2,000 in Phase 2",
        "Eligibility: Open to both undergraduate and graduate students across NYU",
        "Support Includes: Access to MakerSpace tools (e.g., 3D printers, laser cutters), mentorship, and prototyping workshops",
        "Application Periods: Offered twice per year",
      ],
      badge: "Funding",
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "MakerSpace Mini Grant",
      description: "Small grants for early-stage prototyping needs",
      items: [
        "Funding: $50 grants for purchasing supplies or utilizing MakerSpace services",
        "Purpose: Ideal for early-stage prototyping needs",
      ],
      badge: "Funding",
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "DesignLab at MakerSpace",
      description: "Workshops and mentorship for design projects",
      items: [
        "Offerings: Weekly workshops on topics like Figma, Python, sustainability, and creative design",
        "Mentorship: One-on-one sessions for project feedback, portfolio reviews, and MakerSpace guidance",
      ],
      badge: "Workshop",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "MakerGarage",
      description: "Dedicated space for large-scale projects",
      items: [
        "Facility: A dedicated space for large-scale projects and Vertically Integrated Projects (VIPs)",
        "Features: Shared co-working areas with dedicated workbenches and storage",
      ],
      badge: "Facility",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
  ]

  const entrepreneurialResources = [
    {
      title: "Leslie eLab",
      description: "Co-working space and resources for entrepreneurs",
      items: [
        "Location: 16 Washington Place, NYC",
        "Facilities: 6,800-square-foot space with co-working areas, meeting rooms, event spaces, and a prototyping lab",
        "Access: Open to current NYU students, staff, and faculty",
      ],
      badge: "Facility",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: "NYU Entrepreneurial Institute",
      description: "Support services for student entrepreneurs",
      items: [
        "Services: Offers coaching, mentorship, and a suite of programs to support student entrepreneurs",
        "Programs Include:",
        "• Startup Bootcamp: Validate startup ideas and test business concepts",
        "• Summer Launchpad: Intensive 9-week accelerator program",
        "• Startup Sprint: Two-week program focusing on customer discovery",
      ],
      badge: "Program",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    },
    {
      title: "Funding & Competitions",
      description: "Financial opportunities for startups and initiatives",
      items: [
        "InnoVention Competition: Tech startup challenge with a $25,000 prize",
        "Green Grants: Up to $20,000 for sustainability initiatives or social-entrepreneurial ventures",
        "Innovation Venture Fund: Seed-stage investments for NYU-affiliated startups",
      ],
      badge: "Funding",
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
  ]

  const additionalResources = [
    {
      title: "Vertically Integrated Projects (VIP)",
      description: "Collaborative research projects",
      items: [
        "Collaborative research projects open to all NYU students",
        "Opportunity to work on multidisciplinary teams",
        "Gain hands-on experience in research and development",
      ],
      badge: "Research",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    },
    {
      title: "NYU Startup Guide",
      description: "Comprehensive resource for navigating the startup journey",
      items: [
        "Step-by-step guide for launching a startup at NYU",
        "Information on available resources and support",
        "Tips and best practices from successful NYU entrepreneurs",
      ],
      badge: "Guide",
      badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
    {
      title: "NYU Entrepreneurs Network Slack",
      description: "Connect with the NYU entrepreneurial community",
      items: [
        "Platform to connect with co-founders",
        "Browse internships and job opportunities",
        "Activate your network within the NYU community",
        "Get real-time updates on events and opportunities",
      ],
      badge: "Community",
      badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
    },
  ]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">Access study materials and campus resources</p>
        </div>

        <Tabs defaultValue="makerspace" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="makerspace">MakerSpace</TabsTrigger>
            <TabsTrigger value="entrepreneurial">Entrepreneurial</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          <TabsContent value="makerspace" className="space-y-4">
            <div id="resources-panel" className="grid gap-4 md:grid-cols-2">
              {makerspaceResources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  title={resource.title}
                  description={resource.description}
                  items={resource.items}
                  badge={resource.badge}
                  badgeColor={resource.badgeColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="entrepreneurial" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {entrepreneurialResources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  title={resource.title}
                  description={resource.description}
                  items={resource.items}
                  badge={resource.badge}
                  badgeColor={resource.badgeColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="additional" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {additionalResources.map((resource, index) => (
                <ResourceCard
                  key={index}
                  title={resource.title}
                  description={resource.description}
                  items={resource.items}
                  badge={resource.badge}
                  badgeColor={resource.badgeColor}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>How to access these resources</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md p-4">
                <p className="font-medium">Accessing NYU Resources</p>
                <p className="text-sm mt-1">
                  Most resources require an active NYU NetID. Visit the NYU website or contact the specific department
                  for detailed application instructions and eligibility requirements.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </MainLayout>
  )
}
