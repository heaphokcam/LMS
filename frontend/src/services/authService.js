import apiClient from './apiClient'

/** Matches `V2__insert_roles_data.sql` insert order (BIGSERIAL 1..4). */
export const REGISTER_ROLE_IDS = {
  CUSTOMER: 1,
  OFFICER: 2,
  MANAGER: 3,
  ADMIN: 4,
}

export const login = async ({ username, password }) => {
  const { data } = await apiClient.post('/auth/login', { username, password })
  return data
}

export const register = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload)
  return { parsed: data, parseFailed: false }
}
