/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { KNOWN_ROLES } from '../config/navConfig'
import { translations } from '../i18n/translations'

const LANG_OPTIONS = ['en', 'kh']
const THEME_OPTIONS = ['light', 'dark']

const AppContext = createContext(null)

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem('lms_theme')
  return stored === 'dark' ? 'dark' : 'light'
}

function getInitialRolesAndRole() {
  if (typeof window === 'undefined') {
    return { roles: ['CUSTOMER'], role: 'CUSTOMER' }
  }

  try {
    const userJson = window.localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      const roles = Array.isArray(user.roles)
        ? user.roles
        : user.role
        ? [user.role]
        : ['CUSTOMER']
      const role = user.role && roles.includes(user.role) ? user.role : roles[0] || 'CUSTOMER'
      return { roles, role }
    }

    const storedRole =
      window.localStorage.getItem('lms_role') || window.sessionStorage.getItem('lms_role')
    if (storedRole && KNOWN_ROLES.includes(storedRole)) {
      return { roles: [storedRole], role: storedRole }
    }

    return { roles: ['CUSTOMER'], role: 'CUSTOMER' }
  } catch {
    return { roles: ['CUSTOMER'], role: 'CUSTOMER' }
  }
}

export function AppProvider({ children }) {
  const initial = getInitialRolesAndRole()
  const [language, setLanguage] = useState('en')
  const [roles, setRolesState] = useState(initial.roles)
  const [role, setRole] = useState(initial.role)
  const [theme, setTheme] = useState(getInitialTheme)

  const setRoles = useCallback((newRoles) => {
    const arr = Array.isArray(newRoles) ? newRoles : (newRoles ? [newRoles] : ['CUSTOMER'])
    setRolesState(arr)
    setRole((current) => (arr.includes(current) ? current : arr[0] || 'CUSTOMER'))
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'kh' ? 'km' : 'en'
  }, [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('lms_theme', theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const userJson = window.localStorage.getItem('user')
      if (!userJson) return
      const user = JSON.parse(userJson)
      if (Array.isArray(user.roles) && user.roles.includes(role)) {
        window.localStorage.setItem('user', JSON.stringify({ ...user, role }))
      }
    } catch {
      // ignore
    }
  }, [role])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const t = useCallback(
    (path) => {
      const readPath = (source) =>
        path.split('.').reduce((value, key) => {
          if (value && typeof value === 'object' && key in value) {
            return value[key]
          }

          return undefined
        }, source)

      return readPath(translations[language]) ?? readPath(translations.en) ?? path
    },
    [language],
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      role,
      setRole,
      roles,
      setRoles,
      languages: LANG_OPTIONS,
      theme,
      setTheme,
      toggleTheme,
      themes: THEME_OPTIONS,
      t,
    }),
    [language, role, roles, setRoles, theme, toggleTheme, t],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
