import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  createInitialDemoState,
  filterEmployees,
  getOverviewSummary,
  sortEmployees,
  validateCycleConfig,
} from "./workflow.js"

describe("HR Lean MVP workflow helpers", () => {
  it("combines employee filters across department, manager, grade, and status", () => {
    const state = createInitialDemoState()

    const matches = filterEmployees(state.employees, {
      department: "Operations",
      manager: "Marcus Jean",
      grade: "Pending",
      status: "In progress",
    }, "leah")

    assert.deepEqual(matches.map((employee) => employee.name), ["Leah Baptiste"])
  })

  it("sorts employees by appraisal status and latest grade", () => {
    const state = createInitialDemoState()

    const byStatus = sortEmployees(state.employees, { key: "appraisalStatus", direction: "asc" })
    const byGrade = sortEmployees(state.employees, { key: "latestGrade", direction: "desc" })

    assert.equal(byStatus[0].appraisalStatus, "Complete")
    assert.equal(byGrade[0].latestGrade, "5")
    assert.equal(byGrade.at(-1).latestGrade, "Pending")
  })

  it("validates cycle weights and phase windows", () => {
    const state = createInitialDemoState()
    const invalidConfig = {
      ...state.cycleConfig,
      assessmentWeights: {
        midYear: 30,
        final: 60,
      },
      phases: [
        { id: "goalSetting", label: "Goal Setting", startDate: "2026-01-31", endDate: "2026-01-01" },
        { id: "midYear", label: "Mid-Year Assessment", startDate: "2026-06-01", endDate: "2026-06-30" },
        { id: "final", label: "Final Assessment", startDate: "2026-06-15", endDate: "2026-12-12" },
      ],
    }

    assert.deepEqual(validateCycleConfig(invalidConfig), [
      "Assessment weights must total 100%.",
      "Goal Setting cannot end before it starts.",
      "Mid-Year Assessment cannot overlap Final Assessment.",
    ])
  })

  it("prioritizes overdue and near-deadline managers before normal managers", () => {
    const state = createInitialDemoState()
    const summary = getOverviewSummary(state)

    assert.deepEqual(
      summary.managerProgress.map((manager) => manager.riskStatus),
      ["Overdue", "Near deadline", "On track", "On track"]
    )
  })
})
