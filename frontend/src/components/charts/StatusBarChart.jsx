import { useAppContext } from '../../contexts/AppContext'

function StatusBarChart({ data }) {
  const { t } = useAppContext()
  const maxValue = Math.max(...data.map((item) => item.value), 1)

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.status} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>{t(`status.${item.status}`)}</span>
            <span>{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatusBarChart
