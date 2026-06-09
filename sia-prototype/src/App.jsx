import { useEffect, useMemo, useState } from "react"
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
  DownloadIcon,
  FileTextIcon,
  GoalIcon,
  ListChecksIcon,
  LockKeyholeIcon,
  RotateCcwIcon,
  SearchIcon,
  SendIcon,
  Settings2Icon,
  SparklesIcon,
  UsersRoundIcon,
} from "lucide-react"
import {
  approveGoal,
  createInitialDemoState,
  getDemoSummary,
  markAcknowledged,
  requestGoalRevision,
  sendReminder,
} from "@/data/workflow"

const viewLabels = {
  dashboard: "SIA dashboard",
  cycle: "Appraisal cycle",
  people: "People",
  goals: "Goal review",
  reports: "Reports & audit",
  settings: "Settings",
}

function getPerson(state, personId) {
  return state.people.find((person) => person.id === personId)
}

function statusVariant(status) {
  if (status === "approved" || status === "acknowledged" || status === "Ready") return "default"
  if (status === "flagged" || status === "revision_requested" || status === "needs_appraiser") return "destructive"
  return "secondary"
}

function readableStatus(status) {
  return status.replaceAll("_", " ")
}

function PageHeader({ actions, children, description, eyebrow, title }) {
  return (
    <section className="flex min-w-0 flex-col gap-5 py-4 md:py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex w-full max-w-[22rem] flex-col gap-3 md:max-w-3xl">
          {eyebrow ? <Badge variant="secondary" className="w-fit">{eyebrow}</Badge> : null}
          <h1 className="text-balance font-heading text-3xl font-medium tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}

function SoftStat({ detail, helper, label, value }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`${label} detail`}>
                <CircleAlertIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{detail}</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  )
}

