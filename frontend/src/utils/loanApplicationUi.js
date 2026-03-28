/** Progress 0–100 for UI, aligned with 4 workflow steps: submit → officer → manager → disburse */
export function progressFromStatus(status) {
  const map = {
    SUBMITTED: 12,
    UNDER_REVIEW: 25,
    NEEDS_INFO: 20,
    OFFICER_APPROVED: 50,
    MANAGER_APPROVED: 75,
    APPROVED: 90,
    DISBURSED: 100,
    REJECTED: 100,
    OVERDUE: 50,
  }
  return map[status] ?? 25
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const PENDING_STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'OFFICER_APPROVED', 'MANAGER_APPROVED']

/**
 * Build last N calendar months of aggregates from applications (appliedDate ISO).
 * @param {Array<Record<string, unknown>>} applications
 * @param {number} [monthsBack=6]
 */
export function buildMonthlyReportFromApplications(applications, monthsBack = 6) {
  const now = new Date()
  const keys = []
  for (let i = monthsBack - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const byMonth = Object.fromEntries(
    keys.map((k) => [k, { approved: 0, rejected: 0, pending: 0 }]),
  )

  for (const app of applications) {
    if (!app?.appliedDate) continue
    const dt = new Date(app.appliedDate)
    if (Number.isNaN(dt.getTime())) continue
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    if (!byMonth[key]) continue
    const st = app.status
    if (st === 'APPROVED') byMonth[key].approved += 1
    else if (st === 'REJECTED') byMonth[key].rejected += 1
    else if (PENDING_STATUSES.includes(st)) byMonth[key].pending += 1
  }

  return keys.map((key) => {
    const [, m] = key.split('-')
    const monthIdx = Number.parseInt(m, 10) - 1
    return {
      month: MONTH_LABELS[monthIdx] ?? key,
      ...byMonth[key],
    }
  })
}

/**
 * Bucket labels for overdue simulation; amounts/counts from OVERDUE applications only (no DPD in API).
 * @param {Array<Record<string, unknown>>} applications
 */
export function buildOverdueBucketsFromApplications(applications) {
  const overdue = applications.filter((a) => a?.status === 'OVERDUE')
  const totalAmount = overdue.reduce((s, a) => s + Number(a.amount ?? 0), 0)
  const count = overdue.length

  const base = [
    { label: '1-15 days', labelKh: '១-១៥ ថ្ងៃ', count: 0, amount: 0 },
    { label: '16-30 days', labelKh: '១៦-៣០ ថ្ងៃ', count: 0, amount: 0 },
    { label: '31-60 days', labelKh: '៣១-៦០ ថ្ងៃ', count: 0, amount: 0 },
    { label: '60+ days', labelKh: 'លើស ៦០ ថ្ងៃ', count: 0, amount: 0 },
  ]

  if (count === 0) {
    return base
  }

  const out = [...base]
  out[0] = { ...out[0], count, amount: totalAmount }
  return out
}
