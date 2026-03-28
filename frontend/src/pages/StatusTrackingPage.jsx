import { useEffect, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import ProgressBar from '../components/common/ProgressBar'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { CardSkeleton } from '../components/common/Skeleton'
import { useAppContext } from '../contexts/AppContext'
import { approvalWorkflow } from '../data/workflowSteps'
import { useLoanApplications } from '../hooks/useLoanApplicationQueries'
import { progressFromStatus } from '../utils/loanApplicationUi'

const LIST_SIZE = 200

function StatusTrackingPage() {
  const { language, t } = useAppContext()
  const { data: response, isLoading } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const [selectedId, setSelectedId] = useState('')

  useEffect(() => {
    if (loanApplications.length === 0) return
    const first = loanApplications[0]
    setSelectedId((prev) => {
      if (prev !== '') return prev
      return String(first.id)
    })
  }, [loanApplications])

  const selectedApplication =
    loanApplications.find((item) => String(item.id) === String(selectedId)) ?? loanApplications[0]

  const progress = selectedApplication ? progressFromStatus(selectedApplication.status) : 0
  const completedSteps = Math.max(
    1,
    Math.round((progress / 100) * approvalWorkflow.length),
  )

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.tracking.title')} subtitle={t('pages.tracking.subtitle')} />

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <CardSkeleton count={1} />
          <CardSkeleton count={1} />
        </div>
      ) : null}

      {!isLoading && loanApplications.length === 0 ? (
        <EmptyState title={t('common.emptyData')} />
      ) : null}

      {selectedApplication ? (
        <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <article className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('pages.tracking.selectSample')}
            </h2>
            <select
              value={String(selectedId)}
              onChange={(event) => setSelectedId(event.target.value)}
              className="mt-3 field text-sm"
            >
              {loanApplications.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.customerFullName ?? '—'}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-700 dark:text-slate-300">
              <p className="font-semibold">{selectedApplication.id}</p>
              <p>{selectedApplication.customerFullName ?? '\u2014'}</p>
              <p className="mt-1">{selectedApplication.loanProductName ?? '\u2014'}</p>
              <div className="mt-2">
                <StatusBadge status={selectedApplication.status} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('pages.tracking.percentComplete')}
              </p>
              <ProgressBar value={progress} />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{progress}%</p>
            </div>
          </article>

          <article className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('pages.tracking.timeline')}
            </h2>

            <ol className="mt-4 space-y-3">
              {approvalWorkflow.map((step, index) => {
                const isDone = index < completedSteps
                const isCurrent = index === completedSteps - 1

                return (
                  <li
                    key={step.id}
                    className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                      isCurrent
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        : isDone
                          ? 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50'
                          : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                        isCurrent ? 'bg-blue-500' : isDone ? 'bg-slate-400 dark:bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {language === 'kh' ? step.stepKh : step.step}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t(`roles.${step.role}`)} • {step.sla}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </article>
        </div>
      ) : null}
    </section>
  )
}

export default StatusTrackingPage