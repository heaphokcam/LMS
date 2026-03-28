import apiClient from './apiClient'

export async function getRoles(page = 0, size = 50) {
  const { data } = await apiClient.get('/roles', { params: { page, size } })
  return data
}
