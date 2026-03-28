import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'

const ROLE_ORDER = ['CUSTOMER', 'OFFICER', 'MANAGER', 'ADMIN']

function pickWorkspaceRole(apiRoles) {
  if (!apiRoles?.length) return 'CUSTOMER'
  const found = ROLE_ORDER.find((r) => apiRoles.includes(r))
  return found ?? apiRoles[0] ?? 'CUSTOMER'
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const { token, userId, username, email, roles, expiresAt, customerId } = response.data
      const rolesArray = Array.isArray(roles) ? roles : (response.data.role ? [response.data.role] : ['CUSTOMER'])
      const workspaceRole = pickWorkspaceRole(rolesArray)
      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId,
          username,
          email,
          roles: rolesArray,
          role: workspaceRole,
          customerId: customerId ?? null,
          expiresAt,
        }),
      )
    },
  })
}
