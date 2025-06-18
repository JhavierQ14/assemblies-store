// Modal de detalles de orden para historial de compras


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.order-view-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = btn.closest('.order-card');
      if (!card) return;
      mostrarModalOrden(card);
    });
  });
});


function mostrarModalOrden(card) {
  // Extraer datos de la orden
  const status = card.querySelector('.order-status')?.textContent.trim() || '';
  const statusClass = card.querySelector('.order-status')?.classList[1] || '';
  const date = card.querySelector('.order-date')?.textContent.trim() || '';
  const total = card.querySelector('.order-total')?.textContent.trim() || '';
  const id = card.querySelector('.order-id')?.textContent.trim() || '';
  const products = Array.from(card.querySelectorAll('.order-product')).map(p => p.innerHTML);
  const info = Array.from(card.querySelectorAll('.order-info span')).map(s => s.innerHTML);
  const contacts = Array.from(card.querySelectorAll('.order-contact')).map(s => s.innerHTML);


  // Simulación de estado extra
  let estadoEnvio = '';
  if (status.toLowerCase().includes('pendiente')) {
    estadoEnvio = '<span class="order-modal-status pending"><i class="fas fa-truck"></i> Procesando, aún no enviado</span>';
  } else if (status.toLowerCase().includes('pagado')) {
    estadoEnvio = '<span class="order-modal-status shipped"><i class="fas fa-truck"></i> En camino</span>';
  } else {
    estadoEnvio = '';
  }


  // Modal HTML
  const modal = document.createElement('div');
  modal.className = 'order-modal-overlay';
  modal.innerHTML = `
    <div class="order-modal">
      <button class="order-modal-close" title="Cerrar">&times;</button>
      <div class="order-modal-status ${statusClass}"><i class="fas fa-info-circle"></i> ${status}</div>
      ${estadoEnvio}
      <div class="order-modal-title">${date} &mdash; <span style='color:var(--yellow);font-weight:600;'>${total}</span></div>
      <div class="order-modal-products">
        ${products.map(p => `<div class='order-modal-product'>${p}</div>`).join('')}
      </div>
      <div class="order-modal-info">
        ${info.map(i => `<div>${i}</div>`).join('')}
      </div>
      <div class="order-modal-footer">
        <span class="order-modal-id">${id}</span>
        ${contacts.map(c => `<span class='order-modal-contact'>${c}</span>`).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // Cerrar modal
  modal.querySelector('.order-modal-close').onclick = () => modal.remove();
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
}



