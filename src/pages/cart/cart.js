import { getCart, updateCartItemQuantity, removeFromCart } from '../../services/cart/cart-service.js';

let currentCart = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Cart] Inicializando página del carrito');
    await loadCart();
    setupEventListeners();
});

async function loadCart() {
    const cartContainer = document.querySelector('.cart-container') || document.querySelector('.box-container');
    
    if (!cartContainer) {
        console.error('[Cart] No se encontró el contenedor del carrito');
        return;
    }
    
    try {
        cartContainer.innerHTML = '<div class="loading-cart">Cargando carrito...</div>';
        
        currentCart = await getCart();
        console.log('[Cart] Carrito cargado:', currentCart);
        
        // Debug: Mostrar estructura de los items
        if (currentCart && currentCart.items && currentCart.items.length > 0) {
            console.log('[Cart] Estructura del primer item:', currentCart.items[0]);
            console.log('[Cart] Propiedades del primer item:', Object.keys(currentCart.items[0]));
        }
        
        renderCart(currentCart);
        
    } catch (error) {
        console.error('[Cart] Error al cargar el carrito:', error);
        cartContainer.innerHTML = `
            <div class="error-cart">
                <h3>Error al cargar el carrito</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" class="btn-retry">Reintentar</button>
            </div>
        `;
    }
}

function renderCart(cart) {
    const cartContainer = document.querySelector('.cart-container') || document.querySelector('.box-container');
    
    console.log('[Cart] Renderizando carrito:', cart);
    
    if (!cart || !cart.items || cart.items.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Tu carrito está vacío</h3>
                <p>¡Agrega algunos productos para comenzar a comprar!</p>
                <a href="../store/store.html" class="btn-continue-shopping">Continuar comprando</a>
            </div>
        `;
        updateCartSummary(null);
        return;
    }
    
    const cartItemsHtml = cart.items.map((item, index) => {
        console.log(`[Cart] Procesando item ${index}:`, item);
        
        // Manejar las imágenes de manera segura
        let imageUrl = '../../assets/images/loader.gif';
        if (item.gallery && Array.isArray(item.gallery) && item.gallery.length > 0) {
            if (typeof item.gallery[0] === 'string') {
                imageUrl = item.gallery[0];
            } else if (item.gallery[0] && item.gallery[0].imageUrl) {
                imageUrl = item.gallery[0].imageUrl;
            }
        }
        
        console.log(`[Cart] Item ${index} - imageUrl:`, imageUrl);
        console.log(`[Cart] Item ${index} - productId:`, item.productId || item.id);
        
        const itemId = item.productId || item.id; // Usar productId preferentemente, fallback a id
        
        return `
        <div class="cart-item" data-item-id="${itemId}">
            <div class="item-image">
                <img src="${imageUrl}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <p class="item-brand">${item.description || ''}</p>
                <p class="item-price">$${item.unitPrice}</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn qty-decrease" data-item-id="${itemId}">-</button>
                <input type="number" class="qty-input" value="${item.quantity}" min="1" max="99" data-item-id="${itemId}">
                <button class="qty-btn qty-increase" data-item-id="${itemId}">+</button>
            </div>
            <div class="item-total">
                <span class="total-price">$${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
            <div class="item-actions">
                <button class="btn-remove" data-item-id="${itemId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
    }).join('');
    
    cartContainer.innerHTML = `
        <div class="cart-content">
            <div class="cart-items">
                <h2>Tu Carrito</h2>
                ${cartItemsHtml}
            </div>
            <div class="cart-summary">
                <h3>Resumen del Pedido</h3>
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span class="subtotal">$${cart.total.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Envío:</span>
                    <span class="shipping">Gratis</span>
                </div>
                <div class="summary-line total-line">
                    <span>Total:</span>
                    <span class="total">$${cart.total.toFixed(2)}</span>
                </div>
                <button class="btn-checkout" ${cart.items.length === 0 ? 'disabled' : ''}>
                    Proceder al Checkout
                </button>
                <a href="../store/store.html" class="btn-continue-shopping">Continuar comprando</a>
            </div>
        </div>
    `;
    
    // Agregar event listeners después de renderizar
    addCartItemEventListeners();
}

