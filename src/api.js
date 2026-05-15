const API = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'

function authHeaders() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {}
}

async function request(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const authApi = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  topup: (amount) => request('/auth/topup', { method: 'POST', body: JSON.stringify({ amount }) }),
}

export const gpuApi = {
  list: () => request('/gpus'),
  get: (id) => request(`/gpus/${id}`),
}

export const orderApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/orders${qs ? `?${qs}` : ''}`)
  },
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id) => request(`/orders/${id}/cancel`, { method: 'PATCH' }),
}

export const apiKeyApi = {
  list: () => request('/apikeys'),
  create: (name) => request('/apikeys', { method: 'POST', body: JSON.stringify({ name }) }),
  revoke: (id) => request(`/apikeys/${id}`, { method: 'DELETE' }),
}

export const adminApi = {
  users: () => request('/admin/users'),
  orders: () => request('/admin/orders'),
  gpus: () => request('/admin/gpus'),
  createGpu: (body) => request('/admin/gpus', { method: 'POST', body: JSON.stringify(body) }),
  updateGpu: (id, body) => request(`/admin/gpus/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteGpu: (id) => request(`/admin/gpus/${id}`, { method: 'DELETE' }),
  seed: () => request('/admin/seed', { method: 'POST' }),
}
