import apiClient from './apiClient'

/**
 * @param {number} [page=0]
 * @param {number} [size=10]
 * @returns {Promise<{ success: boolean, message: string, data: { content: Array<{ id: number, name: string, interestRate: number, minAmount: number, maxAmount: number, durationMonths: number, description: string, createdAt: string }>, pageIndex: number, pageSize: number, totalElements: number, totalPages: number } }>}
 */
export async function getLoanProducts(page = 0, size = 10) {
  const { data } = await apiClient.get('/loan-products', {
    params: { page, size },
  })
  return data
}

/**
 * @param {{ name: string, interestRate: number, minAmount: number, maxAmount: number, durationMonths: number, description: string }} body
 * @returns {Promise<{ success: boolean, message: string, data?: unknown }>}
 */
export async function createLoanProduct(body) {
  const { data } = await apiClient.post('/loan-products', body)
  return data
}

/**
 * @param {number} id
 * @param {{ name: string, interestRate: number, minAmount: number, maxAmount: number, durationMonths: number, description: string }} body
 * @returns {Promise<{ success: boolean, message: string, data?: unknown }>}
 */
export async function updateLoanProduct(id, body) {
  const { data } = await apiClient.put(`/loan-products/${id}`, body)
  return data
}