function CopilotCard({ activeGoal, assistantPrompt, assistantResponse, onPromptChange, onRespond }) {
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
              onChange={(event) => onPromptChange(event.target.value)}
              placeholder="Ask SIA..."
              className="min-w-0 border-0 shadow-none focus-visible:ring-0"
            />
            <Button size="icon-sm" aria-label="Send prompt" onClick={() => onRespond(activeGoal?.aiSuggestion)}>
              <SendIcon />
            </Button>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onRespond(activeGoal?.aiSuggestion)}>Make SMART</Button>
          <Button variant="outline" size="sm" onClick={() => onRespond("Tone adjusted: clear, direct, and suitable for appraisal records.")}>Improve tone</Button>
          <Button variant="outline" size="sm" onClick={() => onRespond("Summary: goal needs a measurable outcome, owner, and deadline before lock.")}>Summarize notes</Button>
        </div>
        {assistantResponse ? (
          <div className="rounded-xl border bg-muted/40 p-4 text-sm">
            <div className="mb-1 font-medium">Suggested wording</div>
            <p className="text-muted-foreground">{assistantResponse}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ActionList({ onNavigate, onSendReminder, summary }) {
  const actions = [
    {
      title: "Review flagged goals",
      detail: `${summary.flaggedGoals} goals need clarity or measurable outcomes before lock.`,
      owner: "HR",
      status: "Today",
      action: () => onNavigate("goals"),
      button: "Review",
    },
    {
      title: "Nudge overdue managers",
      detail: `${summary.overdueManagers} manager team needs a quiet reminder before lock readiness.`,
      owner: "Managers",
      status: "Due soon",
      action: onSendReminder,
      button: "Send",
    },
    {
      title: "Confirm missing appraisers",
      detail: `${summary.missingAppraisers} employee has an unclear appraiser assignment.`,
      owner: "People Ops",
      status: "Quiet",
      action: () => onNavigate("people"),
      button: "Open",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action needed</CardTitle>
        <CardDescription>Only the work that needs attention right now.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {actions.map((item) => (
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
            <Button variant="outline" size="sm" onClick={item.action}>{item.button}</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CycleCard({ cycle, summary, onNavigate }) {
  const cyclePhases = [
    ["Cycle setup", "Complete"],
    [cycle.phase, "Current"],
    ["Goal lock", "Next"],
    ["Mid-year review", "Optional"],
    ["Final appraisal", "Later"],
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{cycle.name}</CardTitle>
        <CardDescription>Goal setting is open until {cycle.phaseDates.goalSetting}. Locking is the next controlled step.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" onClick={() => onNavigate("cycle")}>
            <Settings2Icon data-icon="inline-start" />
            Configure
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall completion</span>
            <span className="font-medium">{summary.completion}%</span>
          </div>
          <Progress value={summary.completion} />
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

function ExploreTabs({ onNavigate, state, summary }) {
  return (
    <Tabs defaultValue="queue">
      <div className="flex items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <Button variant="ghost" size="sm" onClick={() => onNavigate("reports")}>View all</Button>
      </div>

      <TabsContent value="queue">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-0">
            {[
              ["Operations", `${summary.flaggedGoals} goals flagged`, "Review clarity", "goals"],
              ["Security", `${summary.overdueManagers} manager overdue`, "Send reminder", "people"],
              ["HR", `${summary.missingAppraisers} appraiser issue`, "Open people", "people"],
            ].map(([team, issue, action, view]) => (
              <div className="flex items-center justify-between gap-4 rounded-xl border bg-background p-4" key={team}>
                <div>
                  <div className="font-medium">{team}</div>
                  <p className="text-muted-foreground">{issue}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => onNavigate(view)}>{action}</Button>
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
              <p className="text-muted-foreground">Most overdue work is concentrated in {summary.overdueManagers} manager team.</p>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 font-medium">
                <LockKeyholeIcon />
                Record readiness
              </div>
              <p className="text-muted-foreground">{state.goals.filter((goal) => goal.status === "approved").length} goals are ready for lock.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardContent className="flex flex-col gap-3 pt-0">
            {state.auditEvents.slice(0, 3).map((item) => (
              <div className="flex items-center gap-3 rounded-xl border bg-background p-4" key={item.id}>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <FileTextIcon />
                </div>
                <p className="text-muted-foreground">{item.actor} - {item.action}: {item.target}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function DashboardView({ activeGoal, assistant, handlers, state, summary }) {
  return (
    <>
      <PageHeader
        eyebrow={`${state.cycle.organization} - ${state.cycle.phase} phase`}
        title="What needs HR attention today?"
        description="A calm workspace for cycle health, manager follow-up, and AI-assisted writing review."
        actions={(
          <>
            <Button variant="outline" onClick={() => handlers.sendReminder("person-6", "manager")}>
              <CalendarClockIcon data-icon="inline-start" />
              Reminders
            </Button>
            <Button onClick={() => handlers.navigate("goals")}>
              <ClipboardCheckIcon data-icon="inline-start" />
              Start review
            </Button>
          </>
        )}
      >
        <CopilotCard
          activeGoal={activeGoal}
          assistantPrompt={assistant.prompt}
          assistantResponse={assistant.response}
          onPromptChange={assistant.setPrompt}
          onRespond={assistant.respond}
        />
      </PageHeader>

      <section className="grid min-w-0 gap-4 md:grid-cols-3">
        <SoftStat
          label="Cycle completion"
          value={`${summary.completion}%`}
          helper={state.cycle.phase}
          detail={`${summary.approvedGoals} goals approved for lock`}
        />
        <SoftStat
          label="Needs HR review"
          value={summary.flaggedGoals}
          helper="Goals or appraiser issues"
          detail={`${summary.missingAppraisers} reporting-line issue`}
        />
        <SoftStat
          label="Acknowledgments"
          value={`${summary.acknowledgmentRate}%`}
          helper="Employees confirmed receipt"
          detail={`${summary.pendingAcknowledgments} still pending`}
        />
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <ActionList
            onNavigate={handlers.navigate}
            onSendReminder={() => handlers.sendReminder("person-6", "manager")}
            summary={summary}
          />
          <ExploreTabs onNavigate={handlers.navigate} state={state} summary={summary} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <CycleCard cycle={state.cycle} summary={summary} onNavigate={handlers.navigate} />
          <AdvancedDetails />
        </div>
      </section>
    </>
  )
}

function AdvancedDetails() {
  return (
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
  )
}

function CycleView({ state, summary }) {
  const readiness = [
    ["Flagged goals", summary.flaggedGoals === 0 ? "Clear" : `${summary.flaggedGoals} open`],
    ["Missing appraisers", summary.missingAppraisers === 0 ? "Clear" : `${summary.missingAppraisers} open`],
    ["Acknowledgments", `${summary.pendingAcknowledgments} pending`],
    ["Audit trail", `${state.auditEvents.length} events`],
  ]

  return (
    <>
      <PageHeader
        eyebrow={state.cycle.organization}
        title={state.cycle.name}
        description="Set the appraisal phase, watch lock readiness, and keep the cycle moving without exposing noisy controls."
      />
      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <CycleCard cycle={state.cycle} summary={summary} onNavigate={() => {}} />
        <Card>
          <CardHeader>
            <CardTitle>Phase settings</CardTitle>
            <CardDescription>Frontend demo configuration for the active cycle.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {Object.entries(state.cycle.phaseDates).map(([phase, date]) => (
              <div className="flex items-center justify-between rounded-xl border bg-background p-4" key={phase}>
                <span className="capitalize text-muted-foreground">{readableStatus(phase)}</span>
                <span className="font-medium">{date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {readiness.map(([label, value]) => (
          <Card size="sm" key={label}>
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle>{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>
    </>
  )
}

function PeopleView({ handlers, state, summary }) {
  return (
    <>
      <PageHeader
        eyebrow="People data"
        title="Directory, reporting lines, and acknowledgments"
        description="Inspect the imported employee list, resolve appraiser gaps, and clear employee acknowledgment work."
      />
      <section className="grid gap-4 md:grid-cols-3">
        <SoftStat label="People loaded" value={state.people.length} helper="Seeded demo records" detail="No backend is connected in this MVP slice" />
        <SoftStat label="Missing appraisers" value={summary.missingAppraisers} helper="Needs HR confirmation" detail="These block lock readiness" />
        <SoftStat label="Pending acknowledgments" value={summary.pendingAcknowledgments} helper="Employee confirmations" detail={`${summary.acknowledgmentRate}% acknowledged`} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>People directory</CardTitle>
            <CardDescription>Imported employees, managers, and appraiser assignments.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.people.map((person) => {
              const manager = getPerson(state, person.managerId)
              return (
                <div className="grid gap-3 rounded-xl border bg-background p-4 md:grid-cols-[1fr_auto] md:items-center" key={person.id}>
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <p className="text-muted-foreground">{person.role} - {person.department}</p>
                    <p className="text-sm text-muted-foreground">Manager: {manager?.name ?? "Not assigned"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Badge variant={statusVariant(person.importStatus)}>{readableStatus(person.importStatus)}</Badge>
                    <Badge variant={statusVariant(person.acknowledgmentStatus)}>{readableStatus(person.acknowledgmentStatus)}</Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acknowledgment queue</CardTitle>
            <CardDescription>Clear employee-facing confirmation work.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.people.filter((person) => person.acknowledgmentStatus !== "acknowledged").map((person) => (
              <div className="rounded-xl border bg-background p-4" key={person.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <p className="text-muted-foreground">{person.department}</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlers.sendReminder(person.id, "acknowledgment")}>Remind</Button>
                  <Button size="sm" onClick={() => handlers.markAcknowledged(person.id)}>Mark done</Button>
                </div>
              </div>
            ))}
            {summary.pendingAcknowledgments === 0 ? (
              <div className="rounded-xl border bg-background p-4 text-muted-foreground">All employee acknowledgments are complete.</div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function GoalsView({ activeGoal, handlers, selectedGoalId, setSelectedGoalId, state }) {
  const employee = getPerson(state, activeGoal?.employeeId)
  const manager = getPerson(state, activeGoal?.managerId)

  return (
    <>
      <PageHeader
        eyebrow="Goal review"
        title="Review flagged goals before lock"
        description="Approve clean goals, request revisions with reasons, and use SIA suggestions for clearer wording."
      />
      <section className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Review queue</CardTitle>
            <CardDescription>{state.goals.filter((goal) => goal.status !== "approved").length} goals still need HR action.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.goals.map((goal) => {
              const owner = getPerson(state, goal.employeeId)
              return (
                <button
                  type="button"
                  className={`rounded-xl border bg-background p-4 text-left transition hover:bg-muted/50 ${selectedGoalId === goal.id ? "ring-2 ring-ring" : ""}`}
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="font-medium">{goal.title}</div>
                    <Badge variant={statusVariant(goal.status)}>{readableStatus(goal.status)}</Badge>
                  </div>
                  <p className="text-muted-foreground">{owner?.name} - {owner?.department}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {goal.flags.length > 0 ? goal.flags.map((flag) => (
                      <Badge variant="outline" key={flag}>{flag}</Badge>
                    )) : <Badge variant="secondary">No flags</Badge>}
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{activeGoal?.title}</CardTitle>
            <CardDescription>{employee?.name} - Manager: {manager?.name}</CardDescription>
            <CardAction>
              <Badge variant={statusVariant(activeGoal?.status ?? "submitted")}>{readableStatus(activeGoal?.status ?? "submitted")}</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-1 font-medium">Submitted goal</div>
              <p className="text-muted-foreground">{activeGoal?.description}</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-4">
              <div className="mb-1 flex items-center gap-2 font-medium">
                <SparklesIcon />
                SIA suggestion
              </div>
              <p className="text-muted-foreground">{activeGoal?.aiSuggestion}</p>
            </div>
            {activeGoal?.revisionReason ? (
              <div className="rounded-xl border bg-background p-4">
                <div className="mb-1 font-medium">Revision reason</div>
                <p className="text-muted-foreground">{activeGoal.revisionReason}</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button disabled={activeGoal?.status === "approved"} onClick={() => handlers.approveGoal(activeGoal.id)}>
                <CheckCircle2Icon data-icon="inline-start" />
                Approve goal
              </Button>
              <Button
                variant="outline"
                disabled={activeGoal?.status === "approved"}
                onClick={() => handlers.requestGoalRevision(activeGoal.id, "Add a measurable outcome, owner, and deadline before lock.")}
              >
                Request revision
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function ReportsView({ exportNotice, setExportNotice, state }) {
  return (
    <>
      <PageHeader
        eyebrow="Reports and audit"
        title="Trace every important cycle action"
        description="Review the audit trail and prepare demo exports without implying production data storage."
      />
      <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Audit trail</CardTitle>
            <CardDescription>Newest events appear first as HR acts on the workflow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.auditEvents.map((event) => (
              <div className="rounded-xl border bg-background p-4" key={event.id}>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="font-medium">{event.action}</div>
                  <Badge variant="outline">{event.timestamp}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">{event.actor} - {event.target}</p>
                <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demo exports</CardTitle>
            <CardDescription>Export actions are simulated for this frontend-only MVP.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {state.exports.map((item) => (
              <div className="rounded-xl border bg-background p-4" key={item.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <p className="text-muted-foreground">{item.updatedAt}</p>
                  </div>
                  <Badge variant={statusVariant(item.status)}>{item.status}</Badge>
                </div>
                <Button
                  className="mt-4"
                  variant="outline"
                  size="sm"
                  onClick={() => setExportNotice(`${item.name} preview prepared for demo.`)}
                >
                  <DownloadIcon data-icon="inline-start" />
                  Preview
                </Button>
              </div>
            ))}
            {exportNotice ? (
              <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">{exportNotice}</div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function SettingsView({ onReset, settings, toggleSetting }) {
  const settingsList = [
    ["quietReminders", "Quiet reminders", "Managers receive nudges without broad HR notifications."],
    ["aiGuardrails", "AI guardrails", "Assistant suggestions avoid scores and final appraisal decisions."],
    ["lockControls", "Lock controls", "Late edits require reason capture and audit visibility."],
  ]

  return (
    <>
      <PageHeader
        eyebrow="Workspace controls"
        title="Non-destructive MVP settings"
        description="Tune demo behavior, inspect guardrails, and reset the frontend state when preparing another walkthrough."
        actions={(
          <Button variant="outline" onClick={onReset}>
            <RotateCcwIcon data-icon="inline-start" />
            Reset demo
          </Button>
        )}
      />
      <section className="grid gap-4 md:grid-cols-3">
        {settingsList.map(([key, title, description]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
              <CardAction>
                <Badge variant={settings[key] ? "default" : "secondary"}>{settings[key] ? "On" : "Off"}</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={() => toggleSetting(key)}>
                {settings[key] ? "Turn off" : "Turn on"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}

export function App() {
  const [state, setState] = useState(() => createInitialDemoState())
  const [activeView, setActiveView] = useState("dashboard")
  const [selectedGoalId, setSelectedGoalId] = useState("goal-1")
  const [assistantPrompt, setAssistantPrompt] = useState("")
  const [assistantResponse, setAssistantResponse] = useState("")
  const [exportNotice, setExportNotice] = useState("")
  const [settings, setSettings] = useState({
    quietReminders: true,
    aiGuardrails: true,
    lockControls: true,
  })

  const summary = getDemoSummary(state)
  const activeGoal = useMemo(
    () => state.goals.find((goal) => goal.id === selectedGoalId) ?? state.goals[0],
    [selectedGoalId, state.goals]
  )

  useEffect(() => {
    window.history.scrollRestoration = "manual"
  }, [])

  useEffect(() => {
    const scrollTimer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0 })
    }, 0)

    return () => window.clearTimeout(scrollTimer)
  }, [activeView])

  const handlers = {
    navigate: setActiveView,
    approveGoal: (goalId) => setState((current) => approveGoal(current, goalId)),
    requestGoalRevision: (goalId, reason) => setState((current) => requestGoalRevision(current, goalId, reason)),
    sendReminder: (targetId, targetType) => setState((current) => sendReminder(current, targetId, targetType)),
    markAcknowledged: (personId) => setState((current) => markAcknowledged(current, personId)),
  }

  const assistant = {
    prompt: assistantPrompt,
    response: assistantResponse,
    setPrompt: setAssistantPrompt,
    respond: (message) => {
      setAssistantResponse(message || "Choose a goal from the queue so SIA can suggest clearer wording.")
    },
  }

  function resetDemoData() {
    setState(createInitialDemoState())
    setSelectedGoalId("goal-1")
    setAssistantPrompt("")
    setAssistantResponse("")
    setExportNotice("")
  }

  function toggleSetting(key) {
    setSettings((current) => ({ ...current, [key]: !current[key] }))
  }

  function renderActiveView() {
    if (activeView === "cycle") return <CycleView state={state} summary={summary} />
    if (activeView === "people") return <PeopleView handlers={handlers} state={state} summary={summary} />
    if (activeView === "goals") {
      return (
        <GoalsView
          activeGoal={activeGoal}
          handlers={handlers}
          selectedGoalId={selectedGoalId}
          setSelectedGoalId={setSelectedGoalId}
          state={state}
        />
      )
    }
    if (activeView === "reports") return <ReportsView exportNotice={exportNotice} setExportNotice={setExportNotice} state={state} />
    if (activeView === "settings") return <SettingsView onReset={resetDemoData} settings={settings} toggleSetting={toggleSetting} />
    return <DashboardView activeGoal={activeGoal} assistant={assistant} handlers={handlers} state={state} summary={summary} />
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar activeView={activeView} onNavigate={setActiveView} />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>{viewLabels[activeView]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="hidden items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm md:flex"
                onClick={() => setActiveView("goals")}
              >
                <SearchIcon />
                Search reviews, goals, people...
              </button>
              <Button variant="ghost" size="icon-sm" aria-label="Notifications" onClick={() => handlers.sendReminder("person-6", "manager")}>
                <BellIcon />
              </Button>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 p-4 md:p-8">
            {renderActiveView()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
