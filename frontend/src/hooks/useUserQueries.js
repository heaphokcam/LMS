import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  patchUserStatus,
} from '../services/userService'

const USERS_KEY = ['users']

export function useUsers(page = 0, size = 100) {
  return useQuery({
    queryKey: [...USERS_KEY, page, size],
    queryFn: () => getUsers(page, size),
  })
}

export function useUser(id) {
  return useQuery({
    queryKey: [...USERS_KEY, id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...userData }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}

export function usePatchUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }) => patchUserStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY })
    },
  })
}
