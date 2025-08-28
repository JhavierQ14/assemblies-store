// Servicio para obtener productos desde el backend, usando la baseURL como los servicios de auth
import axios from 'axios';
import { getTokens } from '../../js/auth-storage.js';
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

const client = axios.create({
  baseURL: BASE,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
});

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

export async function fetchProducts({ page = 1, limit = 10, name = '', minPrice = '', maxPrice = '', subCategoryId = '' } = {}) {
  console.log('[fetchProducts] Parámetros recibidos:', { page, limit, name, minPrice, maxPrice, subCategoryId });
  
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (name) params.name = name;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (subCategoryId) params.subCategoryId = subCategoryId;
  
  console.log('[fetchProducts] Parámetros que se enviarán:', params);
  const { access_token } = getTokens();
  console.log('[DEBUG] access_token:', access_token);
  const headers = {};
  if (access_token) {
    headers['Authorization'] = `Bearer ${access_token}`;
  }
  // Mostrar la petición como curl antes de enviarla
  const query = Object.keys(params).length > 0 ? '?' + Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&') : '';
  let curl = `curl -X GET \"${BASE}/products${query}\" \\\n  -H \"Accept: application/json\" \\\n  -H \"Content-Type: application/json\"`;
  if (access_token) {
    curl += ` \\\n  -H \"Authorization: Bearer ${access_token}\"`;
  }
  curl += ' --insecure';
  console.log('[CURL]', curl);
  const res = await client.get('/products', {
    params,
    headers,
    withCredentials: true
  });
  console.log('Respuesta productos:', res);
  return res.data.data;
}

