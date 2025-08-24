import axios from 'axios';

// signinService mirrors the project's service pattern: use VITE_API_BASE when present
// and fall back to a simple localStorage mock for development/offline.
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

const client = axios.create({ baseURL: BASE || undefined, timeout: 15000, headers: { 'Content-Type': 'application/json' } });

client.interceptors.response.use(
  res => res,
  err => {
    const message = err?.response?.data?.message || err?.message || 'Request failed';
    const e = new Error(message);
    e.status = err?.response?.status;
    e.body = err?.response?.data;
    return Promise.reject(e);
  }
);

const LOCAL_USERS_KEY = 'users_db';

export async function signinLocal({ email, password } = {}) {
  if (!email) {
    const e = new Error('Missing email'); e.status = 400; throw e;
  }
  const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  const user = users.find(u => u.email === email);
  if (!user) {
    const e = new Error('User not found'); e.status = 404; throw e;
  }
  if (user.pass !== password) {
    const e = new Error('Incorrect password'); e.status = 401; throw e;
  }
  // Simulate token response
  return { data: { tokens: { access_token: 'local-access-' + Date.now(), refresh_token: 'local-refresh-' + Date.now() }, user } };
}

export async function signinApi(payload) {
  if (!BASE) return signinLocal(payload);
  const res = await client.post('/auth/signin', payload);
  return res.data;
}

export default { signinApi, signinLocal, client };
