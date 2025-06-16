let navbar = document.querySelector('.header .flex .navbar');
let profile = document.querySelector('.header .flex .profile');

document.querySelector('#menu-btn').onclick = () =>{
   navbar.classList.toggle('active');
   profile.classList.remove('active');
}

document.querySelector('#user-btn').onclick = () =>{
   profile.classList.toggle('active');
   navbar.classList.remove('active');
}

window.onscroll = () =>{
   profile.classList.remove('active');
   navbar.classList.remove('active');
}

function loader(){
   document.querySelector('.loader').style.display = 'none';
}

function fadeOut(){
   setInterval(loader, 2000);
}

window.onload = fadeOut;

// Vista rápida de producto en carrito

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('quickViewModal');
  const closeBtn = document.getElementById('closeQuickView');
  const img = document.getElementById('quickViewImg');
  const name = document.getElementById('quickViewName');
  const specs = document.getElementById('quickViewSpecs');
  const price = document.getElementById('quickViewPrice');

  // Especificaciones de ejemplo (puedes adaptar a tu backend/datos reales)
  const productSpecs = {
    'Memoria RAM DDR5 Corsair 16GB': 'Tipo: DDR5\nCapacidad: 16GB\nVelocidad: 5200MHz\nMarca: Corsair',
    'Procesador Intel Core i7-13700K': 'Núcleos: 16 (8P+8E)\nFrecuencia: 3.4GHz\nSocket: LGA1700\nGráficos integrados: Sí',
    'SSD Samsung 980 PRO 1TB': 'Tipo: NVMe M.2\nCapacidad: 1TB\nLectura: 7000MB/s\nMarca: Samsung'
  };

  // Selecciona solo los botones de vista rápida
  document.querySelectorAll('.products .box .fa-eye').forEach(function(eyeBtn) {
    eyeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const box = eyeBtn.closest('.box');
      const imgSrc = box.querySelector('img').getAttribute('src');
      const prodName = box.querySelector('.name').textContent;
      const prodPrice = box.querySelector('.price').textContent;
      img.setAttribute('src', imgSrc);
      name.textContent = prodName;
      specs.textContent = productSpecs[prodName] || 'Especificaciones no disponibles.';
      price.textContent = prodPrice;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    img.setAttribute('src', '');
    name.textContent = '';
    specs.textContent = '';
    price.textContent = '';
  });

  // Cerrar modal al hacer click fuera del contenido
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      img.setAttribute('src', '');
      name.textContent = '';
      specs.textContent = '';
      price.textContent = '';
    }
  });

    // Mostrar cantidad real de productos en el menú superior
    function actualizarContadorCarrito() {
      // Leer productos del localStorage (checkoutCart)
      const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
      let totalItems = 0;
      cart.forEach(product => {
        totalItems += product.qty || 1;
      });
      // Buscar el icono del carrito en el menú superior
      const cartIcon = document.querySelector('.fa-shopping-cart');
      if (cartIcon) {
        let span = cartIcon.querySelector('span');
        if (!span) {
          span = document.createElement('span');
          cartIcon.appendChild(span);
        }
        span.textContent = `(${totalItems})`;
        span.style.display = totalItems > 0 ? '' : 'none';
      }
    }
    actualizarContadorCarrito();
    // Actualizar el contador cuando se agregue o elimine producto
    window.addEventListener('storage', actualizarContadorCarrito);
});

// --- SISTEMA DE CARRITO PERSISTENTE ---

// Agregar producto al carrito desde cualquier página (formularios .products .box)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.products .box').forEach(function(box) {
    const form = box.tagName === 'FORM' ? box : null;
    const addBtn = box.querySelector('.fa-shopping-cart, [name="add_to_cart"]');
    if (form && addBtn) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = box.querySelector('.name')?.textContent || '';
        const img = box.querySelector('img')?.getAttribute('src') || '';
        const price = parseFloat(box.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '0');
        const qty = parseInt(box.querySelector('.qty')?.value || '1');
        // Leer carrito actual
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        // Si ya existe, sumar cantidad
        const idx = cart.findIndex(p => p.name === name);
        if (idx >= 0) {
          cart[idx].qty += qty;
        } else {
          cart.push({ name, img, price, qty });
        }
        localStorage.setItem('cartItems', JSON.stringify(cart));
        actualizarContadorCarrito();
        mostrarAlertaCarrito('Producto agregado al carrito');
      });
    }
  });

  // Contador real de productos en el menú superior
  function actualizarContadorCarrito() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    let totalItems = 0;
    cart.forEach(product => {
      totalItems += product.qty || 1;
    });
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
      let span = cartIcon.querySelector('span');
      if (!span) {
        span = document.createElement('span');
        cartIcon.appendChild(span);
      }
      span.textContent = `(${totalItems})`;
      span.style.display = totalItems > 0 ? '' : 'none';
    }
    // Actualizar el total a pagar en el carrito si existe
    const totalLabel = document.querySelector('.cart-total p span');
    if (totalLabel) {
      let total = 0;
      cart.forEach(product => {
        total += (product.price || 0) * (product.qty || 0);
      });
      totalLabel.textContent = `$${total}`;
    }
  }
  window.actualizarContadorCarrito = actualizarContadorCarrito;
  actualizarContadorCarrito();
  window.addEventListener('storage', actualizarContadorCarrito);
});

// --- ALERTA PERSONALIZADA BONITA ---
function mostrarAlertaCarrito(mensaje) {
  let alerta = document.createElement('div');
  alerta.innerHTML = `
    <i class="fas fa-check-circle" style="margin-right:10px;"></i> ${mensaje}
  `;
  alerta.style.position = 'fixed';
  alerta.style.top = '32px';
  alerta.style.left = '50%';
  alerta.style.transform = 'translateX(-50%)';
  alerta.style.background = 'linear-gradient(90deg, #1cb5e0 0%, #185ea9 100%)';
  alerta.style.color = '#fff';
  alerta.style.padding = '1.3rem 2.7rem';
  alerta.style.borderRadius = '2rem';
  alerta.style.fontSize = '1.7rem';
  alerta.style.fontWeight = '600';
  alerta.style.boxShadow = '0 4px 24px 0 rgba(80,100,120,0.18)';
  alerta.style.zIndex = '9999';
  alerta.style.opacity = '0.98';
  alerta.style.display = 'flex';
  alerta.style.alignItems = 'center';
  alerta.style.gap = '0.7rem';
  alerta.style.letterSpacing = '0.5px';
  alerta.style.transition = 'opacity 0.4s';
  document.body.appendChild(alerta);
  setTimeout(() => {
    alerta.style.opacity = '0';
    setTimeout(() => alerta.remove(), 400);
  }, 1600);
}

