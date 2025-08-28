console.log('=== CHECKOUT SCRIPT CARGADO ===');
console.log('Fecha/Hora:', new Date());
console.log('Ubicación:', window.location.href);

import { createOrder, PAYMENT_METHODS } from '../../services/order/order-service.js';
import { getUserProfile } from '../../js/auth-storage.js';

let currentCart = null;
let userProfile = null;

// Función de debug temporal - BORRAR EN PRODUCCIÓN
window.debugCheckout = function() {
    console.log('=== DEBUG CHECKOUT MANUAL ===');
    console.log('localStorage disponible:', typeof Storage !== 'undefined');
    console.log('Todas las claves en localStorage:', Object.keys(localStorage));
    
    // Verificar todas las posibles claves de carrito
    const cartKeys = ['fullCart', 'cart', 'cartItems', 'appCart', 'userCart', 'shopping-cart', 'cartData'];
    cartKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            console.log(`🛒 Encontrado carrito en "${key}":`, data);
            try {
                const parsed = JSON.parse(data);
                console.log(`🛒 Carrito "${key}" parseado:`, parsed);
            } catch (e) {
                console.error(`❌ Error al parsear carrito "${key}":`, e);
            }
        }
    });
    
    // Verificar datos del usuario usando la función oficial
    console.log('👤 Usando getUserProfile():', getUserProfile());
    
    // Verificar todas las posibles claves de usuario
    const userKeys = ['user_profile', 'user', 'authUser', 'currentUser', 'userData'];
    userKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            console.log(`👤 Encontrado usuario en "${key}":`, data);
            try {
                const parsed = JSON.parse(data);
                console.log(`👤 Usuario "${key}" parseado:`, parsed);
            } catch (e) {
                console.error(`❌ Error al parsear usuario "${key}":`, e);
            }
        }
    });
    
    // Intentar cargar datos manualmente
    console.log('🔄 Intentando cargar datos manualmente...');
    loadCheckoutData();
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('[Checkout] 🏁 DOM Content Loaded - Iniciando checkout');
    console.log('[Checkout] 🌐 URL actual:', window.location.href);
    console.log('[Checkout] 📍 Pathname:', window.location.pathname);
    console.log('[Checkout] 🔍 Verificando localStorage disponible...');
    
    // Verificar que localStorage esté disponible
    if (typeof(Storage) !== "undefined") {
        console.log('[Checkout] ✅ localStorage disponible');
        console.log('[Checkout] 🗃️ Todas las claves en localStorage:', Object.keys(localStorage));
    } else {
        console.log('[Checkout] ❌ localStorage NO disponible');
    }
    
    console.log('[Checkout] 🚀 Iniciando carga de datos...');
    loadCheckoutData();
    setupEventListeners();
});

