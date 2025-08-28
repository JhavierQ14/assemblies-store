import axios from 'axios';
import { getTokens } from '../../js/auth-storage.js';

const API_BASE_URL = 'http://localhost:8081/api';

// Cliente axios configurado para orders
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
client.interceptors.request.use(
  (config) => {
    const token = getTokens().access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('[Order Service] Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('[Order Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
client.interceptors.response.use(
  (response) => {
    console.log('[Order Service] Response:', response.data);
    return response;
  },
  (error) => {
    console.error('[Order Service] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Crear una nueva orden
 * @param {Object} orderData - Datos de la orden
 * @param {Array} orderData.products - Array de productos [{productId, name, unitPrice, quantity}]
 * @param {Object} orderData.shippingAddress - Dirección de envío {street, city, country, postalCode}
 * @param {string} orderData.paymentMethod - Método de pago (ej: "CREDIT_CARD", "DEBIT_CARD")
 * @returns {Promise<Object>} OrderPaymentResponse con order y paymentUrl
 */
export async function createOrder(orderData) {
  try {
    console.log('[Order Service] Creating order:', orderData);
    
    const response = await client.post('/orders', orderData);
    
    // La respuesta actual usa { success: "true", data: {...} }
    if (response.data.success === "true") {
      console.log('[Order Service] Order created successfully:', response.data.data);
      return response.data; // Retorna toda la respuesta { success: "true", message: "...", data: {...} }
    } else {
      throw new Error(response.data.message || 'Error creating order');
    }
  } catch (error) {
    console.error('[Order Service] Error creating order:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Obtener orden por ID
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} OrderResponseDto
 */
export async function getOrderById(orderId) {
  try {
    console.log('[Order Service] Getting order by ID:', orderId);
    
    const response = await client.get(`/orders/${orderId}`);
    
    if (response.data.success === "true") {
      console.log('[Order Service] Order retrieved:', response.data.data);
      return response.data; // Retorna respuesta completa { success: "true", message: "...", data: {...} }
    } else {
      throw new Error(response.data.message || 'Order not found');
    }
  } catch (error) {
    console.error('[Order Service] Error getting order:', error);
    if (error.response?.status === 404) {
      throw new Error('Orden no encontrada');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Obtener todas las órdenes (solo ADMIN/MANAGEMENT)
 * @returns {Promise<Array>} Array de OrderResponseDto
 */
export async function getAllOrders() {
  try {
    console.log('[Order Service] Getting all orders');
    
    const response = await client.get('/orders');
    
    if (response.data.success === "true") {
      console.log('[Order Service] All orders retrieved:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error retrieving orders');
    }
  } catch (error) {
    console.error('[Order Service] Error getting all orders:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Obtener órdenes del usuario autenticado (NUEVO MÉTODO RECOMENDADO)
 * Extrae el userId automáticamente del JWT token
 * @returns {Promise<Object>} Response con array de OrderResponseDto
 */
export async function getUserOrdersAuth() {
  try {
    console.log('[Order Service] 🔍 Getting authenticated user orders...');
    
    const response = await client.get('/orders/user-orders');
    console.log('[Order Service] 📦 User orders response:', response.data);
    
    if (response.data.success === "true") {
      console.log('[Order Service] ✅ User orders retrieved:', response.data.data);
      return response.data; // Retorna { success: "true", message: "...", data: [...] }
    } else {
      throw new Error(response.data.message || 'Error retrieving user orders');
    }
  } catch (error) {
    console.error('[Order Service] ❌ Error getting user orders:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Obtener órdenes de un usuario específico (DEPRECATED)
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Array de OrderResponseDto
 */
export async function getUserOrders(userId) {
  try {
    console.log('[Order Service] Getting user orders:', userId);
    
    const response = await client.get(`/orders/user/${userId}`);
    
    if (response.data.success === "true") {
      console.log('[Order Service] User orders retrieved:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error retrieving user orders');
    }
  } catch (error) {
    console.error('[Order Service] Error getting user orders:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Obtener órdenes por estado (solo ADMIN/MANAGEMENT)
 * @param {string} status - Estado de la orden (PROCESSING, CONFIRMED, etc.)
 * @returns {Promise<Array>} Array de OrderResponseDto
 */
export async function getOrdersByStatus(status) {
  try {
    console.log('[Order Service] Getting orders by status:', status);
    
    const response = await client.get(`/orders/status/${status}`);
    
    if (response.data.success === "true") {
      console.log('[Order Service] Orders by status retrieved:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error retrieving orders by status');
    }
  } catch (error) {
    console.error('[Order Service] Error getting orders by status:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Actualizar estado de una orden (solo ADMIN/MANAGEMENT)
 * @param {string} orderId - ID de la orden
 * @param {string} newStatus - Nuevo estado
 * @returns {Promise<Object>} OrderResponseDto actualizada
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    console.log('[Order Service] Updating order status:', orderId, newStatus);
    
    const response = await client.patch(`/orders/${orderId}/status`, {
      status: newStatus
    });
    
    if (response.data.success === "true") {
      console.log('[Order Service] Order status updated:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Error updating order status');
    }
  } catch (error) {
    console.error('[Order Service] Error updating order status:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Cancelar una orden
 * @param {string} orderId - ID de la orden a cancelar
 * @returns {Promise<Object>} OrderResponseDto cancelada
 */
export async function cancelOrder(orderId) {
  try {
    console.log('[Order Service] Cancelling order:', orderId);
    
    const response = await client.patch(`/orders/${orderId}/cancel`);
    
    if (response.data.success === "true") {
      console.log('[Order Service] Order cancelled:', response.data.data);
      return response.data; // Retorna respuesta completa { success: "true", message: "...", data: {...} }
    } else {
      throw new Error(response.data.message || 'Error cancelling order');
    }
  } catch (error) {
    console.error('[Order Service] Error cancelling order:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Eliminar una orden (solo ADMIN)
 * @param {string} orderId - ID de la orden a eliminar
 * @returns {Promise<void>}
 */
export async function deleteOrder(orderId) {
  try {
    console.log('[Order Service] Deleting order:', orderId);
    
    const response = await client.delete(`/orders/${orderId}`);
    
    if (response.data.success === "true") {
      console.log('[Order Service] Order deleted successfully');
      return;
    } else {
      throw new Error(response.data.message || 'Error deleting order');
    }
  } catch (error) {
    console.error('[Order Service] Error deleting order:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

/**
 * Estados de orden disponibles
 */
export const ORDER_STATUS = {
  PROCESSING: 'PROCESSING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  EXPIRED: 'EXPIRED',
  REFUNDED: 'REFUNDED'
};

/**
 * Métodos de pago disponibles
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  CASH: 'CASH',
  TRANSFER: 'TRANSFER'
};

/**
 * Obtener etiqueta legible para estado de orden
 * @param {string} status - Estado de la orden
 * @returns {string} Etiqueta legible
 */
export function getOrderStatusLabel(status) {
  const labels = {
    [ORDER_STATUS.PROCESSING]: 'Procesando',
    [ORDER_STATUS.CONFIRMED]: 'Confirmada',
    [ORDER_STATUS.PREPARING]: 'Preparando',
    [ORDER_STATUS.SHIPPED]: 'Enviada',
    [ORDER_STATUS.DELIVERED]: 'Entregada',
    [ORDER_STATUS.CANCELLED]: 'Cancelada',
    [ORDER_STATUS.PAYMENT_FAILED]: 'Pago Fallido',
    [ORDER_STATUS.EXPIRED]: 'Expirada',
    [ORDER_STATUS.REFUNDED]: 'Reembolsada'
  };
  return labels[status] || status;
}

/**
 * Obtener clase CSS para estado de orden
 * @param {string} status - Estado de la orden
 * @returns {string} Clase CSS
 */
export function getOrderStatusClass(status) {
  const classes = {
    [ORDER_STATUS.PROCESSING]: 'status-processing',
    [ORDER_STATUS.CONFIRMED]: 'status-confirmed',
    [ORDER_STATUS.PREPARING]: 'status-preparing',
    [ORDER_STATUS.SHIPPED]: 'status-shipped',
    [ORDER_STATUS.DELIVERED]: 'status-delivered',
    [ORDER_STATUS.CANCELLED]: 'status-cancelled',
    [ORDER_STATUS.PAYMENT_FAILED]: 'status-failed',
    [ORDER_STATUS.EXPIRED]: 'status-expired',
    [ORDER_STATUS.REFUNDED]: 'status-refunded'
  };
  return classes[status] || 'status-unknown';
}
