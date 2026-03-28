import { useMemo, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import StatCard from '../components/common/StatCard'
import { useAppContext } from '../contexts/AppContext'
import { useLoanApplications } from '../hooks/useLoanApplicationQueries'
import { buildOverdueBucketsFromApplications } from '../utils/loanApplicationUi'
import { formatCurrency } from '../utils/format'

const LIST_SIZE = 500

function OverdueSimulationPage() {
  const { language, t } = useAppContext()
  const [principal, setPrincipal] = useState(12000)
  const [daysOverdue, setDaysOverdue] = useState(27)
  const [penaltyRate, setPenaltyRate] = useState(0.15)

  const { data: response, isLoading } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const overdueBuckets = useMemo(
    () => buildOverdueBucketsFromApplications(loanApplications),
    [loanApplications],
  )

  const penaltyAmount = (principal * penaltyRate * daysOverdue) / 100

  const { riskBand, action } = useMemo(() => {
    if (daysOverdue <= 15) {
      return {
        riskBand: 'Low',
        action: language === 'kh' ? 'ហៅរំលឹកស្រាល និងផ្ញើ SMS' : 'Soft reminder call and SMS',
      }
    }
    if (daysOverdue <= 30) {
      return {
        riskBand: 'Medium',
        action:
          language === 'kh'
            ? 'ធ្វើផែនការបង់ឡើងវិញ និងតាមដានរៀងរាល់សប្តាហ៍'
            : 'Start repayment arrangement and weekly follow-up',
      }
    }
    if (daysOverdue <= 60) {
      return {
        riskBand: 'High',
        action:
          language === 'kh'
            ? 'ចុះពិនិត្យទីតាំង និងជួបអតិថិជនដោយផ្ទាល់'
            : 'Field visit and direct negotiation with borrower',
      }
    }

    return {
      riskBand: 'Critical',
      action:
        language === 'kh'
          ? 'បញ្ជូនទៅក្រុមប្រមូលបំណុល និងត្រួតពិនិត្យផ្នែកច្បាប់'
          : 'Escalate to collection and legal review',
    }
  }, [daysOverdue, language])

  const maxAmount = Math.max(1, ...overdueBuckets.map((item) => item.amount))

  return (
    <section className="space-y-4 page-enter">
      <PageHeader title={t('pages.overdue.title')} subtitle={t('pages.overdue.subtitle')} />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2"><div className="panel-card rounded-xl p-5 space-y-3"><div className="animate-pulse rounded bg-slate-200 dark:bg-slate-700 h-4 w-24" /><div className="animate-pulse rounded bg-slate-200 dark:bg-slate-700 h-8 w-20" /></div><div className="panel-card rounded-xl p-5 space-y-3"><div className="animate-pulse rounded bg-slate-200 dark:bg-slate-700 h-4 w-24" /><div className="animate-pulse rounded bg-slate-200 dark:bg-slate-700 h-8 w-20" /></div></div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <article className="glass-card rounded-xl p-5">
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.overdue.principal')}
              </span>
              <input
                type="number"
                value={principal}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="field"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.overdue.daysOverdue')}
              </span>
              <input
                type="range"
                min="1"
                max="120"
                value={daysOverdue}
                onChange={(event) => setDaysOverdue(Number(event.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {daysOverdue} {t('common.days')}
              </p>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t('pages.overdue.penaltyRate')}
              </span>
              <input
                type="number"
                step="0.01"
                value={penaltyRate}
                onChange={(event) => setPenaltyRate(Number(event.target.value))}
                className="field"
              />
            </label>
          </div>
        </article>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              title={t('pages.overdue.penaltyAmount')}
              value={formatCurrency(penaltyAmount, language)}
              accent="from-rose-500 to-orange-500"
            />
            <StatCard
              title={t('pages.overdue.riskBand')}
              value={riskBand}
              accent="from-amber-500 to-rose-500"
            />
          </div>

          <article className="glass-card rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('pages.overdue.recommendedAction')}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{action}</p>
          </article>

          <article className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t('pages.overdue.buckets')}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {language === 'kh'
                ? 'ទិន្នន័យពីកម្ចីដែលមានស្ថានភាព OVERDUE (គ្មានថ្ងៃយឺតក្នុង API)'
                : 'From applications with status OVERDUE (days-past-due not stored in API).'}
            </p>

            {isLoading ? (
              <p className="mt-4 text-sm text-slate-500">{t('common.loading')}</p>
            ) : overdueBuckets.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">{t('common.emptyData')}</p>
            ) : (
            <div className="mt-4 space-y-3">
              {overdueBuckets.map((bucket) => (
                <div key={bucket.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{language === 'kh' ? bucket.labelKh : bucket.label}</span>
                    <span>
                      {bucket.count} {t('common.loans')} • {formatCurrency(bucket.amount, language)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${maxAmount ? (bucket.amount / maxAmount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}

export default OverdueSimulationPage