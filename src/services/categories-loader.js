// Servicio para cargar categorías una sola vez en el index.html principal
// y guardarlas en localStorage para uso en toda la aplicación

import { fetchCategories } from './category/category-service.js';

const CATEGORIES_CACHE_KEY = 'appCategories';
const CATEGORIES_CACHE_EXPIRY_KEY = 'appCategoriesExpiry';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

// Función principal para cargar y cachear categorías
export async function loadAndCacheCategories() {
  try {
    // Verificar si ya hay categorías en caché y son válidas
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    const expiry = localStorage.getItem(CATEGORIES_CACHE_EXPIRY_KEY);
    const now = Date.now();
    
    if (cached && expiry && now < parseInt(expiry, 10)) {
      console.log('[Categories] Usando categorías desde caché');
      return JSON.parse(cached);
    }
    
    // No hay caché válido, hacer petición al servidor
    console.log('[Categories] Obteniendo categorías del servidor...');
    const categories = await fetchCategories();
    
    console.log('[Categories] Datos recibidos:', categories);
    console.log('[Categories] Tipo de datos:', typeof categories);
    console.log('[Categories] Es array:', Array.isArray(categories));
    console.log('[Categories] Longitud:', categories?.length);
    
    if (categories && Array.isArray(categories) && categories.length > 0) {
      console.log('[Categories] Verificando estructura de cada categoría...');
      categories.forEach((cat, index) => {
        console.log(`[Categories] Categoría ${index}:`, cat);
        console.log(`[Categories] - ID: ${cat.id}, Name: ${cat.name}`);
      });
      
      // Verificar que las categorías tengan la estructura correcta
      const validCategories = categories.filter(cat => cat.id && cat.name);
      console.log('[Categories] Categorías válidas después del filtro:', validCategories.length);
      
      if (validCategories.length > 0) {
        // Guardar en localStorage
        localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(validCategories));
        localStorage.setItem(CATEGORIES_CACHE_EXPIRY_KEY, (now + CACHE_DURATION).toString());
        
        console.log('[Categories] Categorías válidas cargadas y guardadas en caché:', validCategories.length);
        
        // Disparar evento personalizado para notificar que las categorías están listas
        window.dispatchEvent(new CustomEvent('categoriesLoaded', { 
          detail: { categories: validCategories, fromCache: false } 
        }));
        
        return validCategories;
      } else {
        console.warn('[Categories] No hay categorías válidas (sin id o name)');
        return [];
      }
    } else {
      console.warn('[Categories] No se obtuvieron categorías del servidor o formato inválido');
      return [];
    }
    
  } catch (error) {
    console.error('[Categories] Error al cargar categorías:', error);
    return [];
  }
}

// Función para obtener categorías desde localStorage (sin hacer peticiones)
export function getCategoriesFromCache() {
  try {
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('[Categories] Error al leer caché:', error);
  }
  return [];
}

// Función para limpiar caché (útil para desarrollo/testing)
export function clearCategoriesCache() {
  localStorage.removeItem(CATEGORIES_CACHE_KEY);
  localStorage.removeItem(CATEGORIES_CACHE_EXPIRY_KEY);
  console.log('[Categories] Caché limpiado');
}

// Exponer función globalmente para debugging
window.clearCategoriesCache = clearCategoriesCache;

// Auto-ejecutar si se importa directamente en el index
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndCacheCategories);
  } else {
    loadAndCacheCategories();
  }
}
