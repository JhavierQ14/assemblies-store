// Versión simplificada del servicio de categorías
// Solo lee desde localStorage - no hace peticiones HTTP

const CATEGORIES_CACHE_KEY = 'appCategories';

// Función para obtener categorías desde localStorage
export function getCategoriesFromStorage() {
  try {
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      const categories = JSON.parse(cached);
      console.log('[getCategoriesFromStorage] Categorías encontradas:', categories.length);
      return categories;
    }
  } catch (error) {
    console.error('[getCategoriesFromStorage] Error al leer localStorage:', error);
  }
  
  console.warn('[getCategoriesFromStorage] No hay categorías en localStorage');
  return [];
}

// Función para verificar si hay categorías disponibles
export function areCategoriesAvailable() {
  const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
  return cached !== null;
}

// Función para escuchar cuando las categorías estén listas
export function onCategoriesReady(callback) {
  // Si ya están disponibles, ejecutar callback inmediatamente
  if (areCategoriesAvailable()) {
    callback(getCategoriesFromStorage());
    return;
  }
  
  // Si no están disponibles, escuchar el evento
  window.addEventListener('categoriesLoaded', (event) => {
    callback(event.detail.categories);
  }, { once: true });
}
