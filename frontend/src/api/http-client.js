const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export function getBaseUrl() {
  return BASE_URL
}

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem('lms_token') || window.sessionStorage.getItem('lms_token') || null
}

/**
 * Same as `request` but sends `Authorization: Bearer` when a token exists (after login).
 */
export async function requestAuth(path, options = {}) {
  const token = getStoredToken()
  const headers = { ...options.headers }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return request(path, { ...options, headers })
}

/**
 * @param {string} path - Path beginning with `/`, e.g. `/api/auth/login`
 * @param {{ method?: string, body?: unknown, headers?: Record<string, string> }} [options]
 * @returns {Promise<{ response: Response, parsed: object | null, parseFailed: boolean }>}
 */
export async function request(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`

  const init = {
    method,
    headers: { ...headers },
  }

  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json'
    init.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const response = await fetch(url, init)
  const text = await response.text()

  let parsed = null
  if (text) {
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = null
    }
  }

  return {
    response,
    parsed,
    parseFailed: Boolean(text) && parsed === null,
  }
}
