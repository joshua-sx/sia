import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  approveGoal,
  createInitialDemoState,
  getDemoSummary,
  markAcknowledged,
  requestGoalRevision,
  sendReminder,
} from "./workflow.js"

describe("SIA demo workflow state", () => {
  it("approves a flagged goal and records the audit trail", () => {
    const state = createInitialDemoState()
    const before = getDemoSummary(state)

    const next = approveGoal(state, "goal-1")
    const approvedGoal = next.goals.find((goal) => goal.id === "goal-1")
    const after = getDemoSummary(next)

    assert.equal(approvedGoal.status, "approved")
    assert.deepEqual(approvedGoal.flags, [])
    assert.equal(after.flaggedGoals, before.flaggedGoals - 1)
    assert.equal(next.auditEvents[0].action, "Goal approved")
    assert.equal(next.auditEvents[0].target, "Improve terminal operations handover")
  })

  it("requests a goal revision with a clear reason", () => {
    const state = createInitialDemoState()

    const next = requestGoalRevision(state, "goal-2", "Add a measurable outcome before lock.")
    const revisedGoal = next.goals.find((goal) => goal.id === "goal-2")

    assert.equal(revisedGoal.status, "revision_requested")
    assert.equal(revisedGoal.revisionReason, "Add a measurable outcome before lock.")
    assert.equal(next.auditEvents[0].action, "Revision requested")
    assert.match(next.auditEvents[0].detail, /measurable outcome/)
  })

  it("sends reminders and clears pending acknowledgments", () => {
    const state = createInitialDemoState()
    const reminded = sendReminder(state, "person-5", "acknowledgment")
    const acknowledged = markAcknowledged(reminded, "person-5")
    const person = acknowledged.people.find((employee) => employee.id === "person-5")
    const summary = getDemoSummary(acknowledged)

    assert.equal(reminded.reminders.length, state.reminders.length + 1)
    assert.equal(person.acknowledgmentStatus, "acknowledged")
    assert.equal(summary.pendingAcknowledgments, getDemoSummary(state).pendingAcknowledgments - 1)
    assert.equal(acknowledged.auditEvents[0].action, "Acknowledgment marked")
  })
})
