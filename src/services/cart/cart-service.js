// Servicio para manejar operaciones del carrito de compras
import axios from 'axios';
import { getTokens } from '../../js/auth-storage.js';

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/api';

const client = axios.create({
  baseURL: BASE,
  timeout: 15000,
});

// Interceptor para agregar token automáticamente
client.interceptors.request.use(
  config => {
    const { access_token } = getTokens();
    if (access_token) {
      config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejo de errores
client.interceptors.response.use(
  res => res,
  err => {
    const message = err?.response?.data?.message || err?.message || 'Request failed';
    const e = new Error(message);
    e.status = err?.response?.status;
    e.body = err?.response?.data;
    e.code = err?.response?.data?.code;
    return Promise.reject(e);
  }
);

/**
 * Guardar carrito completo en localStorage
 * @param {Object} cartData - Datos completos del carrito
 */
function saveCartToLocalStorage(cartData) {
  try {
    console.log('[Cart Service] 💾 Guardando carrito completo en localStorage:', cartData);
    localStorage.setItem('fullCart', JSON.stringify(cartData));
    localStorage.setItem('cartItems', JSON.stringify(cartData.items || []));
    localStorage.setItem('cartTotal', cartData.total || 0);
    console.log('[Cart Service] ✅ Carrito guardado en localStorage');
  } catch (error) {
    console.error('[Cart Service] ❌ Error guardando carrito en localStorage:', error);
  }
}

/**
 * Obtener carrito del usuario
 * @param {Object} params - Parámetros de filtrado y paginación
 * @param {number} params.page - Página (1-based, default: 1)
 * @param {number} params.limit - Items por página (default: 10)
 * @param {string} params.name - Filtro por nombre del producto
 * @param {number} params.unitPrice - Filtro por precio unitario exacto
 */
export async function getCart({ page = 1, limit = 10, name = '', unitPrice = null } = {}) {
  try {
    const params = { page, limit };
    if (name) params.name = name;
    if (unitPrice !== null) params.unitPrice = unitPrice;
    
    console.log('[Cart Service] 📊 GET cart with params:', params);
    
    const response = await client.get('/cart', { params });
    console.log('[Cart Service] 📦 Cart response totalQuantity:', response.data?.data?.totalQuantity);
    
    // Guardar en localStorage
    const cartData = response.data.data;
    saveCartToLocalStorage(cartData);
    
    return cartData; // Retorna CartResponse directamente
  } catch (error) {
    console.error('[Cart Service] ❌ Error getting cart:', error);
    throw error;
  }
}

/**
 * Agregar item al carrito (versión simplificada para compatibilidad)
 * @param {string|Object} productIdOrItem - ID del producto o objeto completo del item
 * @param {number} quantity - Cantidad (solo si el primer parámetro es string)
 * @returns {Promise<Object>} CartResponse actualizado
 */
export async function addToCart(productIdOrItem, quantity = 1) {
  try {
    let cartItem;
    
    // Si el primer parámetro es un string, es el productId (modo simple)
    if (typeof productIdOrItem === 'string') {
      // En este caso necesitamos obtener los datos del producto desde el DOM
      const productBox = document.querySelector(`[data-product-id="${productIdOrItem}"]`);
      if (!productBox) {
        throw new Error('No se pudieron encontrar los datos del producto');
      }
      
      cartItem = {
        productId: productIdOrItem,
        name: productBox.dataset.productName,
        unitPrice: parseFloat(productBox.dataset.productPrice),
        quantity: quantity,
        description: productBox.dataset.productBrand || '',
        gallery: JSON.parse(productBox.dataset.productGallery || '[]')
      };
    } else {
      // Si es un objeto, usar directamente
      cartItem = {
        productId: productIdOrItem.productId,
        name: productIdOrItem.name,
        unitPrice: Number(productIdOrItem.unitPrice),
        quantity: productIdOrItem.quantity || 1,
        ...(productIdOrItem.description && { description: productIdOrItem.description }),
        ...(productIdOrItem.gallery && { gallery: productIdOrItem.gallery }),
        ...(productIdOrItem.id && { id: productIdOrItem.id })
      };
    }
    
    console.log('[Cart Service] Adding item to cart:', cartItem);
    
    const response = await client.post('/cart/items', cartItem);
    console.log('[Cart Service] Add item response:', response.data);
    
    // Guardar carrito actualizado en localStorage
    const updatedCart = response.data.data;
    saveCartToLocalStorage(updatedCart);
    
    // Actualizar localStorage con nueva cantidad
    updateLocalCartCount(updatedCart.totalQuantity);
    
    return updatedCart; // Retorna CartResponse actualizado
  } catch (error) {
    console.error('[Cart Service] Error adding item to cart:', error);
    throw error;
  }
}

/**
 * Agregar item al carrito
 * @param {Object} item - Item a agregar
 * @param {string} item.productId - ID del producto (requerido)
 * @param {string} item.name - Nombre del producto (requerido)
 * @param {number} item.unitPrice - Precio unitario (requerido)
 * @param {number} item.quantity - Cantidad (opcional, default: 1)
 * @param {string} item.description - Descripción (opcional)
 * @param {string[]} item.gallery - URLs de imágenes (opcional)
 * @param {string} item.id - ID del item (opcional)
 */
export async function addToCartComplete(item) {
  try {
    const cartItem = {
      productId: item.productId,
      name: item.name,
      unitPrice: Number(item.unitPrice),
      quantity: item.quantity || 1,
      ...(item.description && { description: item.description }),
      ...(item.gallery && { gallery: item.gallery }),
      ...(item.id && { id: item.id })
    };
    
    console.log('[Cart Service] Adding item to cart (complete):', cartItem);
    
    const response = await client.post('/cart/items', cartItem);
    console.log('[Cart Service] Add item response:', response.data);
    
    // Actualizar localStorage con nueva cantidad
    updateLocalCartCount(response.data.data.totalQuantity);
    
    return response.data.data; // Retorna CartResponse actualizado
  } catch (error) {
    console.error('[Cart Service] Error adding item to cart:', error);
    throw error;
  }
}

/**
 * Actualizar cantidad de un item en el carrito
 * @param {string} itemId - ID del item (productId)
 * @param {number} quantity - Nueva cantidad (0 para eliminar)
 */
export async function updateCartItemQuantity(itemId, quantity) {
  try {
    console.log('[Cart Service] Updating item quantity:', itemId, quantity);
    
    const response = await client.patch(`/cart/items/${itemId}`, null, {
      params: { quantity }
    });
    console.log('[Cart Service] Update quantity response:', response.data);
    
    // Actualizar localStorage con nueva cantidad
    updateLocalCartCount(response.data.data.totalQuantity);
    
    return response.data.data;
  } catch (error) {
    console.error('[Cart Service] Error updating item quantity:', error);
    throw error;
  }
}

/**
 * Eliminar item del carrito
 * @param {string} itemId - ID del item (productId) a eliminar
 */
export async function removeFromCart(itemId) {
  try {
    console.log('[Cart Service] Removing item from cart:', itemId);
    
    const response = await client.delete(`/cart/items/${itemId}`);
    console.log('[Cart Service] Remove item response:', response.data);
    
    // Actualizar localStorage con nueva cantidad
    updateLocalCartCount(response.data.data.totalQuantity);
    
    return response.data.data;
  } catch (error) {
    console.error('[Cart Service] Error removing item from cart:', error);
    throw error;
  }
}

/**
 * Obtener cantidad total de items en el carrito desde localStorage
 */
export function getLocalCartCount() {
  try {
    const cartData = localStorage.getItem('cartData');
    if (cartData) {
      const parsed = JSON.parse(cartData);
      return parsed.totalQuantity || 0;
    }
  } catch (error) {
    console.error('[Cart Service] Error reading local cart count:', error);
  }
  return 0;
}

/**
 * Actualizar cantidad en localStorage y badge visual
 */
let updateCartCountTimeout;
export function updateLocalCartCount(totalQuantity) {
  try {
    console.log('[Cart Service] 🎯 Actualizando count local:', totalQuantity);
    
    // Cancelar actualizaciones previas pendientes
    if (updateCartCountTimeout) {
      clearTimeout(updateCartCountTimeout);
    }
    
    // Debounce para evitar actualizaciones múltiples rápidas
    updateCartCountTimeout = setTimeout(() => {
      // Guardar en localStorage
      const cartData = { totalQuantity, updatedAt: Date.now() };
      localStorage.setItem('cartData', JSON.stringify(cartData));
      
      // Actualizar badge visual
      updateCartBadge(totalQuantity);
      
      console.log('[Cart Service] ✅ Local cart count updated:', totalQuantity);
    }, 100); // 100ms de debounce
    
  } catch (error) {
    console.error('[Cart Service] ❌ Error updating local cart count:', error);
  }
}

/**
 * Actualizar badge visual del carrito en el header
 */
export function updateCartBadge(count) {
  const badge = document.getElementById('cart-count-badge');
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline';
      badge.setAttribute('aria-hidden', 'false');
    } else {
      badge.style.display = 'none';
      badge.setAttribute('aria-hidden', 'true');
    }
  }
}

/**
 * Inicializar badge del carrito al cargar la página
 */
export function initializeCartBadge() {
  const localCount = getLocalCartCount();
  console.log('[Cart Service] 🔢 Inicializando badge - count local:', localCount);
  updateCartBadge(localCount);
  
  // Si hay token, sincronizar con servidor
  const { access_token } = getTokens();
  if (access_token) {
    console.log('[Cart Service] 🔄 Sincronizando con servidor...');
    // CORREGIDO: Llamar sin límite para obtener el totalQuantity correcto del carrito completo
    getCart()
      .then(cartData => {
        console.log('[Cart Service] ✅ Sincronización exitosa - totalQuantity:', cartData.totalQuantity);
        updateLocalCartCount(cartData.totalQuantity);
      })
      .catch(error => {
        console.warn('[Cart Service] ⚠️ Could not sync cart count:', error.message);
      });
  } else {
    console.log('[Cart Service] 🚫 No hay token, usando count local');
  }
}

/**
 * Limpiar datos del carrito (para logout)
 */
export function clearLocalCart() {
  localStorage.removeItem('cartData');
  updateCartBadge(0);
  console.log('[Cart Service] Local cart data cleared');
}
