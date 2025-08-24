import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

const client = axios.create({ baseURL: BASE || undefined, timeout: 15000 });

client.interceptors.response.use(res => res, err => {
  const message = err?.response?.data?.message || err?.message || 'Request failed';
  const e = new Error(message);
  e.status = err?.response?.status;
  e.body = err?.response?.data;
  return Promise.reject(e);
});

// For dev/offline: store pending OTPs in localStorage under 'pending_otps'
const PENDING_KEY = 'pending_otps';

export async function sendOtp(email) {
  if (!BASE) {
    const store = JSON.parse(localStorage.getItem(PENDING_KEY) || '{}');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    store[email] = { code, createdAt: new Date().toISOString() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(store));
    return { status: 'success', code }; // return code for testing in dev
  }
  const res = await client.post('/auth/send-otp', { email });
  return res.data;
}

export async function verifyOtp(email, code) {
  if (!BASE) {
    const store = JSON.parse(localStorage.getItem(PENDING_KEY) || '{}');
    if (store[email] && store[email].code === code) {
      delete store[email];
      localStorage.setItem(PENDING_KEY, JSON.stringify(store));
      return { status: 'success' };
    }
    const e = new Error('Invalid OTP');
    e.status = 400;
    throw e;
  }
  // backend expects field name `otpCode` according to API contract
  const res = await client.post('/auth/verify-otp', { email, otpCode: code });
  return res.data;
}

export async function resendOtp(email) {
  if (!BASE) {
    // emulate resend by regenerating code
    const store = JSON.parse(localStorage.getItem(PENDING_KEY) || '{}');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    store[email] = { code, createdAt: new Date().toISOString() };
    localStorage.setItem(PENDING_KEY, JSON.stringify(store));
    return { status: 'success', code };
  }
  const res = await client.post('/auth/resend-otp', { email });
  return res.data;
}

export default { sendOtp, verifyOtp, resendOtp, client };
