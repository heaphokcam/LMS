import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createLoanApplication,
  deleteLoanApplication,
  disburseLoanApplication,
  getLoanApplication,
  getLoanApplications,
  updateLoanApplication,
} from '../services/loanApplicationService'

export const LOAN_APPLICATIONS_KEY = ['loan-applications']

export function useLoanApplications(page = 0, size = 10) {
  return useQuery({
    queryKey: [...LOAN_APPLICATIONS_KEY, page, size],
    queryFn: () => getLoanApplications(page, size),
  })
}

export function useLoanApplication(id) {
  return useQuery({
    queryKey: [...LOAN_APPLICATIONS_KEY, 'detail', id],
    queryFn: () => getLoanApplication(id),
    enabled: id != null && id !== '',
  })
}

export function useCreateLoanApplication(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body) => createLoanApplication(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_APPLICATIONS_KEY })
      options.onSuccess?.()
    },
    onError: options.onError,
  })
}

export function useUpdateLoanApplication(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => updateLoanApplication(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_APPLICATIONS_KEY })
      options.onSuccess?.()
    },
    onError: options.onError,
  })
}

export function useDisburseLoanApplication(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => disburseLoanApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_APPLICATIONS_KEY })
      options.onSuccess?.()
    },
    onError: options.onError,
  })
}

export function useDeleteLoanApplication(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteLoanApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_APPLICATIONS_KEY })
      options.onSuccess?.()
    },
    onError: options.onError,
  })
}