function loadCheckoutData() {
    try {
        console.log('='.repeat(80));
        console.log('🚀 INICIANDO CARGA DE DATOS DEL CHECKOUT');
        console.log('='.repeat(80));
        
        console.log('[Checkout] �️ Estado actual del localStorage:');
        console.log('[Checkout] - Todas las claves disponibles:', Object.keys(localStorage));
        console.log('[Checkout] - cart:', localStorage.getItem('cart'));
        console.log('[Checkout] - fullCart:', localStorage.getItem('fullCart'));
        console.log('[Checkout] - cartItems:', localStorage.getItem('cartItems'));
        console.log('[Checkout] - cartData:', localStorage.getItem('cartData'));
        console.log('[Checkout] - user:', localStorage.getItem('user'));
        console.log('[Checkout] - user_profile:', localStorage.getItem('user_profile'));
        
        console.log('\n' + '='.repeat(50));
        console.log('🛒 CARGANDO DATOS DEL CARRITO...');
        console.log('='.repeat(50));
        
        // Cargar datos directamente del localStorage
        currentCart = getCartFromLocalStorage();
        
        console.log('\n' + '='.repeat(50));
        console.log('👤 CARGANDO DATOS DEL USUARIO...');
        console.log('='.repeat(50));
        
        userProfile = getUserFromLocalStorage();
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 RESUMEN FINAL DE DATOS CARGADOS');
        console.log('='.repeat(80));
        
        // MOSTRAR DATOS DEL CARRITO
        console.log('🛒 CARRITO FINAL:');
        if (currentCart) {
            console.log('   ✅ Carrito cargado correctamente');
            console.log('   📦 Tiene items:', !!(currentCart.items && currentCart.items.length > 0));
            console.log('   📊 Número de items:', currentCart.items ? currentCart.items.length : 0);
            console.log('   💰 Total:', currentCart.total || 0);
            console.log('   📋 Estructura completa del carrito:', currentCart);
            if (currentCart.items && currentCart.items.length > 0) {
                console.log('   � Primer item como ejemplo:', currentCart.items[0]);
                console.log('   📝 Propiedades del primer item:', Object.keys(currentCart.items[0]));
            }
        } else {
            console.log('   ❌ NO HAY CARRITO CARGADO');
        }
        
        console.log('\n👤 USUARIO FINAL:');
        if (userProfile) {
            console.log('   ✅ Usuario cargado correctamente');
            console.log('   📧 Email:', userProfile.email || 'No disponible');
            console.log('   📛 Nombre:', userProfile.name || userProfile.firstName || 'No disponible');
            console.log('   � Teléfono:', userProfile.phone || userProfile.phoneNumber || 'No disponible');
            console.log('   🏠 Dirección:', userProfile.address || 'No disponible');
            console.log('   👤 Estructura completa del usuario:', userProfile);
        } else {
            console.log('   ❌ NO HAY USUARIO CARGADO');
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('🎨 INICIANDO RENDERIZADO...');
        console.log('='.repeat(80));
        
        console.log('[Checkout] 🎨 Renderizando productos...');
        renderCheckoutProducts(currentCart);
        
        console.log('[Checkout] 👤 Renderizando información del usuario...');
        renderUserInfo(userProfile);
        
        console.log('\n' + '='.repeat(80));
        console.log('✅ CARGA DE DATOS COMPLETADA');
        console.log('='.repeat(80));
        console.log('📊 RESULTADO:');
        console.log('   🛒 Carrito:', currentCart ? '✅ CARGADO' : '❌ VACÍO/ERROR');
        console.log('   👤 Usuario:', userProfile ? '✅ CARGADO' : '❌ VACÍO/ERROR');
        console.log('   🎯 Estado general:', (currentCart && userProfile) ? '✅ TODO OK' : '⚠️ FALTAN DATOS');
        console.log('='.repeat(80));
        
    } catch (error) {
        console.log('\n' + '❌'.repeat(30));
        console.error('[Checkout] ❌ ERROR CARGANDO DATOS:', error);
        console.log('❌'.repeat(30));
        showError('Error al cargar los datos del checkout: ' + error.message);
    }
}

function getCartFromLocalStorage() {
    try {
        console.log('[Checkout] 🔍 Leyendo carrito del localStorage...');
        
        // Intentar con diferentes claves posibles
        const possibleKeys = ['fullCart', 'cart', 'cartItems', 'appCart', 'userCart', 'shopping-cart', 'cartData'];
        let cartData = null;
        let usedKey = null;
        
        for (const key of possibleKeys) {
            const data = localStorage.getItem(key);
            if (data) {
                console.log(`[Checkout] ✅ Encontrado carrito en clave "${key}"`);
                cartData = data;
                usedKey = key;
                break;
            }
        }
        
        console.log('[Checkout] 📄 Datos del localStorage cart:', cartData);
        console.log('[Checkout] 🔑 Clave usada:', usedKey);
        
        if (!cartData) {
            console.log('[Checkout] ⚠️ No hay datos de carrito en localStorage en ninguna clave');
            console.log('[Checkout] 🔍 Claves verificadas:', possibleKeys);
            console.log('[Checkout] 🗂️ Todas las claves disponibles:', Object.keys(localStorage));
            return { items: [], total: 0 };
        }
        
        const cart = JSON.parse(cartData);
        console.log('[Checkout] 🛒 Carrito parseado:', cart);
        console.log('[Checkout] 📦 Items en carrito:', cart.items);
        console.log('[Checkout] 💰 Total del carrito:', cart.total);
        
        // Verificar estructura del carrito
        if (!cart.items) {
            console.log('[Checkout] ⚠️ El carrito no tiene propiedad "items"');
            console.log('[Checkout] 📋 Propiedades del carrito:', Object.keys(cart));
            
            // Intentar diferentes estructuras
            if (cart.products) {
                console.log('[Checkout] 🔄 Usando "products" en lugar de "items"');
                cart.items = cart.products;
            } else if (cart.cartItems) {
                console.log('[Checkout] 🔄 Usando "cartItems" en lugar de "items"');
                cart.items = cart.cartItems;
            } else if (Array.isArray(cart)) {
                console.log('[Checkout] 🔄 El carrito es un array directo');
                cart = { items: cart, total: 0 };
            }
        }
        
        // Calcular total si no existe
        if (!cart.total && cart.items && Array.isArray(cart.items)) {
            cart.total = cart.items.reduce((sum, item) => {
                const price = item.unitPrice || item.price || 0;
                const quantity = item.quantity || 1;
                return sum + (price * quantity);
            }, 0);
            console.log('[Checkout] 🧮 Total calculado:', cart.total);
        }
        
        console.log('[Checkout] ✅ Carrito final procesado:', cart);
        return cart;
    } catch (error) {
        console.error('[Checkout] ❌ Error al leer carrito del localStorage:', error);
        return { items: [], total: 0 };
    }
}

function getUserFromLocalStorage() {
    try {
        console.log('[Checkout] 👤 Leyendo usuario del localStorage...');
        
        // Usar la función oficial de auth-storage
        let user = getUserProfile();
        
        if (user) {
            console.log('[Checkout] ✅ Usuario encontrado usando getUserProfile()');
            console.log('[Checkout] 👤 Usuario:', user);
            return user;
        }
        
        // Fallback: Intentar con diferentes claves posibles
        const possibleKeys = ['user_profile', 'user', 'authUser', 'currentUser', 'userData', 'userProfile'];
        let userData = null;
        let usedKey = null;
        
        for (const key of possibleKeys) {
            const data = localStorage.getItem(key);
            if (data) {
                console.log(`[Checkout] ✅ Encontrado usuario en clave "${key}"`);
                userData = data;
                usedKey = key;
                break;
            }
        }
        
        console.log('[Checkout] 📄 Datos del localStorage user:', userData);
        console.log('[Checkout] 🔑 Clave usada:', usedKey);
        
        if (!userData) {
            console.log('[Checkout] ⚠️ No hay datos de usuario en localStorage en ninguna clave');
            console.log('[Checkout] 🔍 Claves verificadas:', possibleKeys);
            return null;
        }
        
        user = JSON.parse(userData);
        console.log('[Checkout] 👤 Usuario parseado:', user);
        console.log('[Checkout] 📧 Email del usuario:', user.email);
        console.log('[Checkout] 📛 Nombre del usuario:', user.name || user.firstName || user.username);
        console.log('[Checkout] 📱 Teléfono del usuario:', user.phone || user.phoneNumber);
        console.log('[Checkout] 🏠 Dirección del usuario:', user.address);
        
        return user;
    } catch (error) {
        console.error('[Checkout] ❌ Error al leer usuario del localStorage:', error);
        return null;
    }
}

function renderCheckoutProducts(cart) {
    console.log('\n' + '🎨'.repeat(30));
    console.log('🎨 RENDERIZANDO PRODUCTOS DEL CHECKOUT');
    console.log('🎨'.repeat(30));
    console.log('[Checkout] 📦 Carrito recibido para renderizar:', cart);
    
    const productsContainer = document.getElementById('checkout-products-list');
    const subtotalElement = document.getElementById('checkout-subtotal');
    const totalElement = document.getElementById('checkout-total');
    
    console.log('[Checkout] 🎯 Elementos DOM encontrados:');
    console.log('[Checkout] - productsContainer (checkout-products-list):', !!productsContainer);
    console.log('[Checkout] - subtotalElement (checkout-subtotal):', !!subtotalElement);
    console.log('[Checkout] - totalElement (checkout-total):', !!totalElement);
    
    if (!productsContainer) {
        console.error('[Checkout] ❌ ERROR CRÍTICO: No se encontró el contenedor de productos!');
        return;
    }
    
    if (!cart || !cart.items || cart.items.length === 0) {
        console.log('[Checkout] ⚠️ CARRITO VACÍO O SIN ITEMS:');
        console.log('[Checkout] - cart existe:', !!cart);
        console.log('[Checkout] - cart.items existe:', !!(cart && cart.items));
        console.log('[Checkout] - cart.items.length:', cart?.items?.length || 0);
        console.log('[Checkout] - cart completo:', cart);
        
        productsContainer.innerHTML = `
            <div class="empty-checkout">
                <i class="fas fa-shopping-cart"></i>
                <h3>No hay productos en tu carrito</h3>
                <p>Agrega algunos productos antes de proceder al checkout.</p>
                <a href="../store/store.html" class="btn-primary">Ir a la tienda</a>
            </div>
        `;
        console.log('[Checkout] 📱 HTML de carrito vacío insertado');
        return;
    }
    
    console.log('[Checkout] ✅ CARRITO CON ITEMS - PROCESANDO:');
    console.log('[Checkout] 📊 Número de items:', cart.items.length);
    console.log('[Checkout] 💰 Total del carrito:', cart.total);
    console.log('[Checkout] � Lista de items:', cart.items);
    
    const productsHtml = cart.items.map(item => {
        // Manejar las imágenes de manera segura
        let imageUrl = '../../assets/images/600.png';
        if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
            if (typeof item.gallery[0] === 'string') {
                imageUrl = item.gallery[0];
            } else if (item.gallery[0] && item.gallery[0].imageUrl) {
                imageUrl = item.gallery[0].imageUrl;
            }
        } else if (item.imageUrl) {
            imageUrl = item.imageUrl;
        }
        
        const subtotal = (item.unitPrice * item.quantity).toFixed(2);
        
        return `
            <div class="checkout-product-item">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='../../assets/images/600.png'">
                </div>
                <div class="product-details">
                    <h4>${item.name}</h4>
                    <p class="product-brand">${item.description || ''}</p>
                    <div class="product-pricing">
                        <span class="quantity">Cantidad: ${item.quantity}</span>
                        <span class="unit-price">$${item.unitPrice.toFixed(2)} c/u</span>
                        <span class="subtotal">$${subtotal}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('[Checkout] 🎨 HTML generado para productos:');
    console.log('[Checkout] - Longitud del HTML:', productsHtml.length, 'caracteres');
    console.log('[Checkout] - HTML contiene productos:', productsHtml.includes('checkout-product-item'));
    
    productsContainer.innerHTML = productsHtml;
    console.log('[Checkout] ✅ HTML insertado en contenedor');
    
    // Actualizar totales
    console.log('[Checkout] 💰 ACTUALIZANDO TOTALES:');
    console.log('[Checkout] - Total del carrito para mostrar:', cart.total);
    
    if (subtotalElement) {
        const subtotalText = `$${cart.total.toFixed(2)}`;
        subtotalElement.textContent = subtotalText;
        console.log('[Checkout] ✅ Subtotal actualizado a:', subtotalText);
    } else {
        console.log('[Checkout] ⚠️ Elemento subtotal no encontrado');
    }
    
    if (totalElement) {
        const totalText = `$${cart.total.toFixed(2)}`;
        totalElement.textContent = totalText;
        console.log('[Checkout] ✅ Total actualizado a:', totalText);
    } else {
        console.log('[Checkout] ⚠️ Elemento total no encontrado');
    }
    
    console.log('✅'.repeat(30));
    console.log('✅ RENDERIZADO DE PRODUCTOS COMPLETADO');
    console.log('✅'.repeat(30));
}

function renderUserInfo(profile) {
    console.log('\n' + '👤'.repeat(30));
    console.log('👤 RENDERIZANDO INFORMACIÓN DEL USUARIO');
    console.log('👤'.repeat(30));
    console.log('[Checkout] 👤 Perfil recibido para renderizar:', profile);
    
    const userInfoContainer = document.getElementById('user-info-display');
    console.log('[Checkout] 🎯 Contenedor de usuario encontrado:', !!userInfoContainer);
    
    if (!userInfoContainer) {
        console.error('[Checkout] ❌ ERROR CRÍTICO: No se encontró el contenedor de usuario!');
        return;
    }
    
    if (!profile) {
        console.log('[Checkout] ⚠️ NO HAY PERFIL DE USUARIO - Mostrando mensaje de error');
        userInfoContainer.innerHTML = `
            <div class="user-info-error">
                <p>No se encontraron datos del usuario</p>
                <a href="../auth/login/login.html" class="btn-link">Iniciar sesión</a>
            </div>
        `;
        console.log('[Checkout] 📱 HTML de error de usuario insertado');
        return;
    }
    
    console.log('[Checkout] ✅ PERFIL DE USUARIO VÁLIDO - PROCESANDO:');
    console.log('[Checkout] 📧 Email:', profile.email || 'No especificado');
    console.log('[Checkout] 📛 Nombre:', profile.name || profile.firstName || 'No especificado');
    console.log('[Checkout] 📱 Teléfono:', profile.phone || profile.phoneNumber || 'No especificado');
    console.log('[Checkout] 🏠 Dirección:', profile.address || 'No especificado');
    
    const userHtml = `
        <div class="user-info-card">
            <div class="info-row">
                <i class="fas fa-user"></i>
                <span>${profile.name || profile.firstName || 'No especificado'}</span>
            </div>
            <div class="info-row">
                <i class="fas fa-envelope"></i>
                <span>${profile.email || 'No especificado'}</span>
            </div>
            <div class="info-row">
                <i class="fas fa-phone"></i>
                <span>${profile.phone || profile.phoneNumber || 'No especificado'}</span>
            </div>
            ${profile.address ? `
                <div class="info-row">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${profile.address}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    console.log('[Checkout] 🎨 HTML de usuario generado, longitud:', userHtml.length, 'caracteres');
    userInfoContainer.innerHTML = userHtml;
    console.log('[Checkout] ✅ HTML de usuario insertado en contenedor');
    
    // Pre-llenar el formulario con los datos del usuario
    console.log('[Checkout] 📝 Pre-llenando formulario con datos del usuario...');
    fillFormWithUserData(profile);
    
    console.log('✅'.repeat(30));
    console.log('✅ RENDERIZADO DE USUARIO COMPLETADO');
    console.log('✅'.repeat(30));
}

function fillFormWithUserData(profile) {
    if (!profile) return;
    
    // Llenar campos del formulario
    const nameField = document.getElementById('customer-name');
    const emailField = document.getElementById('customer-email');
    const phoneField = document.getElementById('customer-phone');
    const addressField = document.getElementById('shipping-address');
    
    if (nameField && (profile.name || profile.firstName)) {
        nameField.value = profile.name || profile.firstName;
    }
    
    if (emailField && profile.email) {
        emailField.value = profile.email;
    }
    
    if (phoneField && (profile.phone || profile.phoneNumber)) {
        phoneField.value = profile.phone || profile.phoneNumber;
    }
    
    if (addressField && profile.address) {
        addressField.value = profile.address;
    }
}

function setupEventListeners() {
    // Event listener para el formulario
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Event listeners para métodos de pago
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });
}

function handlePaymentMethodChange(e) {
    const selectedMethod = e.target.value;
    const paymentDetails = document.getElementById('payment-details');
    
    console.log('[Checkout] Payment method selected:', selectedMethod);
    
    // Mostrar detalles adicionales según el método seleccionado
    switch (selectedMethod) {
        case PAYMENT_METHODS.CREDIT_CARD:
        case PAYMENT_METHODS.DEBIT_CARD:
            paymentDetails.innerHTML = `
                <div class="card-info">
                    <p><i class="fas fa-info-circle"></i> Serás redirigido a una página segura para completar el pago con tarjeta.</p>
                </div>
            `;
            paymentDetails.style.display = 'block';
            break;
            
        case PAYMENT_METHODS.CASH:
            paymentDetails.innerHTML = `
                <div class="cash-info">
                    <p><i class="fas fa-money-bill-wave"></i> Pagarás al recibir tu pedido. Asegúrate de tener el monto exacto.</p>
                </div>
            `;
            paymentDetails.style.display = 'block';
            break;
            
        case PAYMENT_METHODS.TRANSFER:
            paymentDetails.innerHTML = `
                <div class="transfer-info">
                    <p><i class="fas fa-university"></i> Recibirás los datos bancarios para realizar la transferencia después de confirmar el pedido.</p>
                </div>
            `;
            paymentDetails.style.display = 'block';
            break;
            
        default:
            paymentDetails.style.display = 'none';
    }
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    console.log('[Checkout] Processing checkout submission');
    
    const submitButton = document.getElementById('place-order-btn');
    
    try {
        // Deshabilitar botón y mostrar loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        
        // Validar que hay productos en el carrito
        if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
            throw new Error('No hay productos en el carrito');
        }
        
        // Obtener datos del formulario
        const formData = new FormData(e.target);
        const orderData = {
            products: currentCart.items.map(item => ({
                productId: item.productId || item.id,
                name: item.name,
                unitPrice: item.unitPrice,
                quantity: item.quantity
            })),
            shippingAddress: {
                street: formData.get('street'),
                city: formData.get('city'),
                country: formData.get('country'),
                postalCode: formData.get('postalCode') || ''
            },
            paymentMethod: formData.get('paymentMethod')
        };
        
        // Validar datos requeridos
        if (!orderData.shippingAddress.street || !orderData.shippingAddress.city || !orderData.shippingAddress.country) {
            throw new Error('Por favor completa todos los campos de dirección requeridos');
        }
        
        if (!orderData.paymentMethod) {
            throw new Error('Por favor selecciona un método de pago');
        }
        
        console.log('[Checkout] Order data:', orderData);
        
        // Crear la orden
        const orderResponse = await createOrder(orderData);
        console.log('[Checkout] Order created:', orderResponse);
        
        // Manejar respuesta
        if (orderResponse.paymentUrl) {
            // Si hay URL de pago, redirigir
            showOrderSuccess(orderResponse.order, true);
            setTimeout(() => {
                window.open(orderResponse.paymentUrl, '_blank');
            }, 3000);
        } else {
            // Mostrar confirmación de orden
            showOrderSuccess(orderResponse.order, false);
        }
        
    } catch (error) {
        console.error('[Checkout] Error creating order:', error);
        showError('Error al procesar el pedido: ' + error.message);
        
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-check"></i> Realizar Pedido';
    }
}

function showOrderSuccess(order, hasPaymentUrl) {
    const modalContent = document.getElementById('order-modal-content');
    const modal = document.getElementById('order-modal');
    
    modalContent.innerHTML = `
        <div class="order-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>¡Pedido Creado Exitosamente!</h2>
            <div class="order-details">
                <p><strong>Número de Orden:</strong> ${order.id}</p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                <p><strong>Estado:</strong> ${order.status}</p>
                <p><strong>Fecha:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            ${hasPaymentUrl ? `
                <div class="payment-redirect">
                    <p><i class="fas fa-credit-card"></i> Serás redirigido para completar el pago en breve...</p>
                </div>
            ` : `
                <div class="order-confirmation">
                    <p><i class="fas fa-envelope"></i> Recibirás un email con los detalles de tu pedido.</p>
                </div>
            `}
            <div class="success-actions">
                <button onclick="closeOrderModal(); window.location.href='../orders/orders.html';" class="btn-primary">
                    Ver mis pedidos
                </button>
                <button onclick="closeOrderModal(); window.location.href='../home/home.html';" class="btn-secondary">
                    Ir al inicio
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Limpiar el carrito en localStorage (el backend ya lo limpió)
    localStorage.setItem('cartCount', '0');
    
    // Actualizar badge del carrito
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.textContent = '0';
    }
}

function showError(message) {
    const modalContent = document.getElementById('order-modal-content');
    const modal = document.getElementById('order-modal');
    
    modalContent.innerHTML = `
        <div class="order-error">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2>Error en el Pedido</h2>
            <p>${message}</p>
            <div class="error-actions">
                <button onclick="closeOrderModal();" class="btn-primary">
                    Cerrar
                </button>
                <button onclick="closeOrderModal(); window.location.reload();" class="btn-secondary">
                    Reintentar
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Función global para cerrar modal
window.closeOrderModal = function() {
    const modal = document.getElementById('order-modal');
    modal.style.display = 'none';
};

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('order-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Funciones de debugging
window.debugCheckout = function() {
    console.log('=== DEBUG CHECKOUT ===');
    console.log('currentCart:', currentCart);
    console.log('userProfile:', userProfile);
    console.log('=====================');
};
