import apiClient from './apiClient'

/**
 * @param {number} [page=0]
 * @param {number} [size=10]
 */
export async function getLoanApplications(page = 0, size = 10) {
  const { data } = await apiClient.get('/loan-applications', {
    params: { page, size },
  })
  return data
}

/**
 * @param {number} id
 */
export async function getLoanApplication(id) {
  const { data } = await apiClient.get(`/loan-applications/${id}`)
  return data
}

/**
 * @param {{ customerId: number, loanProductId: number, amount: number, durationMonths: number, status?: string }} body
 */
export async function createLoanApplication(body) {
  const { data } = await apiClient.post('/loan-applications', body)
  return data
}

/**
 * @param {number} id
 * @param {{ customerId: number, loanProductId: number, amount: number, durationMonths: number, status?: string }} body
 */
export async function updateLoanApplication(id, body) {
  const { data } = await apiClient.put(`/loan-applications/${id}`, body)
  return data
}

/**
 * @param {number} id
 */
export async function disburseLoanApplication(id) {
  const { data } = await apiClient.patch(`/loan-applications/${id}/disburse`)
  return data
}

/**
 * @param {number} id
 */
export async function deleteLoanApplication(id) {
  await apiClient.delete(`/loan-applications/${id}`)
}