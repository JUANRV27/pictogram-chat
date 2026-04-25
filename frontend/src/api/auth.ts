export async function register(username: string, password: string, email: string) {
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  function apiUrl(path: string) {
    if (!path.startsWith('/')) path = '/' + path
    return API_BASE ? `${API_BASE}${path}` : path
  }

  const res = await fetch(apiUrl('/api/v1/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })
  if (!res.ok) throw new Error('Registration failed')
  return res.json()
}

export async function login(username: string, password: string) {
  const body = new URLSearchParams()
  body.append('username', username)
  body.append('password', password)

  const res = await fetch('/api/v1/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || 'Login failed')
  }
  return res.json()
}

export async function me(token: string) {
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
  function apiUrl(path: string) {
    if (!path.startsWith('/')) path = '/' + path
    return API_BASE ? `${API_BASE}${path}` : path
  }

  const res = await fetch(apiUrl('/api/v1/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Cannot get user info')
  return res.json()
}
