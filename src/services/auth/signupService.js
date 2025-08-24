import axios from 'axios';

// Signup service used to call backend or fallback to localStorage in dev/offline.
// Exports: signupApi(payload) -> performs network request when VITE_API_BASE is set
//          signupLocal(payload) -> fallback that stores users in localStorage
//          client -> configured axios instance

// Use Vite env when provided; otherwise default to the local API URL you indicated
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

const client = axios.create({
  baseURL: BASE || undefined,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Normalize axios errors to a simple Error with status and body
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

export async function signupLocal(payload) {
  // Minimal validation
  if (!payload || !payload.email) {
    const e = new Error('Missing payload or email');
    e.status = 400;
    throw e;
  }

  const users = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  if (users.find(u => u.email === payload.email)) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const newUser = {
    id: Date.now().toString(),
    name: payload.name || '',
    email: payload.email,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  return newUser;
}

export async function signupApi(payload) {
  // If no BASE configured, use local fallback so development works offline.
  if (!BASE) return signupLocal(payload);

  // If payload is FormData, send as multipart/form-data (file upload)
  if (typeof FormData !== 'undefined' && payload instanceof FormData) {
    const res = await client.post('/auth/signup', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }

  // Otherwise send JSON
  const res = await client.post('/auth/signup', payload);
  return res.data;
}

export default { signupApi, signupLocal, client };
