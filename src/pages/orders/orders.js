document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('orders-list');
  if (!container) return;
  const orders = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
  if (!orders.length) {
    container.innerHTML = '<p>No hay pedidos todavía.</p>';
    return;
  }
  container.innerHTML = '';
  orders.reverse().forEach((order, idx) => {
    const el = document.createElement('div');
    el.className = 'order-item';
    el.innerHTML = `
      <div class="order-header">
        <span>Pedido #${orders.length - idx}</span>
        <span>${new Date(order.date).toLocaleString()}</span>
        <button class="view-order" data-index="${orders.length - idx - 1}">Ver</button>
      </div>
    `;
    container.appendChild(el);
  });
  container.addEventListener('click', function (e) {
    if (e.target.matches('.view-order')) {
      const idx = parseInt(e.target.dataset.index, 10);
      const order = orders[idx];
      if (!order) return;
      localStorage.setItem('selectedOrder', JSON.stringify(order));
      window.location.href = 'order.html';
    }
  });
});
