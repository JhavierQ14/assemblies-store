import { getUserOrdersAuth, cancelOrder, getOrderById } from '../../services/order/order-service.js';
import { getTokens } from '../../js/auth-storage.js';

class OrdersPage {
    constructor() {
        this.currentOrders = [];
        this.filteredOrders = [];
        this.selectedOrderId = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('[Orders] 🚀 Inicializando página de órdenes...');
            
            // Verificar autenticación
            const tokens = getTokens();
            if (!tokens.access_token) {
                console.log('[Orders] ❌ Usuario no autenticado, redirigiendo a login');
                window.location.href = '../auth/login/login.html';
                return;
            }

            console.log('[Orders] ✅ Usuario autenticado, cargando órdenes...');
            await this.loadOrders();
            this.setupEventListeners();
        } catch (error) {
            console.error('[Orders] ❌ Error al inicializar página de órdenes:', error);
            this.showError('Error al cargar la página. Por favor, recarga.');
        }
    }

    async loadOrders() {
        try {
            console.log('[Orders] 📦 Cargando órdenes del usuario...');
            this.showLoading();
            
            const response = await getUserOrdersAuth();
            console.log('[Orders] 📋 Respuesta de órdenes:', response);
            
            if (response.success === "true") {
                this.currentOrders = response.data || [];
                this.filteredOrders = [...this.currentOrders];
                console.log('[Orders] ✅ Órdenes cargadas:', this.currentOrders.length, 'órdenes');
                this.renderOrders();
            } else {
                throw new Error(response.message || 'Error al cargar órdenes');
            }
        } catch (error) {
            console.error('[Orders] ❌ Error al cargar órdenes:', error);
            this.showError('No se pudieron cargar tus pedidos. Intenta nuevamente.');
        }
    }

    setupEventListeners() {
        // Filtro por estado
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterOrders(e.target.value);
            });
        }

        // Botón de actualizar
        const refreshBtn = document.getElementById('refresh-orders');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadOrders();
            });
        }

        // Event listeners globales para modales
        window.closeOrderDetailModal = () => this.closeOrderDetailModal();
        window.closeCancelModal = () => this.closeCancelModal();
        window.showOrderDetail = (orderId) => this.showOrderDetail(orderId);
        window.showCancelModal = (orderId) => this.showCancelModal(orderId);
    }

    filterOrders(status) {
        if (!status) {
            this.filteredOrders = [...this.currentOrders];
        } else {
            this.filteredOrders = this.currentOrders.filter(order => 
                order.status === status
            );
        }
        this.renderOrders();
    }

    showLoading() {
        const ordersList = document.getElementById('orders-list');
        if (ordersList) {
            ordersList.innerHTML = `
                <div class="loading-orders">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Cargando pedidos...</span>
                </div>
            `;
        }
    }

    showError(message) {
        const ordersList = document.getElementById('orders-list');
        if (ordersList) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn-refresh">
                        <i class="fas fa-sync-alt"></i> Intentar nuevamente
                    </button>
                </div>
            `;
        }
    }

    showEmptyState() {
        const ordersList = document.getElementById('orders-list');
        if (ordersList) {
            ordersList.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>No tienes pedidos aún</h3>
                    <p>¡Comienza a explorar nuestros productos y realiza tu primera compra!</p>
                    <a href="../store/store.html" class="btn-shop">
                        <i class="fas fa-shopping-bag"></i> Ir a la tienda
                    </a>
                </div>
            `;
        }
    }

    renderOrders() {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        if (this.filteredOrders.length === 0) {
            this.showEmptyState();
            return;
        }

        const ordersHTML = this.filteredOrders.map(order => 
            this.createOrderCard(order)
        ).join('');

        ordersList.innerHTML = ordersHTML;
    }

    createOrderCard(order) {
        console.log('[Orders] 🎨 Creando card para orden:', order);
        
        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);
        const canCancel = this.canCancelOrder(order.status);
        
        // Corregir fecha - usar orderDate que viene como timestamp
        const orderDate = new Date(order.orderDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Usar products en lugar de items
        const products = order.products || [];
        const itemsPreview = products.slice(0, 3).map(item => 
            `<span class="item-tag">${item.quantity}x ${item.name}</span>`
        ).join('');

        const remainingItems = products.length > 3 ? products.length - 3 : 0;
        
        console.log('[Orders] 💰 Total para orden:', order.total, 'Productos:', products.length);

        return `
            <div class="order-card ${statusClass}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>
                            <i class="fas fa-receipt"></i>
                            Pedido <span class="order-id">#${order.id}</span>
                        </h3>
                        <p class="order-date">${orderDate}</p>
                    </div>
                    <div class="order-status status-${order.status.toLowerCase()}">
                        ${statusText}
                    </div>
                </div>

                <div class="order-details">
                    <div class="order-summary">
                        <div class="summary-item">
                            <strong>$${parseFloat(order.total || 0).toFixed(2)}</strong>
                            <span>Total</span>
                        </div>
                        <div class="summary-item">
                            <strong>${products.length}</strong>
                            <span>Productos</span>
                        </div>
                        <div class="summary-item">
                            <strong>${order.paymentMethod || 'N/A'}</strong>
                            <span>Pago</span>
                        </div>
                    </div>

                    ${products.length > 0 ? `
                        <div class="order-items">
                            <h4><i class="fas fa-boxes"></i> Productos</h4>
                            <div class="items-preview">
                                ${itemsPreview}
                                ${remainingItems > 0 ? `<span class="item-tag">+${remainingItems} más</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="order-actions">
                    <button class="btn-view" onclick="showOrderDetail('${order.id}')">
                        <i class="fas fa-eye"></i> Ver detalles
                    </button>
                    
                    ${order.status === 'SHIPPED' ? `
                        <button class="btn-track">
                            <i class="fas fa-truck"></i> Seguir envío
                        </button>
                    ` : ''}
                    
                    ${canCancel ? `
                        <button class="btn-cancel" onclick="showCancelModal('${order.id}')">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    ` : ''}
                    
                    ${order.status === 'DELIVERED' ? `
                        <button class="btn-reorder" onclick="reorderItems('${order.id}')">
                            <i class="fas fa-redo"></i> Volver a pedir
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        const statusMap = {
            'PROCESSING': 'processing',
            'CONFIRMED': 'confirmed',
            'PREPARING': 'preparing',
            'SHIPPED': 'shipped',
            'DELIVERED': 'delivered',
            'CANCELLED': 'cancelled'
        };
        return statusMap[status] || 'processing';
    }

    getStatusText(status) {
        const statusMap = {
            'PROCESSING': 'Procesando',
            'CONFIRMED': 'Confirmado',
            'PREPARING': 'Preparando',
            'SHIPPED': 'Enviado',
            'DELIVERED': 'Entregado',
            'CANCELLED': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    canCancelOrder(status) {
        return ['PROCESSING', 'CONFIRMED'].includes(status);
    }

    async showOrderDetail(orderId) {
        try {
            console.log('[Orders] 🔍 Cargando detalles de orden:', orderId);
            const response = await getOrderById(orderId);
            
            if (response.success === "true" && response.data) {
                const order = response.data;
                console.log('[Orders] ✅ Detalles de orden cargados:', order);
                this.renderOrderDetailModal(order);
                this.openOrderDetailModal();
            } else {
                alert('No se pudieron cargar los detalles del pedido');
            }
        } catch (error) {
            console.error('[Orders] ❌ Error al cargar detalles del pedido:', error);
            alert('Error al cargar los detalles del pedido');
        }
    }

    renderOrderDetailModal(order) {
        const orderDetailContent = document.getElementById('order-detail-content');
        if (!orderDetailContent) return;

        const orderDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        orderDetailContent.innerHTML = `
            <div class="detail-section">
                <h4>Información General</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>ID del Pedido</strong>
                        <span>#${order.id}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Fecha</strong>
                        <span>${orderDate}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Estado</strong>
                        <span>${this.getStatusText(order.status)}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Total</strong>
                        <span>$${parseFloat(order.totalAmount).toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Método de Pago</strong>
                        <span>${order.paymentMethod || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Estado de Pago</strong>
                        <span>${order.paymentStatus || 'N/A'}</span>
                    </div>
                </div>
            </div>

            ${order.shippingAddress ? `
                <div class="detail-section">
                    <h4>Dirección de Envío</h4>
                    <div class="detail-item">
                        <p>${order.shippingAddress}</p>
                    </div>
                </div>
            ` : ''}

            ${order.items && order.items.length > 0 ? `
                <div class="detail-section">
                    <h4>Productos (${order.items.length} items)</h4>
                    <div class="product-list">
                        ${order.items.map(item => `
                            <div class="product-item">
                                <img src="${item.productImage || '/src/assets/images/600.png'}" 
                                     alt="${item.productName}" 
                                     class="product-image"
                                     onerror="this.src='/src/assets/images/600.png'">
                                <div class="product-details">
                                    <h5>${item.productName}</h5>
                                    <p>Cantidad: ${item.quantity}</p>
                                    <p>Precio unitario: $${parseFloat(item.price).toLocaleString()}</p>
                                </div>
                                <div class="product-price">
                                    <div class="price">$${(parseFloat(item.price) * item.quantity).toLocaleString()}</div>
                                    <div class="quantity">${item.quantity} items</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="detail-section">
                <h4>Historial del Pedido</h4>
                <div class="order-timeline">
                    <div class="timeline-item completed">
                        <div class="timeline-content">
                            <h5>Pedido Creado</h5>
                            <p>${orderDate}</p>
                        </div>
                    </div>
                    ${order.status !== 'PROCESSING' ? `
                        <div class="timeline-item completed">
                            <div class="timeline-content">
                                <h5>Pedido Confirmado</h5>
                                <p>Tu pedido ha sido confirmado</p>
                            </div>
                        </div>
                    ` : ''}
                    ${['PREPARING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? `
                        <div class="timeline-item completed">
                            <div class="timeline-content">
                                <h5>Preparando Pedido</h5>
                                <p>Tu pedido está siendo preparado</p>
                            </div>
                        </div>
                    ` : ''}
                    ${['SHIPPED', 'DELIVERED'].includes(order.status) ? `
                        <div class="timeline-item completed">
                            <div class="timeline-content">
                                <h5>Pedido Enviado</h5>
                                <p>Tu pedido está en camino</p>
                            </div>
                        </div>
                    ` : ''}
                    ${order.status === 'DELIVERED' ? `
                        <div class="timeline-item completed">
                            <div class="timeline-content">
                                <h5>Pedido Entregado</h5>
                                <p>Tu pedido ha sido entregado exitosamente</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    showCancelModal(orderId) {
        this.selectedOrderId = orderId;
        const modal = document.getElementById('cancel-modal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            
            // Configurar botón de confirmación
            const confirmBtn = document.getElementById('confirm-cancel-btn');
            if (confirmBtn) {
                confirmBtn.onclick = () => this.confirmCancelOrder();
            }
        }
    }

    async confirmCancelOrder() {
        if (!this.selectedOrderId) return;

        try {
            console.log('[Orders] ❌ Cancelando orden:', this.selectedOrderId);
            const response = await cancelOrder(this.selectedOrderId);
            
            if (response.success === "true") {
                console.log('[Orders] ✅ Orden cancelada exitosamente');
                alert('Pedido cancelado exitosamente');
                this.closeCancelModal();
                await this.loadOrders(); // Recargar órdenes
            } else {
                alert(response.message || 'No se pudo cancelar el pedido');
            }
        } catch (error) {
            console.error('[Orders] ❌ Error al cancelar pedido:', error);
            alert('Error al cancelar el pedido');
        }
    }

    openOrderDetailModal() {
        const modal = document.getElementById('order-detail-modal');
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
        }
    }

    closeOrderDetailModal() {
        const modal = document.getElementById('order-detail-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    closeCancelModal() {
        const modal = document.getElementById('cancel-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
        this.selectedOrderId = null;
    }
}

// Función global para reordenar items
window.reorderItems = async function(orderId) {
    try {
        const orderService = new OrderService();
        const response = await orderService.getOrderById(orderId);
        
        if (response.success && response.data && response.data.items) {
            // Aquí implementarías la lógica para agregar los items al carrito
            // y redirigir al checkout o carrito
            console.log('Reordering items:', response.data.items);
            alert('Funcionalidad de reordenar en desarrollo');
        }
    } catch (error) {
        console.error('Error al reordenar:', error);
        alert('Error al procesar el reorden');
    }
};

// Inicializar la página cuando el DOM esté listo
let ordersPageInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    ordersPageInstance = new OrdersPage();
});

// Funciones globales para los onclick
window.showOrderDetail = function(orderId) {
    if (ordersPageInstance) {
        ordersPageInstance.showOrderDetail(orderId);
    }
};

window.showCancelModal = function(orderId) {
    if (ordersPageInstance) {
        ordersPageInstance.showCancelModal(orderId);
    }
};

window.closeOrderDetailModal = function() {
    if (ordersPageInstance) {
        ordersPageInstance.closeOrderDetailModal();
    }
};

window.closeCancelModal = function() {
    if (ordersPageInstance) {
        ordersPageInstance.closeCancelModal();
    }
};

window.reorderItems = function(orderId) {
    if (ordersPageInstance) {
        ordersPageInstance.reorderItems(orderId);
    }
};
