// Inicialización del carrito para todas las páginas
import { initializeCartBadge } from '../services/cart/cart-service.js';

// Inicializar el badge del carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Cart Init] Inicializando badge del carrito');
    await initializeCartBadge();
});

// También inicializar cuando se actualiza el localStorage desde otra pestaña
window.addEventListener('storage', (e) => {
    if (e.key === 'cartCount') {
        console.log('[Cart Init] Actualizando badge por cambio en localStorage');
        initializeCartBadge();
    }
});
