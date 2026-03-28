import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import ProgressBar from '../components/common/ProgressBar'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { CardSkeleton } from '../components/common/Skeleton'
import { useAppContext } from '../contexts/AppContext'
import { useLoanApplications, useUpdateLoanApplication } from '../hooks/useLoanApplicationQueries'
import { progressFromStatus } from '../utils/loanApplicationUi'
import { formatCurrency, formatDate } from '../utils/format'

const reviewStatuses = ['UNDER_REVIEW', 'NEEDS_INFO', 'SUBMITTED']
const LIST_SIZE = 200

function OfficerReviewPage() {
  const { language, t } = useAppContext()
  const [actionHistory, setActionHistory] = useState({})
  const [error, setError] = useState('')

  const { data: response, isLoading, isError } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const updateMutation = useUpdateLoanApplication({
    onError: (err) => {
      setError(err.response?.data?.message ?? err.message ?? 'Update failed')
    },
  })

  const reviewQueue = loanApplications.filter((item) => reviewStatuses.includes(item.status))

  const setAction = (appId, nextStatus) => {
    setError('')
    const item = loanApplications.find((a) => a.id === appId)
    if (!item) return

    updateMutation.mutate(
      {
        id: appId,
        body: {
          customerId: item.customerId,
          loanProductId: item.loanProductId,
          amount: Number(item.amount ?? 0),
          durationMonths: item.durationMonths,
          status: nextStatus,
        },
      },
      {
        onSuccess: () => {
          setActionHistory((prev) => ({ ...prev, [appId]: nextStatus }))
        },
      },
    )
  }

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.review.title')} subtitle={t('pages.review.subtitle')} />

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          <CardSkeleton count={3} />
        </div>
      ) : isError ? (
        <EmptyState title={t('common.loadError')} />
      ) : reviewQueue.length === 0 ? (
        <EmptyState
          title={t('common.emptyData')}
          description={t('pages.review.subtitle')}
        />
      ) : (
        <div className="grid gap-4">
          {reviewQueue.map((item) => {
            const progress = progressFromStatus(item.status)
            const submitted = item.appliedDate ? formatDate(item.appliedDate, language) : '\u2014'
            return (
              <article key={item.id} className="glass-card rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">{item.id}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.customerFullName ?? '\u2014'}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.amount')}</p>
                    <p>{formatCurrency(Number(item.amount ?? 0), language)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.review.riskScore')}</p>
                    <p>\u2014</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.submittedOn')}</p>
                    <p>{submitted}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.officer')}</p>
                    <p>\u2014</p>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar value={progress} />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{progress}%</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.review.quickActions')}:</span>
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => setAction(item.id, 'OFFICER_APPROVED')}
                    className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 disabled:opacity-50 transition hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                  >
                    {t('pages.review.approve')}
                  </button>
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => setAction(item.id, 'NEEDS_INFO')}
                    className="rounded-lg bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 disabled:opacity-50 transition hover:bg-amber-200 dark:hover:bg-amber-900/50"
                  >
                    {t('pages.review.requestInfo')}
                  </button>
                  <button
                    type="button"
                    disabled={updateMutation.isPending}
                    onClick={() => setAction(item.id, 'REJECTED')}
                    className="rounded-lg bg-rose-100 dark:bg-rose-900/30 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 disabled:opacity-50 transition hover:bg-rose-200 dark:hover:bg-rose-900/50"
                  >
                    {t('pages.review.reject')}
                  </button>
                  {actionHistory[item.id] && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('pages.review.lastAction')}: {t(`status.${actionHistory[item.id]}`)}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default OfficerReviewPage
