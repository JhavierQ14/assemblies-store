// Modal de producto reutilizable para home y store

function crearModalProducto({img, name, cat, price, qty}) {
  const modal = document.createElement('div');
  modal.className = 'product-modal-overlay';
  modal.innerHTML = `
    <div class="product-modal">
      <button class="product-modal-close" title="Cerrar">&times;</button>
      <div class="product-modal-img"><img src="${img}" alt="${name}"></div>
      <div class="product-modal-info">
        <div class="product-modal-cat">${cat}</div>
        <div class="product-modal-name">${name}</div>
        <div class="product-modal-price"><span>$</span>${price}<span>/-</span></div>
        <div class="product-modal-qty">Cantidad: ${qty || 1}</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.product-modal-close').onclick = () => modal.remove();
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

function obtenerDatosProducto(box) {
  return {
    img: box.querySelector('img')?.getAttribute('src') || '',
    name: box.querySelector('.name')?.textContent || '',
    cat: box.querySelector('.cat')?.textContent || '',
    price: box.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '',
    qty: box.querySelector('.qty')?.value || 1
  };
}

function inicializarModalesProducto() {
  document.querySelectorAll('.products .box .fa-eye').forEach(eye => {
    eye.addEventListener('click', function(e) {
      e.preventDefault();
      const box = eye.closest('.box');
      if (box) {
        crearModalProducto(obtenerDatosProducto(box));
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', inicializarModalesProducto);
document.addEventListener('storeProductsUpdated', inicializarModalesProducto);
