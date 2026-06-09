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
      department: "Operations",
      manager: "Marcus Jean",
      appraisalStatus: "Complete",
      latestGrade: "4",
    },
    {
      id: "emp-2",
      name: "Priya Nair",
      department: "Security",
      manager: "Devon Lake",
      appraisalStatus: "In progress",
      latestGrade: "Pending",
    },
    {
      id: "emp-3",
      name: "Anika Singh",
      department: "HR",
      manager: "Anita Sharma",
      appraisalStatus: "Complete",
      latestGrade: "5",
    },
    {
      id: "emp-4",
      name: "Leah Baptiste",
      department: "Operations",
      manager: "Marcus Jean",
      appraisalStatus: "In progress",
      latestGrade: "Pending",
    },
    {
      id: "emp-5",
      name: "Maya Richardson",
      department: "Customer Experience",
      manager: "Marcus Jean",
      appraisalStatus: "Not started",
      latestGrade: "Pending",
    },
    {
      id: "emp-6",
      name: "Caleb Brooks",
      department: "Security",
      manager: "Devon Lake",
      appraisalStatus: "Not started",
      latestGrade: "Pending",
    },
    {
      id: "emp-7",
      name: "Sofia Brown",
      department: "Finance",
      manager: "Nadia Wilson",
      appraisalStatus: "Complete",
      latestGrade: "3",
    },
    {
      id: "emp-8",
      name: "Daniel Peterson",
      department: "Maintenance",
      manager: "Ethan Clarke",
      appraisalStatus: "Complete",
      latestGrade: "4",
    },
    {
      id: "emp-9",
      name: "Janelle Thomas",
      department: "Maintenance",
      manager: "Ethan Clarke",
      appraisalStatus: "In progress",
      latestGrade: "Pending",
    },
    {
      id: "emp-10",
      name: "Owen Samuel",
      department: "Customer Experience",
      manager: "Nadia Wilson",
      appraisalStatus: "Complete",
      latestGrade: "5",
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
