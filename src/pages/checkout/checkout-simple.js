import { getCart } from '../../services/cart/cart-service.js';
import { createOrder } from '../../services/order/order-service.js';
import { getUserProfile } from '../../js/auth-storage.js';

let currentCart = null;
let userProfile = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Checkout] Inicializando página de checkout');
    await loadCheckoutData();
});

async function loadCheckoutData() {
    try {
        // Cargar datos del carrito desde la API (igual que cart.js)
        console.log('[Checkout] Cargando carrito desde API...');
        currentCart = await getCart();
        console.log('[Checkout] Carrito cargado:', currentCart);
        
        // Cargar perfil del usuario
        userProfile = getUserProfile();
        console.log('[Checkout] Perfil de usuario:', userProfile);
        
        // Renderizar la página
        renderOrderSummary(currentCart);
        renderUserData(userProfile);
        
    } catch (error) {
        console.error('[Checkout] Error al cargar datos:', error);
        showError('Error al cargar los datos del checkout. Por favor, intenta de nuevo.');
    }
}

function renderOrderSummary(cart) {
    console.log('[Checkout] Renderizando resumen de orden...');
    
    const productsList = document.getElementById('products-list');
    const totalElement = document.getElementById('order-total');
    
    if (!productsList || !totalElement) {
        console.error('[Checkout] No se encontraron elementos necesarios para el resumen');
        return;
    }
    
    if (!cart || !cart.items || cart.items.length === 0) {
        productsList.innerHTML = '<p>No hay productos en el carrito</p>';
        totalElement.textContent = '$0.00';
        return;
    }
    
    // Renderizar productos
    let productsHTML = '';
    let total = 0;
    
    cart.items.forEach(item => {
        const subtotal = (item.product?.price || 0) * (item.quantity || 0);
        total += subtotal;
        
        productsHTML += `
            <div class="product-item">
                <div class="product-info">
                    <h4>${item.product?.name || 'Producto sin nombre'}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Precio unitario: $${(item.product?.price || 0).toFixed(2)}</p>
                </div>
                <div class="product-total">
                    $${subtotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    productsList.innerHTML = productsHTML;
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    console.log('[Checkout] Resumen renderizado - Total:', total);
}

function renderUserData(profile) {
    console.log('[Checkout] Renderizando datos de usuario...');
    
    if (!profile) {
        console.log('[Checkout] No hay perfil de usuario disponible');
        return;
    }
    
    // Rellenar campos del formulario con datos del usuario
    const fields = {
        'user-name': profile.name || profile.firstName || '',
        'user-email': profile.email || '',
        'user-phone': profile.phone || '',
        'user-address': profile.address || ''
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = value;
            console.log(`[Checkout] Campo ${fieldId} rellenado con:`, value);
        }
    });
}

function showError(message) {
    console.error('[Checkout] Mostrando error:', message);
    
    const errorContainer = document.querySelector('.error-container') || 
                          document.querySelector('.checkout-container') ||
                          document.body;
    
    const errorHTML = `
        <div class="error-message" style="background: #ff4444; color: white; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="window.location.reload()" style="background: white; color: #ff4444; border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer;">
                Reintentar
            </button>
        </div>
    `;
    
    errorContainer.insertAdjacentHTML('afterbegin', errorHTML);
}

// Función para procesar la orden
async function processOrder() {
    console.log('[Checkout] Procesando orden...');
    
    if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
        showError('No hay productos en el carrito para procesar');
        return;
    }
    
    try {
        // Recopilar datos del formulario
        const orderData = {
            paymentMethod: document.querySelector('input[name="payment-method"]:checked')?.value || 'CREDIT_CARD',
            shippingAddress: {
                street: document.getElementById('user-address')?.value || '',
                city: document.getElementById('user-city')?.value || '',
                state: document.getElementById('user-state')?.value || '',
                zipCode: document.getElementById('user-zip')?.value || ''
            },
            notes: document.getElementById('order-notes')?.value || ''
        };
        
        console.log('[Checkout] Datos de la orden:', orderData);
        
        // Crear la orden
        const orderResponse = await createOrder(orderData);
        console.log('[Checkout] Orden creada:', orderResponse);
        
        if (orderResponse.success === "true") {
            alert('¡Orden creada exitosamente!');
            window.location.href = '/src/pages/orders/orders.html';
        } else {
            throw new Error(orderResponse.message || 'Error al crear la orden');
        }
        
    } catch (error) {
        console.error('[Checkout] Error al procesar orden:', error);
        showError('Error al procesar la orden: ' + error.message);
    }
}

// Hacer disponible la función globalmente
window.processOrder = processOrder;

console.log('[Checkout] Script simplificado cargado correctamente');
