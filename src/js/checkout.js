// checkout.js
// Lee los productos del carrito desde localStorage y los muestra en el checkout

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;

  // Limpiar productos de ejemplo
  cartItemsContainer.innerHTML = '<h3>Productos en tu carrito</h3>';

  // Leer productos del localStorage
  const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML += '<p>No hay productos en tu carrito.</p>';
  } else {
    cart.forEach(product => {
      cartItemsContainer.innerHTML += `
        <p><span class="name">${product.name}</span><span class="price">$${product.subtotal || (product.price * product.qty)}</span></p>
      `;
      total += product.subtotal || (product.price * product.qty);
    });
    cartItemsContainer.innerHTML += `
      <p class="grand-total"><span class="name">Total a pagar :</span> <span class="price">$${total}</span></p>
      <a href="cart.html" class="btn">Ver carrito</a>
    `;
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '<h3>Productos en tu carrito</h3>';

  const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML += '<p>No hay productos en tu carrito.</p>';
  } else {
    cart.forEach(product => {
      cartItemsContainer.innerHTML += `
        <p><span class="name">${product.name}</span><span class="price">$${product.subtotal || (product.price * product.qty)}</span></p>
      `;
      total += product.subtotal || (product.price * product.qty);
    });
    cartItemsContainer.innerHTML += `
      <p class="grand-total"><span class="name">Total a pagar :</span> <span class="price">$${total}</span></p>
      <a href="cart.html" class="btn secondary-btn">Ver carrito</a>
    `;
  }
});
