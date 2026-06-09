import { useEffect, useMemo, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  Building2Icon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  FileTextIcon,
  MessageSquareTextIcon,
  SearchIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"
import {
  createInitialDemoState,
  filterEmployees,
  getEmployeeProfile,
  getOverviewSummary,
  sortEmployees,
  validateCycleConfig,
} from "@/data/workflow"

const viewLabels = {
  overview: "Overview",
  employees: "Employees",
  "appraisal-cycle": "Appraisal Cycle",
}

const emptyFilters = {
  department: "",
  manager: "",
  grade: "",
  status: "",
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function getUniqueOptions(items, key) {
  return [...new Set(items.map((item) => item[key]))].sort()
}

function statusVariant(status) {
  if (status === "Complete" || status === "On track") return "default"
  if (status === "Overdue" || status === "Not started") return "destructive"
  if (status === "Near deadline" || status === "In progress") return "secondary"
  return "outline"
}

function PageHeader({ actions, description, title }) {
  return (
    <section className="flex min-w-0 flex-col gap-3 py-4 md:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-balance font-heading text-3xl font-medium md:text-4xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  )
}

function FieldLabel({ children }) {
  return <label className="text-sm font-medium text-foreground">{children}</label>
}

function SelectField({ children, label, value, onChange }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 ease-out focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {children}
      </select>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 gap-3 rounded-xl border bg-background p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 break-words font-medium">{value}</div>
      </div>
    </div>
  )
}

function CycleStatus({ cycle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appraisal Cycle</CardTitle>
        <CardDescription>
          {cycle.currentPhase} runs {cycle.currentWindow}.
        </CardDescription>
        <CardAction>
          <Badge className="tabular-nums">{cycle.progress}% complete</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">Overall progress</span>
            <span className="font-medium tabular-nums">{cycle.progress}%</span>
          </div>
          <Progress value={cycle.progress} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {cycle.phases.map((phase) => (
            <div
              className={cx(
                "min-w-0 rounded-xl border bg-background p-4",
                phase.label === cycle.currentPhase && "ring-2 ring-ring"
              )}
              key={phase.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="break-words font-medium">{phase.label}</div>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {phase.startDate} to {phase.endDate}
                  </p>
                </div>
                {phase.label === cycle.currentPhase ? <Badge>Current</Badge> : <Badge variant="secondary">Next</Badge>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ActionNeeded({ actionItems, onCompleteAction }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Needed</CardTitle>
        <CardDescription>Work HR must open, approve, or start to keep the cycle moving.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {actionItems.length === 0 ? (
          <div className="rounded-xl border bg-background p-5 text-muted-foreground">Nothing needs your attention.</div>
        ) : actionItems.map((item) => (
          <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 md:flex-row md:items-start md:justify-between" key={item.id}>
            <div className="flex min-w-0 gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <ClipboardCheckIcon />
              </div>
              <div className="min-w-0">
                <div className="break-words font-medium">{item.title}</div>
                <p className="mt-1 break-words text-muted-foreground">{item.detail}</p>
                <Badge variant="outline" className="mt-3">{item.status}</Badge>
              </div>
            </div>
            <Button className="w-fit" variant="outline" size="sm" onClick={() => onCompleteAction(item.id)}>
              {item.actionLabel}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ManagerCompletion({ managers }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manager Completion</CardTitle>
        <CardDescription>Managers with overdue or near-deadline work appear first.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {managers.map((manager) => {
          const total = manager.completeCount + manager.outstandingCount
          const completePercent = total === 0 ? 100 : Math.round((manager.completeCount / total) * 100)

          return (
            <div className="rounded-xl border bg-background p-4" key={manager.manager}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="break-words font-medium">{manager.manager}</div>
                  <p className="text-muted-foreground">
                    <span className="tabular-nums">{manager.completeCount}</span> complete,{" "}
                    <span className="tabular-nums">{manager.outstandingCount}</span> outstanding
                  </p>
                </div>
                <Badge variant={statusVariant(manager.riskStatus)}>{manager.riskStatus}</Badge>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium tabular-nums">{completePercent}%</span>
                </div>
                <Progress value={completePercent} />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function DepartmentStats({ stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Results</CardTitle>
        <CardDescription>Shown after grading closes. Current demo data previews the final summary.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        {stats.map((department) => (
          <div className="rounded-xl border bg-background p-4" key={department.department}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="break-words font-medium">{department.department}</div>
                <p className="text-muted-foreground"><span className="tabular-nums">{department.completionRate}%</span> complete</p>
              </div>
              <Badge variant="secondary">Grades</Badge>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center text-sm">
              {Object.entries(department.grades).map(([grade, count]) => (
                <div className="rounded-lg bg-muted p-2" key={grade}>
                  <div className="font-medium tabular-nums">{count}</div>
                  <div className="text-muted-foreground">Grade {grade}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function OverviewPage({ onCompleteAction, summary }) {
  return (
    <>
      <PageHeader
        title="Overview"
        description="See where the appraisal cycle stands, what HR needs to do, and which managers need follow-up."
      />
      <section className="flex flex-col gap-6">
        <CycleStatus cycle={summary.cycle} />
        <ActionNeeded actionItems={summary.actionItems} onCompleteAction={onCompleteAction} />
        <ManagerCompletion managers={summary.managerProgress} />
        <DepartmentStats stats={summary.departmentStats} />
      </section>
    </>
  )
}

function SortButton({ columnKey, label, sort, onSort }) {
  const isActive = sort.key === columnKey
  const nextDirection = isActive && sort.direction === "asc" ? "desc" : "asc"

  return (
    <button
      type="button"
      className="-mx-2 inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-left font-medium transition-[background-color,color,scale] duration-150 ease-out hover:bg-background active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => onSort({ key: columnKey, direction: nextDirection })}
    >
      <span>{label}</span>
      {isActive ? (
        sort.direction === "asc" ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />
      ) : null}
    </button>
  )
}

function EmployeesPage({ employees, onSelectEmployee }) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState({ key: "name", direction: "asc" })

  const departments = getUniqueOptions(employees, "department")
  const managers = getUniqueOptions(employees, "manager")
  const grades = getUniqueOptions(employees, "latestGrade")
  const statuses = getUniqueOptions(employees, "appraisalStatus")
  const visibleEmployees = sortEmployees(filterEmployees(employees, filters, search), sort)

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description="Search, filter, and sort the full employee appraisal list."
        actions={(
          <Button variant="outline" onClick={() => { setSearch(""); setFilters(emptyFilters) }}>
            Clear filters
          </Button>
        )}
      />
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>{visibleEmployees.length} of {employees.length} employees shown.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
            <div className="flex min-w-0 flex-col gap-2">
              <FieldLabel>Search by name</FieldLabel>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                  placeholder="Search employees"
                />
              </div>
            </div>
            <SelectField label="Department" value={filters.department} onChange={(value) => updateFilter("department", value)}>
              <option value="">All departments</option>
              {departments.map((department) => <option value={department} key={department}>{department}</option>)}
            </SelectField>
            <SelectField label="Manager" value={filters.manager} onChange={(value) => updateFilter("manager", value)}>
              <option value="">All managers</option>
              {managers.map((manager) => <option value={manager} key={manager}>{manager}</option>)}
            </SelectField>
            <SelectField label="Grade" value={filters.grade} onChange={(value) => updateFilter("grade", value)}>
              <option value="">All grades</option>
              {grades.map((grade) => <option value={grade} key={grade}>{grade}</option>)}
            </SelectField>
            <SelectField label="Status" value={filters.status} onChange={(value) => updateFilter("status", value)}>
              <option value="">All statuses</option>
              {statuses.map((status) => <option value={status} key={status}>{status}</option>)}
            </SelectField>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[760px] table-fixed text-sm">
              <thead className="bg-muted/60">
                <tr className="border-b">
                  <th className="w-[24%] px-4 py-3 text-left">
                    <SortButton columnKey="name" label="Name" sort={sort} onSort={setSort} />
                  </th>
                  <th className="w-[20%] px-4 py-3 text-left">
                    <SortButton columnKey="department" label="Department" sort={sort} onSort={setSort} />
                  </th>
                  <th className="w-[20%] px-4 py-3 text-left">
                    <SortButton columnKey="manager" label="Manager" sort={sort} onSort={setSort} />
                  </th>
                  <th className="w-[20%] px-4 py-3 text-left">
                    <SortButton columnKey="appraisalStatus" label="Appraisal status" sort={sort} onSort={setSort} />
                  </th>
                  <th className="w-[16%] px-4 py-3 text-left">
                    <SortButton columnKey="latestGrade" label="Latest grade" sort={sort} onSort={setSort} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleEmployees.map((employee) => (
                  <tr className="border-b transition-colors duration-150 ease-out hover:bg-muted/40 last:border-b-0" key={employee.id}>
                    <td className="break-words px-4 py-3">
                      <button
                        type="button"
                        className="-mx-2 inline-flex min-h-9 items-center rounded-md px-2 text-left font-medium underline-offset-4 transition-[background-color,color,scale] duration-150 ease-out hover:bg-muted hover:underline active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => onSelectEmployee(employee.id)}
                      >
                        {employee.name}
                      </button>
                    </td>
                    <td className="break-words px-4 py-3 text-muted-foreground">{employee.department}</td>
                    <td className="break-words px-4 py-3 text-muted-foreground">{employee.manager}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(employee.appraisalStatus)}>{employee.appraisalStatus}</Badge>
                    </td>
                    <td className="break-words px-4 py-3 text-muted-foreground tabular-nums">{employee.latestGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function EmployeeProfilePage({ onBack, profile }) {
  if (!profile) {
    return (
      <>
        <PageHeader
          title="Employee not found"
          description="Return to Employees and choose another record."
          actions={<Button variant="outline" onClick={onBack}>Back to Employees</Button>}
        />
      </>
    )
  }

  const { appraisal, blockers, employee, managerProgress, timeline } = profile
  const goals = appraisal?.goals ?? []

  return (
    <>
      <PageHeader
        title={employee.name}
        description={`${employee.role} in ${employee.department}. Managed by ${employee.manager}.`}
        actions={(
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            Back to Employees
          </Button>
        )}
      />

      <section className="grid gap-6 xl:grid-cols-[.85fr_1.15fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
              <CardDescription>Basic record and appraisal status.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <DetailItem icon={UserRoundIcon} label="Role" value={employee.role} />
              <DetailItem icon={Building2Icon} label="Department" value={employee.department} />
              <DetailItem icon={UsersRoundIcon} label="Manager" value={employee.manager} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-4">
                  <div className="text-sm text-muted-foreground">Appraisal status</div>
                  <Badge className="mt-2" variant={statusVariant(employee.appraisalStatus)}>
                    {employee.appraisalStatus}
                  </Badge>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <div className="text-sm text-muted-foreground">Latest grade</div>
                  <div className="mt-2 font-medium tabular-nums">{employee.latestGrade}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Cycle</CardTitle>
              <CardDescription>Progress through this appraisal cycle.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Employee progress</span>
                  <span className="font-medium tabular-nums">{appraisal?.progress ?? 0}%</span>
                </div>
                <Progress value={appraisal?.progress ?? 0} />
              </div>
              <div className="grid gap-3">
                {(appraisal?.phaseStatus ?? []).map((phase) => (
                  <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between" key={phase.label}>
                    <div className="break-words font-medium">{phase.label}</div>
                    <Badge variant={statusVariant(phase.status)}>{phase.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manager Completion</CardTitle>
              <CardDescription>Context for the employee's reporting line.</CardDescription>
            </CardHeader>
            <CardContent>
              {managerProgress ? (
                <div className="rounded-xl border bg-background p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="break-words font-medium">{managerProgress.manager}</div>
                      <p className="text-muted-foreground">
                        <span className="tabular-nums">{managerProgress.completeCount}</span> complete,{" "}
                        <span className="tabular-nums">{managerProgress.outstandingCount}</span> outstanding
                      </p>
                    </div>
                    <Badge variant={statusVariant(managerProgress.riskStatus)}>{managerProgress.riskStatus}</Badge>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border bg-background p-4 text-muted-foreground">No manager context available.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Goals</CardTitle>
              <CardDescription>Goals recorded for the current appraisal cycle.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {goals.length === 0 ? (
                <div className="rounded-xl border bg-background p-4 text-muted-foreground">No goals have been submitted.</div>
              ) : goals.map((goal) => (
                <div className="flex min-w-0 gap-3 rounded-xl border bg-background p-4" key={goal}>
                  <ClipboardListIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="break-words">{goal}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Notes</CardTitle>
              <CardDescription>Manager and HR context for follow-up.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 font-medium">
                  <MessageSquareTextIcon className="size-4 text-muted-foreground" />
                  Manager comments
                </div>
                <p className="mt-3 break-words text-muted-foreground">{appraisal?.managerComment ?? "No manager comments yet."}</p>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-center gap-2 font-medium">
                  <FileTextIcon className="size-4 text-muted-foreground" />
                  HR notes
                </div>
                <p className="mt-3 break-words text-muted-foreground">{appraisal?.hrNotes ?? "No HR notes yet."}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Action Needed</CardTitle>
              <CardDescription>Items blocking this employee's appraisal.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {blockers.length === 0 ? (
                <div className="rounded-xl border bg-background p-4 text-muted-foreground">Nothing needs your attention.</div>
              ) : blockers.map((blocker) => (
                <div className="flex min-w-0 gap-3 rounded-xl border bg-background p-4" key={blocker}>
                  <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <div className="break-words">{blocker}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent appraisal events for this employee.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {timeline.length === 0 ? (
                <div className="rounded-xl border bg-background p-4 text-muted-foreground">No activity recorded.</div>
              ) : timeline.map((event) => (
                <div className="flex min-w-0 gap-3 rounded-xl border bg-background p-4" key={`${event.date}-${event.label}`}>
                  <CalendarClockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="break-words font-medium">{event.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground tabular-nums">{event.date}</div>
                    <p className="mt-2 break-words text-muted-foreground">{event.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

function NumberInput({ label, value, onChange, suffix }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="max-w-28"
        />
        {suffix ? <span className="text-sm text-muted-foreground">{suffix}</span> : null}
      </div>
    </div>
  )
}

function DateInput({ label, value, onChange }) {
  function handleDateChange(event) {
    onChange(event.target.value)
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      <Input type="date" value={value} onChange={handleDateChange} onInput={handleDateChange} />
    </div>
  )
}

function AppraisalCyclePage({ cycleConfig, setCycleConfig }) {
  const validationErrors = validateCycleConfig(cycleConfig)

  function updateConfig(key, value) {
    setCycleConfig((current) => ({ ...current, [key]: value }))
  }

  function updateWeight(key, value) {
    setCycleConfig((current) => ({
      ...current,
      assessmentWeights: {
        ...current.assessmentWeights,
        [key]: value,
      },
    }))
  }

  function updatePhase(phaseId, key, value) {
    setCycleConfig((current) => ({
      ...current,
      phases: current.phases.map((phase) => (
        phase.id === phaseId ? { ...phase, [key]: value } : phase
      )),
    }))
  }

  return (
    <>
      <PageHeader
        title="Appraisal Cycle"
        description="Configure the assessment schedule, grading scale, and weights for PJIAE."
      />
      <section className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Setup</CardTitle>
              <CardDescription>Keep the process simple and clear for HR.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Assessments per year"
                value={String(cycleConfig.assessmentsPerYear)}
                onChange={(value) => updateConfig("assessmentsPerYear", Number(value))}
              >
                <option value="1">1 assessment</option>
                <option value="2">2 assessments</option>
              </SelectField>
              <SelectField
                label="Grading scale"
                value={cycleConfig.gradingScale}
                onChange={(value) => updateConfig("gradingScale", value)}
              >
                <option value="1-5">1-5</option>
                <option value="1-10">1-10</option>
                <option value="A-D">A-D</option>
              </SelectField>
              <SelectField
                label="Pass threshold"
                value={cycleConfig.passThreshold}
                onChange={(value) => updateConfig("passThreshold", value)}
              >
                {cycleConfig.gradingScale === "A-D" ? (
                  <>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </>
                ) : cycleConfig.gradingScale === "1-10" ? (
                  Array.from({ length: 10 }, (_, index) => String(index + 1)).map((value) => (
                    <option value={value} key={value}>{value}</option>
                  ))
                ) : (
                  Array.from({ length: 5 }, (_, index) => String(index + 1)).map((value) => (
                    <option value={value} key={value}>{value}</option>
                  ))
                )}
              </SelectField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phase Windows</CardTitle>
              <CardDescription>Dates cannot overlap or run backwards.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {cycleConfig.phases.map((phase) => (
                <div className="rounded-xl border bg-background p-4" key={phase.id}>
                  <div className="mb-4 break-words font-medium">{phase.label}</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <DateInput
                      label="Start date"
                      value={phase.startDate}
                      onChange={(value) => updatePhase(phase.id, "startDate", value)}
                    />
                    <DateInput
                      label="End date"
                      value={phase.endDate}
                      onChange={(value) => updatePhase(phase.id, "endDate", value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Weights</CardTitle>
              <CardDescription>Weights must total 100%.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <NumberInput
                label="Mid-Year Assessment"
                value={cycleConfig.assessmentWeights.midYear}
                suffix="%"
                onChange={(value) => updateWeight("midYear", value)}
              />
              <NumberInput
                label="Final Assessment"
                value={cycleConfig.assessmentWeights.final}
                suffix="%"
                onChange={(value) => updateWeight("final", value)}
              />
              <div className="rounded-xl bg-muted p-4 text-sm">
                Total: <span className="font-medium tabular-nums">{cycleConfig.assessmentWeights.midYear + cycleConfig.assessmentWeights.final}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Validation</CardTitle>
              <CardDescription>Resolve these before the cycle is finalized.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {validationErrors.length === 0 ? (
                <div className="flex items-start gap-3 rounded-xl border bg-background p-4">
                  <CheckCircle2Icon className="mt-0.5 text-muted-foreground" />
                  <p className="text-muted-foreground">Appraisal Cycle settings are valid.</p>
                </div>
              ) : validationErrors.map((error) => (
                <div className="flex items-start gap-3 rounded-xl border bg-background p-4" key={error}>
                  <AlertCircleIcon className="mt-0.5 shrink-0 text-destructive" />
                  <p className="break-words text-muted-foreground">{error}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

export function App() {
  const [state, setState] = useState(() => createInitialDemoState())
  const [activeView, setActiveView] = useState("overview")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)

  const summary = getOverviewSummary(state)
  const selectedEmployeeProfile = useMemo(
    () => selectedEmployeeId ? getEmployeeProfile(state, selectedEmployeeId) : null,
    [selectedEmployeeId, state]
  )

  useEffect(() => {
    window.history.scrollRestoration = "manual"
  }, [])

  useEffect(() => {
    const scrollTimer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0 })
    }, 0)

    return () => window.clearTimeout(scrollTimer)
  }, [activeView, selectedEmployeeId])

  function completeAction(actionId) {
    setState((current) => ({
      ...current,
      actionItems: current.actionItems.filter((item) => item.id !== actionId),
    }))
  }

  function setCycleConfig(updater) {
    setState((current) => ({
      ...current,
      cycleConfig: typeof updater === "function" ? updater(current.cycleConfig) : updater,
    }))
  }

  function navigate(view) {
    setActiveView(view)
    setSelectedEmployeeId(null)
  }

  function renderActiveView() {
    if (activeView === "employees") {
      if (selectedEmployeeId) {
        return <EmployeeProfilePage profile={selectedEmployeeProfile} onBack={() => setSelectedEmployeeId(null)} />
      }

      return <EmployeesPage employees={state.employees} onSelectEmployee={setSelectedEmployeeId} />
    }

    if (activeView === "appraisal-cycle") {
      return <AppraisalCyclePage cycleConfig={state.cycleConfig} setCycleConfig={setCycleConfig} />
    }
    return <OverviewPage onCompleteAction={completeAction} summary={summary} />
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar activeView={activeView} onNavigate={navigate} />
        <SidebarInset className="min-w-0">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {selectedEmployeeProfile && activeView === "employees" ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <button type="button" onClick={() => setSelectedEmployeeId(null)}>Employees</button>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{selectedEmployeeProfile.employee.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{viewLabels[activeView]}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary" className="hidden md:inline-flex">PJIAE</Badge>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 p-4 md:p-8">
            {renderActiveView()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
