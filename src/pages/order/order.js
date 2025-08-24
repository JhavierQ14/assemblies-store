document.addEventListener('DOMContentLoaded', function () {
  const order = JSON.parse(localStorage.getItem('selectedOrder') || localStorage.getItem('lastOrder') || 'null');
  const container = document.getElementById('order-details');
  if (!container || !order) return;
  container.innerHTML = '';
  const items = order.cart || [];
  let total = 0;
  items.forEach(it => { total += it.subtotal || (it.price * it.qty); });
  container.innerHTML = `
    <h3>Pedido - ${new Date(order.date).toLocaleString()}</h3>
    <p>Método: ${order.method || 'N/A'}</p>
    <div class="order-items">
      ${items.map(i => `<div class="order-row"><img src="${i.img || '../images/loader.gif'}"/><div><strong>${i.name}</strong><div>${i.qty} x $${i.price}</div></div><div>$${i.subtotal || (i.price * i.qty)}</div></div>`).join('')}
    </div>
    <div class="order-total">Total: $${total}</div>
  `;
});
