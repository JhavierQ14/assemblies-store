document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('viewall-container');
  if (!container) return;
  const products = JSON.parse(localStorage.getItem('products_list') || '[]');
  if (!products.length) {
    container.innerHTML = '<p>No hay productos para mostrar.</p>';
    return;
  }
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img || '../images/loader.gif'}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
    </div>
  `).join('');
});
