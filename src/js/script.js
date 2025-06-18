let navbar, profile;

// Función para inicializar eventos del header
function initializeHeader() {
   navbar = document.querySelector('.header .flex .navbar');
   profile = document.querySelector('.header .flex .profile');
   
   const menuBtn = document.querySelector('#menu-btn');
   const userBtn = document.querySelector('#user-btn');
   
   if (menuBtn) {
      menuBtn.onclick = () => {
         navbar?.classList.toggle('active');
         profile?.classList.remove('active');
      }
   }
   
   if (userBtn) {
      userBtn.onclick = () => {
         profile?.classList.toggle('active');
         navbar?.classList.remove('active');
      }
   }
}

document.addEventListener('headerLoaded', initializeHeader);
document.addEventListener('DOMContentLoaded', initializeHeader);

window.onscroll = () => {
   profile?.classList.remove('active');
   navbar?.classList.remove('active');
}

function loader(){
   const loaderElement = document.querySelector('.loader');
   if (loaderElement) {
      loaderElement.style.display = 'none';
   }
}

function fadeOut(){
   setInterval(loader, 2000);
}

window.onload = fadeOut;

function actualizarContadorCarrito() {
   const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
   let totalItems = 0;
   cart.forEach(product => {
      totalItems += product.qty || 1;
   });
   
   // CONSOLE LOG AGREGADO
   console.log('📊 ACTUALIZAR CONTADOR - Productos en localStorage:', cart);
   console.log('📊 ACTUALIZAR CONTADOR - Total items calculado:', totalItems);
   
   const cartIcon = document.querySelector('.fa-shopping-cart');
   if (cartIcon) {
      let span = cartIcon.querySelector('span');
      if (!span) {
         span = document.createElement('span');
         cartIcon.appendChild(span);
      }
      span.textContent = totalItems > 0 ? `(${totalItems})` : '';
      span.style.display = totalItems > 0 ? '' : 'none';
      
      console.log('📊 ACTUALIZAR CONTADOR - Texto del span:', span.textContent);
   } else {
      console.log('❌ ACTUALIZAR CONTADOR - No se encontró el ícono del carrito');
   }
}

// Función global para agregar productos
function agregarAlCarrito(name, img, price, qty) {
   let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
   const idx = cart.findIndex(p => p.name === name);
   
   if (idx >= 0) {
      cart[idx].qty += qty;
   } else {
      cart.push({ name, img, price, qty });
   }
   
   localStorage.setItem('cartItems', JSON.stringify(cart));
   
   // CONSOLE LOG AGREGADO
   console.log('🛒 AGREGAR - Productos en localStorage:', cart);
   console.log('🛒 AGREGAR - Total items:', cart.reduce((total, item) => total + item.qty, 0));
   
   actualizarContadorCarrito();
   mostrarAlertaCarrito('Producto agregado al carrito');
}

// Inicializar eventos de carrito
function initializeCartEvents() {
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
            
            agregarAlCarrito(name, img, price, qty);
         });
      }
   });
}

document.addEventListener('DOMContentLoaded', function() {
   initializeCartEvents();
   actualizarContadorCarrito();
});

document.addEventListener('headerLoaded', function() {
   setTimeout(actualizarContadorCarrito, 100);
});

window.actualizarContadorCarrito = actualizarContadorCarrito;
window.agregarAlCarrito = agregarAlCarrito;

// Alerta personalizada
function mostrarAlertaCarrito(mensaje) {
   let alerta = document.createElement('div');
   alerta.innerHTML = `<i class="fas fa-check-circle" style="margin-right:10px;"></i> ${mensaje}`;
   alerta.style.cssText = `
      position: fixed; top: 32px; left: 50%; transform: translateX(-50%);
      background: linear-gradient(90deg, #1cb5e0 0%, #185ea9 100%);
      color: #fff; padding: 1.3rem 2.7rem; border-radius: 2rem;
      font-size: 1.7rem; font-weight: 600; z-index: 9999;
      box-shadow: 0 4px 24px 0 rgba(80,100,120,0.18);
      display: flex; align-items: center; gap: 0.7rem;
      opacity: 0.98; transition: opacity 0.4s;
   `;
   document.body.appendChild(alerta);
   setTimeout(() => {
      alerta.style.opacity = '0';
      setTimeout(() => alerta.remove(), 400);
   }, 1600);
}

