import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import ProgressBar from '../components/common/ProgressBar'
import StatusBadge from '../components/common/StatusBadge'
import EmptyState from '../components/common/EmptyState'
import { TableRowSkeleton } from '../components/common/Skeleton'
import { useAppContext } from '../contexts/AppContext'
import { useLoanApplications } from '../hooks/useLoanApplicationQueries'
import { progressFromStatus } from '../utils/loanApplicationUi'
import { formatCurrency, formatDate } from '../utils/format'

const LIST_SIZE = 500

function ApplicationHistoryPage() {
  const { language, t } = useAppContext()
  const [query, setQuery] = useState('')

  const { data: response, isLoading, isError } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return loanApplications
    return loanApplications.filter((item) => {
      const idStr = String(item.id ?? '')
      const name = (item.customerFullName ?? '').toLowerCase()
      const custId = String(item.customerId ?? '')
      return idStr.includes(normalized) || name.includes(normalized) || custId.includes(normalized)
    })
  }, [loanApplications, query])

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.history.title')} subtitle={t('pages.history.subtitle')} />

      <article className="glass-card rounded-xl p-5">
        <div className="mb-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('pages.history.searchPlaceholder')}
            className="field text-sm"
            disabled={isLoading || isError}
          />
        </div>

        {isError ? (
          <EmptyState title={t('common.loadError')} />
        ) : !isLoading && filtered.length === 0 ? (
          <EmptyState title={t('common.emptyData')} />
        ) : (
          <div className="table-shell">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-3 py-2.5">{t('pages.history.applicationId')}</th>
                  <th className="px-3 py-2.5">{t('pages.history.customer')}</th>
                  <th className="px-3 py-2.5">{t('pages.history.product')}</th>
                  <th className="px-3 py-2.5">{t('common.amount')}</th>
                  <th className="px-3 py-2.5">{t('pages.history.officer')}</th>
                  <th className="px-3 py-2.5">{t('common.status')}</th>
                  <th className="px-3 py-2.5">{t('pages.history.submittedOn')}</th>
                  <th className="px-3 py-2.5">{t('pages.history.progress')}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableRowSkeleton columns={8} rows={8} />
                ) : (
                  filtered.map((item) => {
                    const progress = progressFromStatus(item.status)
                    const submitted = item.appliedDate ? formatDate(item.appliedDate, language) : '\u2014'
                    return (
                      <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        <td className="px-3 py-2.5 font-semibold">{item.id}</td>
                        <td className="px-3 py-2.5">{item.customerFullName ?? '\u2014'}</td>
                        <td className="px-3 py-2.5">{item.loanProductName ?? '\u2014'}</td>
                        <td className="px-3 py-2.5">{formatCurrency(Number(item.amount ?? 0), language)}</td>
                        <td className="px-3 py-2.5">\u2014</td>
                        <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
                        <td className="px-3 py-2.5">{submitted}</td>
                        <td className="px-3 py-2.5">
                          <div className="min-w-24">
                            <ProgressBar value={progress} />
                            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{progress}%</p>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  )
}

export default ApplicationHistoryPage
