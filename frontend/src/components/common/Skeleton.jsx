function Skeleton({ className = '', variant = 'text' }) {
  const base = 'animate-pulse rounded bg-slate-200 dark:bg-slate-700'

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />
  }

  return <div className={`${base} ${className}`} />
}

function CardSkeleton({ count = 1 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="glass-card rounded-xl p-5 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="grid grid-cols-2 gap-2 pt-2">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
  ))
}

function TableRowSkeleton({ columns = 5, rows = 5 }) {
  return Array.from({ length: rows }, (_, r) => (
    <tr key={r}>
      {Array.from({ length: columns }, (_, c) => (
        <td key={c} className="px-4 py-3">
          <Skeleton className={`h-4 ${c === 0 ? 'w-16' : c === columns - 1 ? 'w-20' : 'w-full'}`} />
        </td>
      ))}
    </tr>
  ))
}

function MetricSkeleton({ count = 4 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="panel-card rounded-xl p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  ))
}

export default Skeleton
export { CardSkeleton, TableRowSkeleton, MetricSkeleton }
