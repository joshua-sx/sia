import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BellIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  CircleAlertIcon,
  FileTextIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SendIcon,
  Settings2Icon,
  SparklesIcon,
  UsersRoundIcon,
} from "lucide-react"

const metrics = [
  {
    label: "Cycle completion",
    value: "62%",
    helper: "Goal setting phase",
    detail: "Up 8 points this week",
  },
  {
    label: "Needs HR review",
    value: "18",
    helper: "Goals or appraiser issues",
    detail: "12 fewer than Monday",
  },
  {
    label: "Acknowledgments",
    value: "71%",
    helper: "Employees confirmed receipt",
    detail: "156 still pending",
  },
]

const actionItems = [
  {
    title: "Review flagged goals",
    detail: "18 goals need clarity or measurable outcomes before lock.",
    owner: "HR",
    status: "Today",
  },
  {
    title: "Nudge overdue managers",
    detail: "6 managers have not opened their team goal list this week.",
    owner: "Managers",
    status: "Due soon",
  },
  {
    title: "Confirm missing appraisers",
    detail: "4 employees have unclear reporting-line assignments.",
    owner: "People Ops",
    status: "Quiet",
  },
]

const cyclePhases = [
  ["Cycle setup", "Complete"],
  ["Goal setting", "Current"],
  ["Goal lock", "Next"],
  ["Mid-year review", "Optional"],
  ["Final appraisal", "Later"],
]

const feedItems = [
  "Rohit Verma submitted 8 team goals.",
  "Priya Nair edited one AI-assisted goal draft.",
  "A late-edit request was logged with a reason.",
]

function SoftStat({ metric }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-3xl">{metric.value}</CardTitle>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`${metric.label} detail`}>
                <CircleAlertIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{metric.detail}</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{metric.helper}</p>
      </CardContent>
    </Card>
  )
}

function ActionList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Action needed</CardTitle>
        <CardDescription>Only the work that needs attention right now.</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="More action options">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>Export queue</DropdownMenuItem>
                <DropdownMenuItem>Adjust reminder cadence</DropdownMenuItem>
                <DropdownMenuItem>View audit trail</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {actionItems.map((item) => (
          <div
            className="flex flex-col gap-3 rounded-xl border bg-background p-4 md:flex-row md:items-start md:justify-between"
            key={item.title}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <ListChecksIcon />
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-medium">{item.title}</div>
                <p className="max-w-prose text-muted-foreground">{item.detail}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary">{item.owner}</Badge>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">Review</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CycleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>2026 Annual Appraisal Cycle</CardTitle>
        <CardDescription>Goal setting is open until Feb 28. Locking is the next controlled step.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Settings2Icon data-icon="inline-start" />
            Configure
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall completion</span>
            <span className="font-medium">62%</span>
          </div>
          <Progress value={62} />
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {cyclePhases.map(([phase, status]) => (
            <div className="rounded-xl border bg-background p-3" key={phase}>
              <div className="mb-3 flex items-center justify-between">
                <CheckCircle2Icon className="text-muted-foreground" />
                <Badge variant={status === "Current" ? "default" : "secondary"}>{status}</Badge>
              </div>
              <div className="text-sm font-medium">{phase}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CopilotCard({ assistantPrompt, setAssistantPrompt }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI writing assistant</CardTitle>
        <CardDescription>
          Helps managers improve wording. It never recommends scores or final decisions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="min-w-0 rounded-2xl border bg-background p-2 shadow-sm">
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="icon-sm" aria-label="Add context">
              <SparklesIcon />
            </Button>
            <Input
              value={assistantPrompt}
              onChange={(event) => setAssistantPrompt(event.target.value)}
              placeholder="Ask SIA to make this goal clearer..."
              className="min-w-0 border-0 shadow-none focus-visible:ring-0"
            />
            <Button size="icon-sm" aria-label="Send prompt">
              <SendIcon />
            </Button>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button variant="outline" size="sm">Make SMART</Button>
          <Button variant="outline" size="sm">Improve tone</Button>
          <Button variant="outline" size="sm">Summarize notes</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ExploreTabs() {
  return (
    <Tabs defaultValue="queue">
      <div className="flex items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <Button variant="ghost" size="sm">View all</Button>
      </div>

      <TabsContent value="queue">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-0">
            {[
              ["Operations", "3 goals flagged", "Review clarity"],
              ["Security", "2 managers overdue", "Send reminder"],
              ["HR", "Import verified", "No action"],
            ].map(([team, issue, action]) => (
              <div className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4" key={team}>
                <div>
                  <div className="font-medium">{team}</div>
                  <p className="text-muted-foreground">{issue}</p>
                </div>
                <Button variant="outline" size="sm">{action}</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="insights">
        <Card>
          <CardContent className="grid gap-4 pt-0 md:grid-cols-2">
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <UsersRoundIcon />
                Manager workload
              </div>
              <p className="text-muted-foreground">Most overdue work is concentrated in 6 manager teams.</p>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <LockKeyholeIcon />
                Record readiness
              </div>
              <p className="text-muted-foreground">No locked records have been edited after deadline.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-0">
            {feedItems.map((item) => (
              <div className="flex items-center gap-3 rounded-xl border bg-background p-4" key={item}>
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  <FileTextIcon />
                </div>
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export function App() {
  const [assistantPrompt, setAssistantPrompt] = useState("")

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>SIA dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm md:flex">
                <SearchIcon />
                Search reviews, goals, people...
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="Notifications">
                <BellIcon />
              </Button>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 p-4 md:p-8">
            <section className="flex min-w-0 flex-col gap-5 py-4 md:py-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex w-full max-w-[22rem] flex-col gap-3 md:max-w-3xl">
                  <Badge variant="secondary" className="w-fit">PJIA · Goal setting phase</Badge>
                  <h1 className="text-balance font-heading text-3xl font-medium tracking-tight md:text-5xl">
                    What needs HR attention today?
                  </h1>
                  <p className="text-base text-muted-foreground md:text-lg">
                    A calm workspace for cycle health, manager follow-up, and AI-assisted writing review.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <CalendarClockIcon data-icon="inline-start" />
                    Reminders
                  </Button>
                  <Button>
                    <ClipboardCheckIcon data-icon="inline-start" />
                    Start review
                  </Button>
                </div>
              </div>

              <CopilotCard assistantPrompt={assistantPrompt} setAssistantPrompt={setAssistantPrompt} />
            </section>

            <section className="grid min-w-0 gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <SoftStat metric={metric} key={metric.label} />
              ))}
            </section>

            <section className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_.85fr]">
              <div className="flex min-w-0 flex-col gap-6">
                <ActionList />
                <ExploreTabs />
              </div>
              <div className="flex min-w-0 flex-col gap-6">
                <CycleCard />
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced details</CardTitle>
                    <CardDescription>Kept quiet until HR needs to inspect them.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="audit">
                        <AccordionTrigger>Audit and permissions</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          AI assistance, late edits, appraiser changes, and locked-record access are visible in the HR audit log.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="quality">
                        <AccordionTrigger>Goal quality checks</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Goals are flagged for missing outcomes, vague measurements, or deadline gaps before the lock phase.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="exports">
                        <AccordionTrigger>Exports</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          CSV exports and employee-facing PDFs are available after HR closure.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
