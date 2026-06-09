const riskOrder = {
  Overdue: 0,
  "Near deadline": 1,
  "On track": 2,
}

const gradeOrder = {
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  "1": 1,
  Pending: 0,
}

const initialDemoState = {
  cycleConfig: {
    name: "2026 Annual Appraisal Cycle",
    organization: "PJIAE",
    currentPhase: "Goal Setting",
    currentWindow: "Jan 1-31, 2026",
    progress: 62,
    assessmentsPerYear: 2,
    gradingScale: "1-5",
    passThreshold: "3",
    assessmentWeights: {
      midYear: 40,
      final: 60,
    },
    phases: [
      { id: "goalSetting", label: "Goal Setting", startDate: "2026-01-01", endDate: "2026-01-31" },
      { id: "midYear", label: "Mid-Year Assessment", startDate: "2026-06-01", endDate: "2026-06-30" },
      { id: "final", label: "Final Assessment", startDate: "2026-12-01", endDate: "2026-12-12" },
    ],
  },
  employees: [
    {
      id: "emp-1",
      name: "Rohit Verma",
      role: "Airside Operations Supervisor",
      department: "Operations",
      manager: "Marcus Jean",
      appraisalStatus: "Complete",
      latestGrade: "4",
    },
    {
      id: "emp-2",
      name: "Priya Nair",
      role: "Security Screening Lead",
      department: "Security",
      manager: "Devon Lake",
      appraisalStatus: "In progress",
      latestGrade: "Pending",
    },
    {
      id: "emp-3",
      name: "Anika Singh",
      role: "HR Coordinator",
      department: "HR",
      manager: "Anita Sharma",
      appraisalStatus: "Complete",
      latestGrade: "5",
    },
    {
      id: "emp-4",
      name: "Leah Baptiste",
      role: "Ramp Services Coordinator",
      department: "Operations",
      manager: "Marcus Jean",
      appraisalStatus: "In progress",
      latestGrade: "Pending",
    },
    {
      id: "emp-5",
      name: "Maya Richardson",
      role: "Guest Services Agent",
      department: "Customer Experience",
      manager: "Marcus Jean",
      appraisalStatus: "Not started",
      latestGrade: "Pending",
    },
    {
      id: "emp-6",
      name: "Caleb Brooks",
      role: "Security Officer",
      department: "Security",
      manager: "Devon Lake",
      appraisalStatus: "Not started",
      latestGrade: "Pending",
    },
    {
      id: "emp-7",
      name: "Sofia Brown",
      role: "Accounts Payable Specialist",
      department: "Finance",
      manager: "Nadia Wilson",
      appraisalStatus: "Complete",
      latestGrade: "3",
    },
    {
      id: "emp-8",
      name: "Daniel Peterson",
      role: "Facilities Technician",
      department: "Maintenance",
      manager: "Ethan Clarke",
      appraisalStatus: "Complete",
      latestGrade: "4",
    },
    {
      id: "emp-9",
      name: "Janelle Thomas",
      role: "Maintenance Planner",
      department: "Maintenance",
      manager: "Ethan Clarke",
      appraisalStatus: "In progress",
      latestGrade: "Pending",
    },
    {
      id: "emp-10",
      name: "Owen Samuel",
      role: "Customer Care Lead",
      department: "Customer Experience",
      manager: "Nadia Wilson",
      appraisalStatus: "Complete",
      latestGrade: "5",
    },
  ],
  appraisals: [
    {
      employeeId: "emp-1",
      progress: 100,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "Complete" },
        { label: "Final Assessment", status: "Complete" },
      ],
      goals: [
        "Reduce average gate turnaround delays in assigned shifts.",
        "Improve airside incident reporting completeness.",
      ],
      managerComment: "Strong ownership of shift coordination and follow-through.",
      hrNotes: "Ready for cycle close.",
      blockers: [],
      timeline: [
        { date: "2026-01-12", label: "Goals submitted", detail: "Manager and employee confirmed goals." },
        { date: "2026-06-18", label: "Mid-year assessment complete", detail: "Progress reviewed by manager." },
        { date: "2026-12-09", label: "Final grade submitted", detail: "HR review complete." },
      ],
    },
    {
      employeeId: "emp-2",
      progress: 52,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "In progress" },
        { label: "Final Assessment", status: "Not started" },
      ],
      goals: [
        "Keep screening lane staffing aligned with peak passenger windows.",
        "Complete quarterly refresher training for assigned officers.",
      ],
      managerComment: "Mid-year notes are drafted but not submitted.",
      hrNotes: "Follow up with Devon Lake if no update by Friday.",
      blockers: ["Manager review pending"],
      timeline: [
        { date: "2026-01-15", label: "Goals submitted", detail: "Security goals accepted." },
        { date: "2026-06-21", label: "Reminder sent", detail: "Mid-year assessment reminder sent to manager." },
      ],
    },
    {
      employeeId: "emp-3",
      progress: 100,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "Complete" },
        { label: "Final Assessment", status: "Complete" },
      ],
      goals: [
        "Improve appraisal cycle communications for managers.",
        "Reduce missing employee record exceptions before launch.",
      ],
      managerComment: "Consistent, organized, and proactive throughout the cycle.",
      hrNotes: "No exceptions.",
      blockers: [],
      timeline: [
        { date: "2026-01-10", label: "Goals submitted", detail: "Goals reviewed by HR manager." },
        { date: "2026-12-08", label: "Final grade submitted", detail: "Cycle record complete." },
      ],
    },
    {
      employeeId: "emp-4",
      progress: 45,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "In progress" },
        { label: "Final Assessment", status: "Not started" },
      ],
      goals: [
        "Improve ramp handoff notes between arrival and departure teams.",
        "Complete safety checklist spot checks for assigned shifts.",
      ],
      managerComment: "Goals are clear. Mid-year review needs manager completion.",
      hrNotes: "Watch this record because Marcus has multiple outstanding appraisals.",
      blockers: ["Manager review pending"],
      timeline: [
        { date: "2026-01-14", label: "Goals submitted", detail: "Employee goals submitted by manager." },
        { date: "2026-06-20", label: "Employee update received", detail: "Progress notes added for mid-year review." },
      ],
    },
    {
      employeeId: "emp-5",
      progress: 10,
      phaseStatus: [
        { label: "Goal Setting", status: "Not started" },
        { label: "Mid-Year Assessment", status: "Not started" },
        { label: "Final Assessment", status: "Not started" },
      ],
      goals: [],
      managerComment: "No appraisal record started.",
      hrNotes: "Needs HR follow-up to open goal setting.",
      blockers: ["Goal setting not opened"],
      timeline: [
        { date: "2026-01-20", label: "Reminder sent", detail: "Goal setting reminder queued for manager." },
      ],
    },
    {
      employeeId: "emp-6",
      progress: 8,
      phaseStatus: [
        { label: "Goal Setting", status: "Not started" },
        { label: "Mid-Year Assessment", status: "Not started" },
        { label: "Final Assessment", status: "Not started" },
      ],
      goals: [],
      managerComment: "No appraisal record started.",
      hrNotes: "Security department has overdue manager work.",
      blockers: ["Goal setting not opened", "Manager overdue"],
      timeline: [
        { date: "2026-01-21", label: "Reminder sent", detail: "Overdue notice sent to manager." },
      ],
    },
    {
      employeeId: "emp-7",
      progress: 100,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "Complete" },
        { label: "Final Assessment", status: "Complete" },
      ],
      goals: ["Close monthly reconciliations within the agreed finance calendar."],
      managerComment: "Reliable performance and strong attention to detail.",
      hrNotes: "Ready for cycle close.",
      blockers: [],
      timeline: [
        { date: "2026-01-11", label: "Goals submitted", detail: "Finance goals accepted." },
        { date: "2026-12-07", label: "Final grade submitted", detail: "Manager submitted final score." },
      ],
    },
    {
      employeeId: "emp-8",
      progress: 100,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "Complete" },
        { label: "Final Assessment", status: "Complete" },
      ],
      goals: ["Complete preventive maintenance tickets within agreed response windows."],
      managerComment: "Strong completion rate for priority work orders.",
      hrNotes: "Ready for cycle close.",
      blockers: [],
      timeline: [
        { date: "2026-01-13", label: "Goals submitted", detail: "Maintenance goals accepted." },
        { date: "2026-12-06", label: "Final grade submitted", detail: "Final review completed." },
      ],
    },
    {
      employeeId: "emp-9",
      progress: 58,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "In progress" },
        { label: "Final Assessment", status: "Not started" },
      ],
      goals: ["Improve scheduling accuracy for recurring maintenance windows."],
      managerComment: "Mid-year review is underway.",
      hrNotes: "No HR action today.",
      blockers: [],
      timeline: [
        { date: "2026-01-16", label: "Goals submitted", detail: "Manager submitted planning goals." },
        { date: "2026-06-22", label: "Mid-year draft started", detail: "Manager opened assessment." },
      ],
    },
    {
      employeeId: "emp-10",
      progress: 100,
      phaseStatus: [
        { label: "Goal Setting", status: "Complete" },
        { label: "Mid-Year Assessment", status: "Complete" },
        { label: "Final Assessment", status: "Complete" },
      ],
      goals: ["Improve passenger issue resolution time at customer care desks."],
      managerComment: "Excellent guest recovery performance during peak periods.",
      hrNotes: "Ready for cycle close.",
      blockers: [],
      timeline: [
        { date: "2026-01-09", label: "Goals submitted", detail: "Customer care goals accepted." },
        { date: "2026-12-05", label: "Final grade submitted", detail: "Final review completed." },
      ],
    },
  ],
  managerProgress: [
    { manager: "Devon Lake", completeCount: 0, outstandingCount: 2, riskStatus: "Overdue" },
    { manager: "Marcus Jean", completeCount: 1, outstandingCount: 2, riskStatus: "Near deadline" },
    { manager: "Nadia Wilson", completeCount: 2, outstandingCount: 0, riskStatus: "On track" },
    { manager: "Ethan Clarke", completeCount: 1, outstandingCount: 1, riskStatus: "On track" },
  ],
  actionItems: [
    {
      id: "action-1",
      title: "Open goal setting for remaining employees",
      detail: "2 employees have not started their appraisal.",
      actionLabel: "Open",
      status: "Due today",
    },
    {
      id: "action-2",
      title: "Approve appraisal cycle dates",
      detail: "The final assessment window is ready for HR review.",
      actionLabel: "Approve",
      status: "This week",
    },
  ],
  departmentStats: [
    { department: "Operations", completionRate: 34, grades: { "5": 0, "4": 1, "3": 0, "2": 0, "1": 0 } },
    { department: "Security", completionRate: 0, grades: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 } },
    { department: "Customer Experience", completionRate: 50, grades: { "5": 1, "4": 0, "3": 0, "2": 0, "1": 0 } },
    { department: "Maintenance", completionRate: 50, grades: { "5": 0, "4": 1, "3": 0, "2": 0, "1": 0 } },
  ],
}