function addCartItemEventListeners() {
    // Event listeners para botones de cantidad
    document.querySelectorAll('.qty-decrease').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.itemId;
            const input = document.querySelector(`.qty-input[data-item-id="${itemId}"]`);
            const currentQty = parseInt(input.value);
            
            if (currentQty > 1) {
                await updateQuantity(itemId, currentQty - 1);
            }
        });
    });
    
    document.querySelectorAll('.qty-increase').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.dataset.itemId;
            const input = document.querySelector(`.qty-input[data-item-id="${itemId}"]`);
            const currentQty = parseInt(input.value);
            
            if (currentQty < 99) {
                await updateQuantity(itemId, currentQty + 1);
            }
        });
    });
    
    // Event listeners para inputs de cantidad
    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', async (e) => {
            const itemId = e.target.dataset.itemId;
            const newQty = parseInt(e.target.value);
            
            if (newQty >= 1 && newQty <= 99) {
                await updateQuantity(itemId, newQty);
            } else {
                e.target.value = 1;
                await updateQuantity(itemId, 1);
            }
        });
    });
    
    // Event listeners para botones de eliminar
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const itemId = e.target.closest('.btn-remove').dataset.itemId;
            await removeItem(itemId);
        });
    });
    
    // Event listener para checkout
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log('[Cart] 🚀 Botón checkout clickeado');
            console.log('[Cart] 🛒 Estado actual del carrito antes de ir a checkout:');
            console.log('[Cart] - currentCart global:', currentCart);
            
            // Verificar localStorage completamente
            console.log('[Cart] 📦 Verificando localStorage:');
            const cartKeys = ['fullCart', 'cart', 'cartItems', 'appCart', 'userCart', 'shopping-cart', 'cartData'];
            cartKeys.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    console.log(`[Cart] ✅ "${key}":`, data);
                    try {
                        const parsed = JSON.parse(data);
                        console.log(`[Cart] 📊 "${key}" parseado:`, parsed);
                        if (parsed.items) {
                            console.log(`[Cart] 📦 "${key}" items:`, parsed.items.length, 'items');
                            console.log(`[Cart] 💰 "${key}" total:`, parsed.total);
                        }
                    } catch (e) {
                        console.error(`[Cart] ❌ Error parseando "${key}":`, e);
                    }
                } else {
                    console.log(`[Cart] ❌ "${key}": no encontrado`);
                }
            });
            
            // Forzar guardar carrito actual si existe
            if (currentCart && currentCart.items && currentCart.items.length > 0) {
                console.log('[Cart] � Forzando guardado del carrito actual...');
                try {
                    localStorage.setItem('fullCart', JSON.stringify(currentCart));
                    localStorage.setItem('cartItems', JSON.stringify(currentCart.items));
                    localStorage.setItem('cartTotal', currentCart.total || 0);
                    console.log('[Cart] ✅ Carrito guardado manualmente');
                } catch (e) {
                    console.error('[Cart] ❌ Error guardando carrito:', e);
                }
            }
            
            console.log('[Cart] 🔄 Navegando a checkout...');
            window.location.href = '../checkout/checkout.html';
        });
    }
}

async function updateQuantity(itemId, newQuantity) {
    try {
        console.log('[Cart] Actualizando cantidad:', { itemId, newQuantity });
        
        // Actualizar visualmente primero para mejor UX
        const input = document.querySelector(`.qty-input[data-item-id="${itemId}"]`);
        const itemElement = document.querySelector(`.cart-item[data-item-id="${itemId}"]`);
        
        if (input) {
            input.value = newQuantity;
        }
        
        // Actualizar en el backend
        await updateCartItemQuantity(itemId, newQuantity);
        
        // Recargar el carrito para obtener datos actualizados
        await loadCart();
        
    } catch (error) {
        console.error('[Cart] Error al actualizar cantidad:', error);
        
        // Revertir cambio visual en caso de error
        if (input) {
            const originalItem = currentCart?.items?.find(item => 
                (item.productId || item.id) === itemId
            );
            if (originalItem) {
                input.value = originalItem.quantity;
            }
        }
        
        alert('Error al actualizar la cantidad. Por favor, intenta de nuevo.');
    }
}

async function removeItem(itemId) {
    try {
        console.log('[Cart] Eliminando item:', itemId);
        
        if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
            await removeFromCart(itemId);
            await loadCart();
        }
        
    } catch (error) {
        console.error('[Cart] Error al eliminar item:', error);
        alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
    }
}

function setupEventListeners() {
    // Event listeners adicionales si es necesario
    console.log('[Cart] Event listeners configurados');
}
