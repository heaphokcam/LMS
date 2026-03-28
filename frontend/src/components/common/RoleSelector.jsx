import { useAppContext } from '../../contexts/AppContext'

function RoleSelector() {
  const { role, roles, setRole, t } = useAppContext()

  if (!roles?.length || roles.length <= 1) {
    return (
      <div className="flex w-full min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>{t('common.role')}</span>
        <div className="flex h-10 items-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          {t(`roles.${role}`)}
        </div>
      </div>
    )
  }

  return (
    <label className="flex w-full min-w-0 flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span>{t('common.role')}</span>
      <select
        value={role}
        onChange={(event) => setRole(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        {roles.map((roleKey) => (
          <option key={roleKey} value={roleKey}>
            {t(`roles.${roleKey}`)}
          </option>
        ))}
      </select>
    </label>
  )
}

export default RoleSelector
