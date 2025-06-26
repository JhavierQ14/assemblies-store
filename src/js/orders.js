// orders.js
// Renderiza la última orden realizada en el historial de órdenes

document.addEventListener('DOMContentLoaded', function () {
  const orders = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
  if (!orders.length) return;
  // Ordenar por fecha descendente (más reciente primero)
  orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  const group = document.querySelector('.orders-group-content');
  if (!group) return;
  // Eliminar tarjetas de ejemplo (estáticas) antes de renderizar las reales
  document.querySelectorAll('.orders-group-content .order-card').forEach(card => card.remove());
  orders.forEach(order => {
    // Determinar estado de pago
    let status = 'pending';
    let statusText = '<i class="fas fa-clock"></i> Pendiente';
    let paymentIcon = '<i class="fas fa-money-bill"></i>';
    if (order.method === 'credit card' || order.method === 'debit card' || order.method === 'paypal') {
      status = 'paid';
      statusText = '<i class="fas fa-check-circle"></i> Pagado';
      paymentIcon = order.method === 'paypal' ? '<i class="fab fa-cc-paypal"></i>' : '<i class="fas fa-credit-card"></i>';
    }
    // Calcular total
    let total = 0;
    order.cart.forEach(p => {
      total += (p.subtotal || (p.price * p.qty));
    });
    // Productos (cada producto en su línea, como en los ejemplos)
    const productsHtml = order.cart.map(p =>
      p && p.name ? `<span class="order-product">${p.name}${p.qty ? ` <span class='qty'>x${p.qty}</span>` : ''}</span>` : ''
    ).filter(Boolean).join('');
    // Info
    const infoHtml = `
      <span><i class="fas fa-user"></i> ${order.user.name}</span>
      <span><i class="fas fa-map-marker-alt"></i> ${order.address.flat || ''}, ${order.address.street || ''}, ${order.address.city || ''}</span>
      <span>${paymentIcon} ${order.method === 'cash on delivery' ? 'Pago contra entrega' : (order.method === 'paypal' ? 'PayPal' : 'Tarjeta')}</span>
    `;
    // Contacto
    const contactHtml = `
      <span class="order-contact"><i class="fas fa-envelope"></i> ${order.user.email}</span>
      <span class="order-contact"><i class="fas fa-phone"></i> ${order.user.phone}</span>
    `;
    // Fecha
    const date = new Date(order.date);
    const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    // ID simple
    const id = '#ORD-' + date.toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*90+10);
    // Renderizar
    const card = document.createElement('div');
    card.className = `order-card order-${status}`;
    card.innerHTML = `
      <div class="order-header">
        <div class="order-status ${status}">${statusText}</div>
        <div class="order-date">${dateStr}</div>
        <div class="order-total">$${total}</div>
      </div>
      <div class="order-body">
        <div class="order-products">${productsHtml}</div>
        <div class="order-info">${infoHtml}</div>
      </div>
      <div class="order-footer">
        <span class="order-id">${id}</span>
        ${contactHtml}
      </div>
      <div class="order-actions">
        <button class="order-view-btn" title="Ver detalles"><i class="fas fa-eye"></i> Ver detalles</button>
      </div>
    `;
    group.appendChild(card);
    // Activar botón de ver detalles para la nueva orden
    card.querySelector('.order-view-btn').addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof mostrarModalOrden === 'function') mostrarModalOrden(card);
    });
  });
});
