import { useAppContext } from '../../contexts/AppContext'

function LanguageToggle() {
  const { language, setLanguage, t } = useAppContext()

  return (
    <label className="flex w-full min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span>{t('common.language')}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="en">English</option>
        <option value="kh">ខ្មែរ</option>
      </select>
    </label>
  )
}

export default LanguageToggle
