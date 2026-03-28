import apiClient from './apiClient'

export async function getUsers(page = 0, size = 100) {
  const { data } = await apiClient.get('/users', { params: { page, size } })
  return data
}

export async function getUserById(id) {
  const { data } = await apiClient.get(`/users/${id}`)
  return data
}

export async function createUser(userData) {
  const { data } = await apiClient.post('/users', userData)
  return data
}

export async function updateUser(id, userData) {
  const { data } = await apiClient.put(`/users/${id}`, userData)
  return data
}

export async function deleteUser(id) {
  const { data } = await apiClient.delete(`/users/${id}`)
  return data
}

export async function patchUserStatus(id, active) {
  const { data } = await apiClient.patch(`/users/${id}/status`, { active })
  return data
}
