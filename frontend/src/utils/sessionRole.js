import { KNOWN_ROLES } from '../config/navConfig'

const ROLE_ORDER = ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN']

/** Same priority as LoginPage.pickWorkspaceRole — highest role in ROLE_ORDER wins. */
export function readStoredWorkspaceRole() {
  if (typeof window === 'undefined') return 'CUSTOMER'
  try {
    const userJson = window.localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      const roles = Array.isArray(user.roles)
        ? user.roles
        : user.role
          ? [user.role]
          : ['CUSTOMER']
      const found = ROLE_ORDER.find((r) => roles.includes(r))
      return found ?? roles[0] ?? 'CUSTOMER'
    }
    const stored =
      window.localStorage.getItem('lms_role') || window.sessionStorage.getItem('lms_role')
    if (stored && KNOWN_ROLES.includes(stored)) return stored
  } catch {
    // ignore
  }
  return 'CUSTOMER'
}

export function readStoredToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem('token')
}
