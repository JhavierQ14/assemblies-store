import { getCart } from '../../services/cart/cart-service.js';
import { createOrder } from '../../services/order/order-service.js';
import { getUserProfile } from '../../js/auth-storage.js';

let currentCart = null;
let userProfile = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Checkout] Inicializando página de checkout');
    await loadCheckoutData();
    setupEventListeners();
});

function setupEventListeners() {
    // Manejar envío del formulario
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Seleccionar método de pago por defecto
    const defaultPayment = document.getElementById('credit-card');
    if (defaultPayment) {
        defaultPayment.checked = true;
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    await processOrder();
}

async function loadCheckoutData() {
    try {
        // Cargar datos del carrito desde la API (igual que cart.js)
        console.log('[Checkout] 🔄 Cargando carrito desde API...');
        
        // Mostrar loading state
        const productsList = document.getElementById('checkout-products-list');
        if (productsList) {
            productsList.innerHTML = '<div class="loading">Cargando productos...</div>';
        }
        
        currentCart = await getCart();
        console.log('[Checkout] 📦 Carrito cargado completo:', currentCart);
        console.log('[Checkout] 📦 Items en carrito:', currentCart?.items?.length || 0);
        
        if (currentCart && currentCart.items) {
            currentCart.items.forEach((item, index) => {
                console.log(`[Checkout] 📦 Item ${index}:`, {
                    product: item.product?.name,
                    quantity: item.quantity,
                    price: item.product?.price
                });
            });
        }
        
        // Cargar perfil del usuario
        userProfile = getUserProfile();
        console.log('[Checkout] 👤 Perfil de usuario:', userProfile);
        
        // Renderizar la página
        console.log('[Checkout] 🎨 Iniciando renderizado...');
        renderOrderSummary(currentCart);
        renderUserData(userProfile);
        
    } catch (error) {
        console.error('[Checkout] ❌ Error al cargar datos:', error);
        showError('Error al cargar los datos del checkout. Por favor, intenta de nuevo.');
    }
}

function renderOrderSummary(cart) {
    console.log('[Checkout] 🎨 Renderizando resumen de orden...');
    console.log('[Checkout] 🎨 Cart recibido para renderizar:', cart);
    
    const productsList = document.getElementById('checkout-products-list');
    const totalElement = document.getElementById('checkout-total');
    const subtotalElement = document.getElementById('checkout-subtotal');
    
    if (!productsList || !totalElement) {
        console.error('[Checkout] ❌ No se encontraron elementos necesarios para el resumen');
        console.log('[Checkout] 🔍 Elementos encontrados:', {
            productsList: !!productsList,
            totalElement: !!totalElement,
            subtotalElement: !!subtotalElement
        });
        return;
    }
    
    if (!cart) {
        console.log('[Checkout] ⚠️ Cart es null o undefined');
        productsList.innerHTML = '<p>Error: No se pudo cargar el carrito</p>';
        totalElement.textContent = '$0.00';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        return;
    }
    
    if (!cart.items) {
        console.log('[Checkout] ⚠️ Cart.items es null o undefined');
        productsList.innerHTML = '<p>Error: Datos del carrito incompletos</p>';
        totalElement.textContent = '$0.00';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        return;
    }
    
    if (cart.items.length === 0) {
        console.log('[Checkout] ⚠️ Cart.items está vacío');
        productsList.innerHTML = '<p>No hay productos en el carrito</p>';
        totalElement.textContent = '$0.00';
        if (subtotalElement) subtotalElement.textContent = '$0.00';
        return;
    }
    
    console.log('[Checkout] ✅ Procesando', cart.items.length, 'items');
    
    // Renderizar productos
    let productsHTML = '';
    let total = 0;
    
    cart.items.forEach((item, index) => {
        console.log(`[Checkout] 📦 Procesando item ${index}:`, item);
        
        // Los datos están directamente en el item, no en item.product
        const productPrice = item.unitPrice || item.price || 0;
        const productName = item.name || 'Producto sin nombre';
        const quantity = item.quantity || 0;
        const subtotal = productPrice * quantity;
        total += subtotal;
        
        console.log(`[Checkout] 💰 Item ${index} - Nombre: ${productName}, Precio: ${productPrice}, Cantidad: ${quantity}, Subtotal: ${subtotal}`);
        
        productsHTML += `
            <div class="product-item">
                <div class="product-info">
                    <h4>${productName}</h4>
                    <p>Cantidad: ${quantity}</p>
                    <p>Precio unitario: $${productPrice.toFixed(2)}</p>
                </div>
                <div class="product-total">
                    $${subtotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    console.log('[Checkout] 📝 HTML generado:', productsHTML);
    console.log('[Checkout] 💰 Total calculado:', total);
    
    productsList.innerHTML = productsHTML;
    totalElement.textContent = `$${total.toFixed(2)}`;
    if (subtotalElement) subtotalElement.textContent = `$${total.toFixed(2)}`;
    
    console.log('[Checkout] ✅ Resumen renderizado - Total final:', total);
}

function renderUserData(profile) {
    console.log('[Checkout] Renderizando datos de usuario...');
    
    const userInfoDisplay = document.getElementById('user-info-display');
    
    if (!profile) {
        console.log('[Checkout] No hay perfil de usuario disponible');
        if (userInfoDisplay) {
            userInfoDisplay.innerHTML = `
                <p>No se encontraron datos del usuario. 
                   <a href="../auth/login/login.html">Inicia sesión</a> para continuar.
                </p>
            `;
        }
        return;
    }
    
    // Mostrar información del usuario
    if (userInfoDisplay) {
        userInfoDisplay.innerHTML = `
            <div class="user-info">
                <p><strong>Nombre:</strong> ${profile.name || profile.firstName || 'No especificado'}</p>
                <p><strong>Email:</strong> ${profile.email || 'No especificado'}</p>
                <p><strong>Teléfono:</strong> ${profile.phone || 'No especificado'}</p>
            </div>
        `;
    }
    
    console.log('[Checkout] Datos de usuario renderizados');
}

function showError(message) {
    console.error('[Checkout] Mostrando error:', message);
    
    const errorContainer = document.querySelector('.checkout-container') || document.body;
    
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
        // Preparar productos para la orden
        const products = currentCart.items.map(item => ({
            productId: item.productId || item.id,
            name: item.name,
            unitPrice: item.unitPrice || item.price || 0,
            quantity: item.quantity
        }));
        
        console.log('[Checkout] 📦 Productos preparados para la orden:', products);
        
        // Recopilar datos del formulario
        const orderData = {
            products: products,  // Agregar productos a la orden
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value || 'CREDIT_CARD',
            shippingAddress: {
                street: document.getElementById('street')?.value || '',
                city: document.getElementById('city')?.value || '',
                country: document.getElementById('country')?.value || 'PA',
                postalCode: document.getElementById('postalCode')?.value || ''
            }
        };
        
        console.log('[Checkout] Datos de la orden:', orderData);
        
        // Validar campos requeridos
        if (!orderData.shippingAddress.street || !orderData.shippingAddress.city) {
            showError('Por favor completa todos los campos obligatorios de dirección');
            return;
        }
        
        // Crear la orden
        const orderResponse = await createOrder(orderData);
        console.log('[Checkout] � Respuesta de la orden:', orderResponse);
        
        if (orderResponse.success === "true") {
            const { order, paymentUrl, clientSecret } = orderResponse.data;
            
            // Si hay URL de pago (tarjeta de crédito/débito), redirigir a Stripe
            if (paymentUrl || clientSecret) {
                const redirectUrl = paymentUrl || clientSecret;
                console.log('[Checkout] � Redirigiendo a Stripe:', redirectUrl);
                window.location.href = redirectUrl;
                return; // Importante: salir aquí para evitar más ejecución
            } else {
                // Para otros métodos de pago (efectivo, transferencia), ir a órdenes
                console.log('[Checkout] ✅ Orden creada sin redirección de pago');
                alert('¡Orden creada exitosamente!');
                window.location.href = '/src/pages/orders/orders.html';
            }
        } else {
            throw new Error(orderResponse.message || 'Error al crear la orden');
        }
        
    } catch (error) {
        console.error('[Checkout] Error al procesar orden:', error);
        showError('Error al procesar la orden: ' + error.message);
    }
}

console.log('[Checkout] Script simplificado cargado correctamente');
