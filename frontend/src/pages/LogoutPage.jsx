import { useEffect, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import Logo from '../components/common/Logo'
import { useAppContext } from '../contexts/AppContext'

function LogoutPage() {
  const router = useRouter()
  const { t, setRoles, setRole } = useAppContext()
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('lms_role')
      sessionStorage.removeItem('lms_role')
      setRoles(['CUSTOMER'])
      setRole('CUSTOMER')
      setCompleted(true)
    }, 600)

    return () => clearTimeout(logoutTimer)
  }, [setRoles, setRole])

  useEffect(() => {
    if (!completed) {
      return undefined
    }

    const redirectTimer = setTimeout(() => {
      router.navigate({ to: '/login', replace: true })
    }, 1300)

    return () => clearTimeout(redirectTimer)
  }, [completed, router])

  return (
    <section className="page-enter">
      <article className="panel-card mx-auto max-w-xl rounded-xl p-6 text-center">
        <div className="mx-auto inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-3">
          <Logo className="h-12 w-12" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('pages.logout.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('pages.logout.subtitle')}</p>

        <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 py-3">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {completed ? t('pages.logout.success') : t('pages.logout.signingOut')}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('pages.logout.redirecting')}...</p>
        </div>

        <Link to="/login" className="btn-primary mt-6 inline-block px-4 py-2 text-sm">
          {t('pages.logout.loginAgain')}
        </Link>
      </article>
    </section>
  )
}

export default LogoutPage
