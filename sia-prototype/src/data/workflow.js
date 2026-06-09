const cycle = {
  id: "cycle-2026",
  name: "2026 Annual Appraisal Cycle",
  organization: "PJIA",
  phase: "Goal setting",
  phaseDates: {
    setup: "Feb 1",
    goalSetting: "Feb 28",
    goalLock: "Mar 7",
    midYearReview: "Aug 15",
    finalAppraisal: "Dec 10",
  },
  completion: 62,
}

const people = [
  {
    id: "person-1",
    name: "Rohit Verma",
    role: "Terminal Operations Lead",
    department: "Operations",
    managerId: "person-4",
    appraiserId: "person-4",
    acknowledgmentStatus: "acknowledged",
    importStatus: "verified",
  },
  {
    id: "person-2",
    name: "Priya Nair",
    role: "Security Supervisor",
    department: "Security",
    managerId: "person-6",
    appraiserId: "person-6",
    acknowledgmentStatus: "pending",
    importStatus: "verified",
  },
  {
    id: "person-3",
    name: "Anika Singh",
    role: "HR Coordinator",
    department: "HR",
    managerId: "person-7",
    appraiserId: "person-7",
    acknowledgmentStatus: "pending",
    importStatus: "verified",
  },
  {
    id: "person-4",
    name: "Marcus Jean",
    role: "Operations Manager",
    department: "Operations",
    managerId: "person-7",
    appraiserId: "person-7",
    acknowledgmentStatus: "acknowledged",
    importStatus: "verified",
  },
  {
    id: "person-5",
    name: "Leah Baptiste",
    role: "Customer Experience Officer",
    department: "Customer Experience",
    managerId: "person-4",
    appraiserId: null,
    acknowledgmentStatus: "pending",
    importStatus: "needs_appraiser",
  },
  {
    id: "person-6",
    name: "Devon Lake",
    role: "Security Manager",
    department: "Security",
    managerId: "person-7",
    appraiserId: "person-7",
    acknowledgmentStatus: "pending",
    importStatus: "manager_overdue",
  },
  {
    id: "person-7",
    name: "Anita Sharma",
    role: "HR Officer",
    department: "People Ops",
    managerId: null,
    appraiserId: null,
    acknowledgmentStatus: "acknowledged",
    importStatus: "verified",
  },
]

const goals = [
  {
    id: "goal-1",
    employeeId: "person-1",
    managerId: "person-4",
    title: "Improve terminal operations handover",
    description: "Reduce missed shift handover items by using a shared checklist before each supervisor change.",
    status: "flagged",
    flags: ["Missing numeric target", "Needs deadline"],
    aiSuggestion: "Reduce missed shift handover items by 30% by May 31 using a shared checklist before each supervisor change.",
  },
  {
    id: "goal-2",
    employeeId: "person-2",
    managerId: "person-6",
    title: "Strengthen access-control checks",
    description: "Improve patrol consistency and report exceptions quickly.",
    status: "flagged",
    flags: ["Vague outcome"],
    aiSuggestion: "Complete weekly access-control spot checks and report 100% of exceptions within one business day.",
  },
  {
    id: "goal-3",
    employeeId: "person-5",
    managerId: "person-4",
    title: "Speed up passenger issue resolution",
    description: "Close service desk tickets faster during peak check-in windows.",
    status: "flagged",
    flags: ["Needs measurable service level", "Appraiser missing"],
    aiSuggestion: "Resolve 85% of passenger service desk tickets within 20 minutes during peak check-in windows by Q3.",
  },
  {
    id: "goal-4",
    employeeId: "person-3",
    managerId: "person-7",
    title: "Complete appraisal file cleanup",
    description: "Reconcile employee appraisal records before the lock date.",
    status: "submitted",
    flags: [],
    aiSuggestion: "Reconcile 100% of employee appraisal records by Mar 5 and document unresolved exceptions for HR review.",
  },
  {
    id: "goal-5",
    employeeId: "person-6",
    managerId: "person-7",
    title: "Improve security team coaching cadence",
    description: "Hold monthly coaching conversations with all shift supervisors.",
    status: "flagged",
    flags: ["Needs evidence source"],
    aiSuggestion: "Hold monthly coaching conversations with all shift supervisors and log agreed actions in SIA within 48 hours.",
  },
]

