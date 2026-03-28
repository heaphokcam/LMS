function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)

  const pages = [0]
  const start = Math.max(1, current - 1)
  const end = Math.min(total - 2, current + 1)

  if (start > 1) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 2) pages.push('...')
  pages.push(total - 1)

  return pages
}

function Pagination({ pageIndex, totalPages, onPageChange, t }) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(pageIndex, totalPages)
  const canPrev = pageIndex > 0
  const canNext = pageIndex < totalPages - 1

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t?.('pages.customers.page') ?? 'Page'} {pageIndex + 1} {t?.('pages.customers.of') ?? 'of'} {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => onPageChange(pageIndex - 1)}
          className="btn-secondary rounded-lg px-2.5 py-1.5 text-xs disabled:opacity-40"
        >
          {t?.('pages.customers.prev') ?? 'Prev'}
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-slate-400">...</span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                p === pageIndex
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {p + 1}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={!canNext}
          onClick={() => onPageChange(pageIndex + 1)}
          className="btn-secondary rounded-lg px-2.5 py-1.5 text-xs disabled:opacity-40"
        >
          {t?.('pages.customers.next') ?? 'Next'}
        </button>
      </div>
    </div>
  )
}

export default Pagination
