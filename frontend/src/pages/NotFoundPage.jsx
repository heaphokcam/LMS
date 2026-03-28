import { Link } from '@tanstack/react-router'
import { useAppContext } from '../contexts/AppContext'

function NotFoundPage() {
  const { t } = useAppContext()

  return (
    <div className="app-layout-bg flex min-h-screen items-center justify-center px-4">
      <div className="panel-card max-w-md rounded-xl p-8 text-center">
        <p className="text-5xl font-bold text-slate-300 dark:text-slate-600">404</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">{t('pages.notFound.title')}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('pages.notFound.description')}</p>
        <Link
          to="/dashboard"
          className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          {t('pages.notFound.goDashboard')}
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
