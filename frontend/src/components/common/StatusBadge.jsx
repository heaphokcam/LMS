import { useAppContext } from '../../contexts/AppContext'

const STYLE_MAP = {
  DRAFT: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  SUBMITTED: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
  UNDER_REVIEW: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  OFFICER_APPROVED: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400',
  MANAGER_APPROVED: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  APPROVED: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  REJECTED: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
  NEEDS_INFO: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  DISBURSED: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  OVERDUE: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

function StatusBadge({ status }) {
  const { t } = useAppContext()

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        STYLE_MAP[status] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
      }`}
    >
      {t(`status.${status}`)}
    </span>
  )
}

export default StatusBadge