function clone(value) {
  return structuredClone(value)
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase()
}

function compareValues(left, right, direction) {
  const directionMultiplier = direction === "desc" ? -1 : 1
  const leftValue = left ?? ""
  const rightValue = right ?? ""

  if (leftValue < rightValue) return -1 * directionMultiplier
  if (leftValue > rightValue) return 1 * directionMultiplier
  return 0
}

function gradeValue(grade) {
  return gradeOrder[grade] ?? 0
}

export function createInitialDemoState() {
  return clone(initialDemoState)
}

export function getOverviewSummary(state) {
  const completeEmployees = state.employees.filter((employee) => employee.appraisalStatus === "Complete").length
  const outstandingEmployees = state.employees.length - completeEmployees

  return {
    cycle: state.cycleConfig,
    completeEmployees,
    outstandingEmployees,
    actionItems: state.actionItems,
    managerProgress: [...state.managerProgress].sort((left, right) => {
      const riskComparison = riskOrder[left.riskStatus] - riskOrder[right.riskStatus]
      if (riskComparison !== 0) return riskComparison
      return right.outstandingCount - left.outstandingCount
    }),
    departmentStats: state.departmentStats,
  }
}

export function getEmployeeProfile(state, employeeId) {
  const employee = state.employees.find((item) => item.id === employeeId)

  if (!employee) return null

  const appraisal = state.appraisals.find((item) => item.employeeId === employeeId) ?? null

  return {
    employee,
    appraisal,
    blockers: appraisal?.blockers ?? [],
    managerProgress: state.managerProgress.find((item) => item.manager === employee.manager) ?? null,
    timeline: appraisal?.timeline ?? [],
  }
}

