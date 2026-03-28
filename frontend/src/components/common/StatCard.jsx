function StatCard({ title, value, hint, accent = 'bg-blue-500' }) {
  return (
    <article className="glass-card rounded-xl p-4 page-enter">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`h-1.5 w-12 rounded-full ${accent}`} />
      </div>
      <p className="mt-3 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </article>
  )
}

export default StatCard
