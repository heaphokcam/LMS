import { useAppContext } from '../../contexts/AppContext'

function RoleDisplay() {
  const { role, t } = useAppContext()

  return (
    <div className="flex w-full min-w-0 flex-col gap-1 text-xs font-semibold text-slate-500">
      <span>{t('common.role')}</span>
      <div
        className="flex h-10 w-full items-center rounded-md border border-slate-300 bg-white/80 px-3 text-sm font-semibold text-slate-700"
        role="status"
        aria-label={t(`roles.${role}`)}
      >
        {t(`roles.${role}`)}
      </div>
    </div>
  )
}

export default RoleDisplay
