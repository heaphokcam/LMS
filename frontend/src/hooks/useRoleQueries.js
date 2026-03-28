import { useQuery } from '@tanstack/react-query'
import { getRoles } from '../services/roleService'

export const ROLES_KEY = ['roles']

export function useRoles(page = 0, size = 50) {
  return useQuery({
    queryKey: [...ROLES_KEY, page, size],
    queryFn: () => getRoles(page, size),
  })
}
