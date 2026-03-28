import { useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import ProgressBar from '../components/common/ProgressBar'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { CardSkeleton } from '../components/common/Skeleton'
import ToastContainer from '../components/common/Toast'
import { useAppContext } from '../contexts/AppContext'
import { useDisburseLoanApplication, useLoanApplications, useUpdateLoanApplication } from '../hooks/useLoanApplicationQueries'
import { progressFromStatus } from '../utils/loanApplicationUi'
import { formatCurrency, formatDate } from '../utils/format'
import { useToast } from '../hooks/useToast'

/** Step 3 — manager must final-approve after officer */
const MANAGER_APPROVAL_QUEUE = ['OFFICER_APPROVED']
/** Step 4 — release funds */
const DISBURSE_ELIGIBLE = ['APPROVED', 'MANAGER_APPROVED']
const LIST_SIZE = 200

function DisbursementPage() {
  const { language, t } = useAppContext()
  const [error, setError] = useState('')
  const { toasts, addToast, removeToast } = useToast()

  const { data: response, isLoading, isError } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const disburseMutation = useDisburseLoanApplication({
    onSuccess: () => {
      setError('')
      addToast(t('pages.disbursement.successMessage'), 'success')
    },
    onError: (err) => {
      setError(err.response?.data?.message ?? err.message ?? 'Disbursement failed')
    },
  })

  const updateMutation = useUpdateLoanApplication({
    onSuccess: () => {
      setError('')
      addToast(t('pages.disbursement.managerApproveSuccess'), 'success')
    },
    onError: (err) => {
      setError(err.response?.data?.message ?? err.message ?? 'Update failed')
    },
  })

  const managerQueue = loanApplications.filter((item) => MANAGER_APPROVAL_QUEUE.includes(item.status))
  const eligibleQueue = loanApplications.filter((item) => DISBURSE_ELIGIBLE.includes(item.status))
  const disbursedList = loanApplications.filter((item) => item.status === 'DISBURSED')

  const buildUpdateBody = (item, nextStatus) => ({
    customerId: item.customerId,
    loanProductId: item.loanProductId,
    amount: Number(item.amount ?? 0),
    durationMonths: item.durationMonths,
    status: nextStatus,
  })

  const handleManagerApprove = (item) => {
    setError('')
    updateMutation.mutate({ id: item.id, body: buildUpdateBody(item, 'APPROVED') })
  }

  const handleDisburse = (appId) => {
    setError('')
    disburseMutation.mutate(appId)
  }

  const anyMutationPending = disburseMutation.isPending || updateMutation.isPending

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.disbursement.title')} subtitle={t('pages.disbursement.subtitle')} />

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
      ) : (
        <>
          {/* Step 3: Manager approval after officer */}
          <article className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {t('pages.disbursement.managerQueue')}
              <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                {managerQueue.length}
              </span>
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">{t('pages.disbursement.managerQueueHint')}</p>

            {managerQueue.length === 0 ? (
              <EmptyState title={t('pages.disbursement.noManagerQueue')} />
            ) : (
              <div className="grid gap-4">
                {managerQueue.map((item) => {
                  const progress = progressFromStatus(item.status)
                  const submitted = item.appliedDate ? formatDate(item.appliedDate, language) : '\u2014'
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-bold text-slate-900 dark:text-slate-100">{item.id}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.customerFullName ?? '\u2014'}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.product')}</p>
                          <p>{item.loanProductName ?? '\u2014'}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.amount')}</p>
                          <p>{formatCurrency(Number(item.amount ?? 0), language)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.terms')}</p>
                          <p>{item.durationMonths ?? '\u2014'}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.submittedOn')}</p>
                          <p>{submitted}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <ProgressBar value={progress} />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{progress}%</p>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          disabled={anyMutationPending}
                          onClick={() => handleManagerApprove(item)}
                          className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-400 disabled:opacity-50 transition hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                        >
                          {updateMutation.isPending ? '\u2026' : t('pages.disbursement.approveForDisbursement')}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </article>

          {/* Step 4: Pending disbursement */}
          <article className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
              {t('pages.disbursement.pendingQueue')}
              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                {eligibleQueue.length}
              </span>
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">{t('pages.disbursement.pendingQueueHint')}</p>

            {eligibleQueue.length === 0 ? (
              <EmptyState title={t('pages.disbursement.noPending')} />
            ) : (
              <div className="grid gap-4">
                {eligibleQueue.map((item) => {
                  const progress = progressFromStatus(item.status)
                  const submitted = item.appliedDate ? formatDate(item.appliedDate, language) : '\u2014'
                  return (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-bold text-slate-900 dark:text-slate-100">{item.id}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.customerFullName ?? '\u2014'}</p>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.product')}</p>
                          <p>{item.loanProductName ?? '\u2014'}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.amount')}</p>
                          <p>{formatCurrency(Number(item.amount ?? 0), language)}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('common.terms')}</p>
                          <p>{item.durationMonths ?? '\u2014'}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
                          <p className="font-semibold text-slate-500 dark:text-slate-400">{t('pages.history.submittedOn')}</p>
                          <p>{submitted}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <ProgressBar value={progress} />
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{progress}%</p>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          disabled={anyMutationPending}
                          onClick={() => handleDisburse(item.id)}
                          className="rounded-lg bg-teal-100 dark:bg-teal-900/30 px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-400 disabled:opacity-50 transition hover:bg-teal-200 dark:hover:bg-teal-900/50"
                        >
                          {disburseMutation.isPending ? '\u2026' : t('pages.disbursement.disburseButton')}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </article>

          {/* Recently disbursed */}
          {disbursedList.length > 0 && (
            <article className="glass-card rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4">
                {t('pages.disbursement.recentlyDisbursed')}
                <span className="ml-2 inline-flex items-center rounded-full bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
                  {disbursedList.length}
                </span>
              </h2>

              <div className="table-shell">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <th className="px-3 py-2.5">{t('pages.history.applicationId')}</th>
                      <th className="px-3 py-2.5">{t('pages.history.customer')}</th>
                      <th className="px-3 py-2.5">{t('pages.history.product')}</th>
                      <th className="px-3 py-2.5">{t('common.amount')}</th>
                      <th className="px-3 py-2.5">{t('pages.disbursement.disbursedDate')}</th>
                      <th className="px-3 py-2.5">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disbursedList.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <td className="px-3 py-2.5 font-semibold">{item.id}</td>
                        <td className="px-3 py-2.5">{item.customerFullName ?? '\u2014'}</td>
                        <td className="px-3 py-2.5">{item.loanProductName ?? '\u2014'}</td>
                        <td className="px-3 py-2.5">{formatCurrency(Number(item.amount ?? 0), language)}</td>
                        <td className="px-3 py-2.5">{item.disbursedDate ? formatDate(item.disbursedDate, language) : '\u2014'}</td>
                        <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}
        </>
      )}

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </section>
  )
}

export default DisbursementPage
