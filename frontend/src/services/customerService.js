import apiClient from './apiClient'

/**
 * @param {number} [page=0]
 * @param {number} [size=10]
 * @returns {Promise<{ success: boolean, message: string, data: { content: Array<{ id: number, fullName: string, phone: string, address: string, username: string, email: string, createdAt: string }>, pageIndex: number, pageSize: number, totalElements: number, totalPages: number } }>}
 */
export async function getCustomers(page = 0, size = 10) {
  const { data } = await apiClient.get('/customers', {
    params: { page, size },
  })
  return data
}
