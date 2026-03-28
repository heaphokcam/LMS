/**
 * Single source of truth for route → allowed roles and sidebar structure.
 * Icons are attached in MainLayout via navItemIcons.
 */

export const KNOWN_ROLES = ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN']

export const NAV_SECTIONS = [
  {
    key: 'overview',
    labelKey: 'nav.sections.overview',
    items: [
      {
        to: '/dashboard',
        labelKey: 'nav.dashboard',
        roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
      },
    ],
  },
  {
    key: 'lending',
    labelKey: 'nav.sections.lending',
    items: [
      {
        to: '/loan-products',
        labelKey: 'nav.loanProducts',
        roles: ['OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/apply-loan',
        labelKey: 'nav.applyLoan',
        roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/application-history',
        labelKey: 'nav.history',
        roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/repayment-calculator',
        labelKey: 'nav.calculator',
        roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
      },
    ],
  },
  {
    key: 'operations',
    labelKey: 'nav.sections.operations',
    items: [
      {
        to: '/officer-review',
        labelKey: 'nav.reviewList',
        roles: ['OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/customers',
        labelKey: 'nav.customers',
        roles: ['OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/status-tracking',
        labelKey: 'nav.statusTracking',
        roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/approval-workflow',
        labelKey: 'nav.workflow',
        roles: ['OFFICER', 'MANAGER', 'ADMIN'],
      },
      {
        to: '/disbursement',
        labelKey: 'nav.disbursement',
        roles: ['MANAGER', 'ADMIN'],
      },
      {
        to: '/overdue-simulation',
        labelKey: 'nav.overdue',
        roles: ['OFFICER', 'MANAGER', 'ADMIN'],
      },
    ],
  },
  {
    key: 'admin',
    labelKey: 'nav.sections.admin',
    items: [
      {
        to: '/reporting',
        labelKey: 'nav.reporting',
        roles: ['MANAGER', 'ADMIN'],
      },
      {
        to: '/users-roles',
        labelKey: 'nav.usersRoles',
        roles: ['ADMIN'],
      },
      {
        to: '/team',
        labelKey: 'nav.team',
        roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
      },
    ],
  },
]

export const LOGOUT_ITEM = {
  to: '/logout',
  labelKey: 'nav.logout',
  roles: ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN'],
}

/** Ordered nav label keys visible to a role (matches sidebar order). */
export function getNavLabelKeysForRole(role) {
  const keys = []
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.roles.includes(role)) keys.push(item.labelKey)
    }
  }
  return keys
}

/**
 * Longest-prefix match of pathname to a nav item; returns allowed roles or null.
 */
export function getRolesAllowedForPath(pathname) {
  if (pathname === LOGOUT_ITEM.to || pathname.startsWith(`${LOGOUT_ITEM.to}/`)) {
    return LOGOUT_ITEM.roles
  }
  let best = null
  let bestLen = -1
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      const { to } = item
      if (pathname === to || pathname.startsWith(`${to}/`)) {
        if (to.length > bestLen) {
          bestLen = to.length
          best = item.roles
        }
      }
    }
  }
  return best
}