const auditEvents = [
  {
    id: "audit-1",
    actor: "Anita Sharma",
    action: "Cycle opened",
    target: cycle.name,
    timestamp: "Feb 1, 09:00",
    detail: "Goal setting opened for managers and employees.",
  },
  {
    id: "audit-2",
    actor: "System",
    action: "Import verified",
    target: "People directory",
    timestamp: "Feb 2, 11:20",
    detail: "7 people loaded. 1 missing appraiser requires HR review.",
  },
  {
    id: "audit-3",
    actor: "Priya Nair",
    action: "AI draft edited",
    target: "Strengthen access-control checks",
    timestamp: "Feb 6, 14:45",
    detail: "Manager accepted AI wording changes before submission.",
  },
]

const reminders = [
  {
    id: "reminder-1",
    targetId: "person-6",
    targetType: "manager",
    sentAt: "Feb 8, 10:15",
    detail: "Reminder sent for overdue team goal review.",
  },
]

const exports = [
  {
    id: "export-1",
    name: "Cycle readiness CSV",
    status: "Ready",
    updatedAt: "Feb 8, 16:00",
  },
  {
    id: "export-2",
    name: "Employee acknowledgment PDF pack",
    status: "Available after HR closure",
    updatedAt: "Pending",
  },
]

const initialDemoState = {
  cycle,
  people,
  goals,
  auditEvents,
  reminders,
  exports,
}

function clone(value) {
  return structuredClone(value)
}

function createAuditEvent(action, target, detail, actor = "Anita Sharma") {
  return {
    id: `audit-${Date.now()}`,
    actor,
    action,
    target,
    timestamp: "Just now",
    detail,
  }
}

function updateGoal(state, goalId, updater) {
  return {
    ...state,
    goals: state.goals.map((goal) => {
      if (goal.id !== goalId) return goal
      return updater(goal)
    }),
  }
}

export function createInitialDemoState() {
  return clone(initialDemoState)
}

export function getDemoSummary(state) {
  const flaggedGoals = state.goals.filter((goal) => goal.flags.length > 0 && goal.status !== "approved").length
  const approvedGoals = state.goals.filter((goal) => goal.status === "approved").length
  const pendingAcknowledgments = state.people.filter((person) => person.acknowledgmentStatus !== "acknowledged").length
  const missingAppraisers = state.people.filter((person) => person.importStatus === "needs_appraiser").length
  const overdueManagers = state.people.filter((person) => person.importStatus === "manager_overdue").length

  return {
    flaggedGoals,
    approvedGoals,
    pendingAcknowledgments,
    missingAppraisers,
    overdueManagers,
    remindersSent: state.reminders.length,
    completion: Math.min(100, state.cycle.completion + approvedGoals * 4),
    acknowledgmentRate: Math.round(((state.people.length - pendingAcknowledgments) / state.people.length) * 100),
  }
}

export function approveGoal(state, goalId) {
  const goal = state.goals.find((item) => item.id === goalId)
  if (!goal) return state

  const next = updateGoal(state, goalId, (item) => ({
    ...item,
    status: "approved",
    flags: [],
    revisionReason: "",
  }))

  return {
    ...next,
    auditEvents: [
      createAuditEvent("Goal approved", goal.title, "HR approved the goal for lock readiness."),
      ...state.auditEvents,
    ],
  }
}

export function requestGoalRevision(state, goalId, reason) {
  const goal = state.goals.find((item) => item.id === goalId)
  if (!goal) return state

  const next = updateGoal(state, goalId, (item) => ({
    ...item,
    status: "revision_requested",
    revisionReason: reason,
  }))

  return {
    ...next,
    auditEvents: [
      createAuditEvent("Revision requested", goal.title, reason),
      ...state.auditEvents,
    ],
  }
}

export function sendReminder(state, targetId, targetType) {
  const target = state.people.find((person) => person.id === targetId)
  const label = target?.name ?? targetId
  const reminder = {
    id: `reminder-${state.reminders.length + 1}`,
    targetId,
    targetType,
    sentAt: "Just now",
    detail: `Reminder sent for ${targetType}.`,
  }

  return {
    ...state,
    reminders: [reminder, ...state.reminders],
    auditEvents: [
      createAuditEvent("Reminder sent", label, `A ${targetType} reminder was sent.`),
      ...state.auditEvents,
    ],
  }
}

export function markAcknowledged(state, personId) {
  const person = state.people.find((item) => item.id === personId)
  if (!person) return state

  return {
    ...state,
    people: state.people.map((item) => (
      item.id === personId
        ? { ...item, acknowledgmentStatus: "acknowledged" }
        : item
    )),
    auditEvents: [
      createAuditEvent("Acknowledgment marked", person.name, "Employee acknowledgment was marked complete."),
      ...state.auditEvents,
    ],
  }
}
