import { Link } from '@tanstack/react-router'

function PageHeader({ title, subtitle, breadcrumbs }) {
  return (
    <header className="mb-4 page-enter">
      {breadcrumbs?.length > 0 && (
        <nav className="mb-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-slate-300 dark:text-slate-600" fill="none" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-slate-700 dark:hover:text-slate-200 transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700 dark:text-slate-200 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-2xl">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      )}
    </header>
  )
}

export default PageHeader
