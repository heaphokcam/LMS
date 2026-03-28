import { useMemo } from 'react'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'
import EmptyState from '../components/common/EmptyState'
import { MetricSkeleton } from '../components/common/Skeleton'
import { useAppContext } from '../contexts/AppContext'
import { useLoanApplications } from '../hooks/useLoanApplicationQueries'
import { buildMonthlyReportFromApplications } from '../utils/loanApplicationUi'
import { formatCurrency } from '../utils/format'

const LIST_SIZE = 500

function ReportingPage() {
  const { language, t } = useAppContext()
  const { data: response, isLoading, isError } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const monthlyReport = useMemo(
    () => buildMonthlyReportFromApplications(loanApplications, 6),
    [loanApplications],
  )

  const approvedCount = monthlyReport.reduce((total, item) => total + item.approved, 0)
  const rejectedCount = monthlyReport.reduce((total, item) => total + item.rejected, 0)
  const approvalRate = (approvedCount / Math.max(1, approvedCount + rejectedCount)) * 100

  const approvedApplications = loanApplications.filter((item) =>
    ['APPROVED', 'MANAGER_APPROVED'].includes(item.status),
  )
  const avgTicket =
    approvedApplications.reduce((total, item) => total + Number(item.amount ?? 0), 0) /
    Math.max(1, approvedApplications.length)

  const peakVolume = Math.max(
    ...monthlyReport.map((item) => item.approved + item.rejected + item.pending),
    1,
  )

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.reporting.title')} subtitle={t('pages.reporting.subtitle')} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricSkeleton count={4} />
        </div>
      ) : isError ? (
        <EmptyState title={t('common.loadError')} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t('pages.reporting.approvedCount')}
          value={approvedCount}
          accent="bg-emerald-500"
        />
        <StatCard
          title={t('pages.reporting.rejectedCount')}
          value={rejectedCount}
          accent="bg-red-500"
        />
        <StatCard
          title={t('pages.reporting.approvalRate')}
          value={`${approvalRate.toFixed(1)}%`}
          accent="bg-blue-500"
        />
        <StatCard
          title={t('pages.reporting.avgTicket')}
          value={formatCurrency(avgTicket, language)}
          accent="bg-amber-500"
        />
      </div>

      <article className="mt-4 glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {t('pages.reporting.monthlySnapshot')}
        </h2>

        {!isLoading && monthlyReport.length === 0 ? (
          <EmptyState title={t('common.emptyData')} />
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {monthlyReport.map((item) => {
              const total = item.approved + item.rejected + item.pending
              const width = peakVolume ? (total / peakVolume) * 100 : 0

              return (
                <div key={item.month} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.month}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {total} {t('common.cases')}
                    </p>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <p>
                      {t('status.APPROVED')}: {item.approved}
                    </p>
                    <p>
                      {t('pages.dashboard.pendingCases')}: {item.pending}
                    </p>
                    <p>
                      {t('status.REJECTED')}: {item.rejected}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </article>
    </section>
  )
}

export default ReportingPage
