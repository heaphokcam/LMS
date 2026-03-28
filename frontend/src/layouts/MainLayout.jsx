import { useState } from 'react'
import { Link, Outlet, useLocation } from '@tanstack/react-router'
import Logo from '../components/common/Logo'
import { useAppContext } from '../contexts/AppContext'
import { LOGOUT_ITEM, NAV_SECTIONS } from '../config/navConfig'
import { logoutIcon, navItemIcons } from './navItemIcons'

const navSections = NAV_SECTIONS.map((section) => ({
  ...section,
  items: section.items.map((item) => ({
    ...item,
    icon: navItemIcons[item.to],
  })),
}))

const logoutItem = {
  ...LOGOUT_ITEM,
  icon: logoutIcon,
}

function getAllVisibleItems(role) {
  const items = []
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.roles.includes(role)) items.push(item)
    }
  }
  return items
}

function SidebarNav({ role, pathname, collapsed, t }) {
  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-hidden">
      {navSections.map((section) => {
        const visible = section.items.filter((item) => item.roles.includes(role))
        if (visible.length === 0) return null
        return (
          <div key={section.key} className="mb-1">
            {!collapsed && (
              <p className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 select-none">
                {t(section.labelKey) ?? section.key}
              </p>
            )}
            {collapsed && <div className="my-2 mx-3 border-t border-slate-200 dark:border-slate-700" />}
            {visible.map((item) => {
              const isActive = pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  title={collapsed ? t(item.labelKey) : undefined}
                  className={`group mx-2 mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-l-[3px] border-blue-600 dark:border-blue-400 pl-[9px]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-l-[3px] border-transparent pl-[9px]'
                  } ${collapsed ? 'justify-center px-0 pl-0 border-l-0' : ''}`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
                </Link>
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}

function MainLayout() {
  const location = useLocation()
  const { role, t, theme, toggleTheme, language, setLanguage } = useAppContext()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const allItems = getAllVisibleItems(role)
  const activeItem =
    allItems.find((item) => location.pathname.startsWith(item.to)) ??
    allItems.find((item) => item.to === '/dashboard')

  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen app-layout-bg">
      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col sidebar-panel transform transition-transform duration-250 ease-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-600 p-1.5">
              <Logo className="h-7 w-7 brightness-0 invert" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('common.appName')}</span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <SidebarNav role={role} pathname={location.pathname} collapsed={false} t={t} />
        {/* Logout + footer controls in mobile drawer */}
        <div className="mt-auto border-t border-slate-200 dark:border-slate-700 px-2 py-3">
          {logoutItem.roles.includes(role) && (
            <Link
              to={logoutItem.to}
              onClick={() => setDrawerOpen(false)}
              className="mx-0 mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition border-l-[3px] border-transparent pl-[9px]"
            >
              <span className="shrink-0 text-slate-400 dark:text-slate-500">{logoutItem.icon}</span>
              <span>{t(logoutItem.labelKey)}</span>
            </Link>
          )}
          <div className="flex items-center gap-2 px-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t('common.theme')}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M18.5 12.7A7 7 0 1 1 11.3 5.5a6 6 0 1 0 7.2 7.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5V5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              )}
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 text-xs font-medium text-slate-600 dark:text-slate-400 outline-none"
            >
              <option value="en">EN</option>
              <option value="kh">KH</option>
            </select>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen w-full">
        {/* Desktop sidebar */}
        <aside className={`sidebar-panel hidden lg:flex flex-col shrink-0 transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-[250px]'}`}>
          <div className={`flex items-center px-4 py-4 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="rounded-lg bg-blue-600 p-1.5 shrink-0">
              <Logo className="h-7 w-7 brightness-0 invert" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{t('common.appName')}</p>
                <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{t('common.appTagline')}</p>
              </div>
            )}
          </div>

          <SidebarNav role={role} pathname={location.pathname} collapsed={collapsed} t={t} />

          {/* Sidebar footer: logout + controls */}
          <div className="mt-auto border-t border-slate-200 dark:border-slate-700 px-2 py-3">
            {logoutItem.roles.includes(role) && (
              <Link
                to={logoutItem.to}
                title={collapsed ? t(logoutItem.labelKey) : undefined}
                className={`mx-0 mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition ${
                  collapsed ? 'justify-center px-0' : 'border-l-[3px] border-transparent pl-[9px]'
                }`}
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">{logoutItem.icon}</span>
                {!collapsed && <span>{t(logoutItem.labelKey)}</span>}
              </Link>
            )}
            <div className={`flex items-center gap-2 ${collapsed ? 'flex-col px-0 items-center' : 'px-3'}`}>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={t('common.theme')}
              >
                {isDark ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M18.5 12.7A7 7 0 1 1 11.3 5.5a6 6 0 1 0 7.2 7.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2.5V5M12 19v2.5M21.5 12H19M5 12H2.5M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8M18.7 18.7l-1.8-1.8M7.1 7.1 5.3 5.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                )}
              </button>
              {!collapsed && (
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2 text-xs font-medium text-slate-600 dark:text-slate-400 outline-none"
                >
                  <option value="en">EN</option>
                  <option value="kh">KH</option>
                </select>
              )}
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={collapsed ? 'Expand' : 'Collapse'}
              >
                <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Slim top header */}
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 sm:px-6">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition lg:hidden"
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">
                {activeItem ? t(activeItem.labelKey) : t('nav.dashboard')}
              </h1>
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t(`roles.${role}`)}
              </span>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
