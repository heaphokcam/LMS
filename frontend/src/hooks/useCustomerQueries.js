import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../services/customerService'

const CUSTOMERS_KEY = ['customers']

export function useCustomers(page = 0, size = 10, queryOptions = {}) {
  return useQuery({
    queryKey: [...CUSTOMERS_KEY, page, size],
    queryFn: () => getCustomers(page, size),
    ...queryOptions,
  })
}
