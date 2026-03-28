import { useAppContext } from '../../contexts/AppContext'

function ThemeToggle() {
  const { theme, toggleTheme, t } = useAppContext()
  const isDark = theme === 'dark'

  return (
    <label className="flex w-full min-w-0 flex-col gap-1 text-xs font-semibold text-slate-500">
      <span>{t('common.theme')}</span>
      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
        aria-label={t('common.theme')}
        title={t('common.theme')}
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M18.5 12.7A7 7 0 1 1 11.3 5.5a6 6 0 1 0 7.2 7.2Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2.5V5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
        <span>{isDark ? t('common.darkMode') : t('common.lightMode')}</span>
      </button>
    </label>
  )
}

export default ThemeToggle
