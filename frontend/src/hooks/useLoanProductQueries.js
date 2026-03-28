import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLoanProduct, getLoanProducts, updateLoanProduct } from '../services/loanProductService'

const LOAN_PRODUCTS_KEY = ['loan-products']

export function useLoanProducts(page = 0, size = 10) {
  return useQuery({
    queryKey: [...LOAN_PRODUCTS_KEY, page, size],
    queryFn: () => getLoanProducts(page, size),
  })
}

/** @param {{ onSuccess?: () => void, onError?: (err: unknown) => void }} options */
export function useCreateLoanProduct(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body) => createLoanProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_PRODUCTS_KEY })
      options.onSuccess?.()
    },
    onError: options.onError,
  })
}

/** @param {{ onSuccess?: () => void, onError?: (err: unknown) => void }} options */
export function useUpdateLoanProduct(options = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => updateLoanProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOAN_PRODUCTS_KEY })
      options.onSuccess?.()
    },
    onError: options.onError,
  })
}
