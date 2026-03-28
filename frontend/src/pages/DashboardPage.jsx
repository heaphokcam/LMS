import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'
import { getNavLabelKeysForRole } from '../config/navConfig'
import { useLoanApplications } from '../hooks/useLoanApplicationQueries'
import { MetricSkeleton } from '../components/common/Skeleton'
import { formatCurrency } from '../utils/format'

const MotionArticle = motion.article

const pendingStatuses = ['UNDER_REVIEW', 'OFFICER_APPROVED', 'MANAGER_APPROVED', 'NEEDS_INFO', 'SUBMITTED']

const LIST_SIZE = 500

const metricConfig = [
  { key: 'totalApplications', accent: 'border-l-blue-500', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-6-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M14 3v4h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  )},
  { key: 'pendingReview', accent: 'border-l-amber-500', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )},
  { key: 'approved', accent: 'border-l-emerald-500', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" /></svg>
  )},
  { key: 'overdueCases', accent: 'border-l-rose-500', icon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
  )},
]

const barColors = ['bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-500']

function DashboardPage() {
  const { language, role, t } = useAppContext()
  const { data: response, isLoading } = useLoanApplications(0, LIST_SIZE)
  const loanApplications = response?.data?.content ?? []

  const totalVolume = loanApplications.reduce((sum, item) => sum + Number(item.amount ?? 0), 0)
  const pendingReview = loanApplications.filter((item) => pendingStatuses.includes(item.status)).length
  const approved = loanApplications.filter((item) => ['APPROVED', 'DISBURSED'].includes(item.status)).length
  const overdueCases = loanApplications.filter((item) => item.status === 'OVERDUE').length

  const metricValues = [
    { value: loanApplications.length, subtitle: `${formatCurrency(totalVolume, language)} ${t('pages.dashboard.totalLoanVolume')}` },
    { value: pendingReview, subtitle: t('pages.dashboard.officerAndManagerQueue') },
    { value: approved, subtitle: t('pages.dashboard.disbursedActiveContracts') },
    { value: overdueCases, subtitle: t('pages.dashboard.simulationReadyMonitoringList') },
  ]

  const distribution = useMemo(() => {
    const pendingManager = loanApplications
      .filter((item) => ['OFFICER_APPROVED', 'MANAGER_APPROVED'].includes(item.status))
      .reduce((sum, item) => sum + Number(item.amount ?? 0), 0)
    const approvedAmount = loanApplications
      .filter((item) => item.status === 'APPROVED')
      .reduce((sum, item) => sum + Number(item.amount ?? 0), 0)
    const rejectedAmount = loanApplications
      .filter((item) => item.status === 'REJECTED')
      .reduce((sum, item) => sum + Number(item.amount ?? 0), 0)
    const underReviewAmount = loanApplications
      .filter((item) => ['UNDER_REVIEW', 'NEEDS_INFO'].includes(item.status))
      .reduce((sum, item) => sum + Number(item.amount ?? 0), 0)

    return [
      { label: language === 'kh' ? 'រង់ចាំអ្នកគ្រប់គ្រង' : 'Pending Manager', amount: pendingManager },
      { label: t('status.APPROVED'), amount: approvedAmount },
      { label: t('status.REJECTED'), amount: rejectedAmount },
      { label: t('status.UNDER_REVIEW'), amount: underReviewAmount },
    ]
  }, [language, loanApplications, t])

  const maxAmount = Math.max(...distribution.map((item) => item.amount), 1)

  const rolePermissions = getNavLabelKeysForRole(role)

  return (
    <section className="space-y-4 page-enter">
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <MetricSkeleton count={4} />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {metricConfig.map((cfg, i) => (
            <MotionArticle
              key={cfg.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`panel-card overflow-hidden rounded-xl border-l-4 ${cfg.accent} p-5`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t(`pages.dashboard.${cfg.key}`)}
                </p>
                <span className="text-slate-300 dark:text-slate-600">{cfg.icon}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">
                {metricValues[i].value}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {metricValues[i].subtitle}
              </p>
            </MotionArticle>
          ))}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(320px,1fr)]">
        <article className="panel-card rounded-xl p-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t('pages.dashboard.loanStatusDistribution')}
          </h3>
          <div className="mt-4 space-y-4">
            {distribution.map((item, idx) => (
              <div
                key={item.label}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[160px_minmax(0,1fr)_120px] sm:items-center sm:gap-3"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
                <div className="h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${barColors[idx] ?? 'bg-blue-500'} transition-all duration-500`}
                    style={{ width: `${Math.max(5, (item.amount / maxAmount) * 100)}%` }}
                  />
                </div>
                <p className="text-left text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-right">
                  {formatCurrency(item.amount, language)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card rounded-xl p-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t('pages.dashboard.roleExpansion')}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t('pages.dashboard.currentRolePermissions')}
          </p>
          <ul className="mt-3 space-y-1.5">
            {rolePermissions.map((permission) => (
              <li key={permission} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                {t(permission)}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

export default DashboardPage