export function filterEmployees(employees, filters, search = "") {
  const searchValue = normalize(search)

  return employees.filter((employee) => {
    const matchesSearch = !searchValue || normalize(employee.name).includes(searchValue)
    const matchesDepartment = !filters.department || employee.department === filters.department
    const matchesManager = !filters.manager || employee.manager === filters.manager
    const matchesGrade = !filters.grade || employee.latestGrade === filters.grade
    const matchesStatus = !filters.status || employee.appraisalStatus === filters.status

    return matchesSearch && matchesDepartment && matchesManager && matchesGrade && matchesStatus
  })
}

export function sortEmployees(employees, sort) {
  return [...employees].sort((left, right) => {
    if (sort.key === "latestGrade") {
      const gradeComparison = (gradeValue(left.latestGrade) - gradeValue(right.latestGrade)) * (sort.direction === "desc" ? -1 : 1)
      if (gradeComparison !== 0) return gradeComparison
      return compareValues(left.name, right.name, "asc")
    }

    const comparison = compareValues(left[sort.key], right[sort.key], sort.direction)
    if (comparison !== 0) return comparison
    return compareValues(left.name, right.name, "asc")
  })
}

export function validateCycleConfig(config) {
  const errors = []
  const totalWeight = Object.values(config.assessmentWeights).reduce((sum, value) => sum + Number(value || 0), 0)

  if (totalWeight !== 100) {
    errors.push("Assessment weights must total 100%.")
  }

  for (const phase of config.phases) {
    if (phase.startDate && phase.endDate && phase.endDate < phase.startDate) {
      errors.push(`${phase.label} cannot end before it starts.`)
    }
  }

  const orderedPhases = [...config.phases].sort((left, right) => left.startDate.localeCompare(right.startDate))
  for (let index = 0; index < orderedPhases.length - 1; index += 1) {
    const current = orderedPhases[index]
    const next = orderedPhases[index + 1]

    if (current.endDate >= next.startDate) {
      errors.push(`${current.label} cannot overlap ${next.label}.`)
    }
  }

  return errors
}
