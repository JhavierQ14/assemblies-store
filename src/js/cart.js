document.addEventListener('DOMContentLoaded', () => {
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewImg = document.getElementById('quickViewImg');
    const quickViewName = document.getElementById('quickViewName');
    const quickViewSpecs = document.getElementById('quickViewSpecs');
    const quickViewPrice = document.getElementById('quickViewPrice');
    const closeModal = document.getElementById('closeQuickView');

    // Agrega listener a cada botón de "ver producto"
    document.querySelectorAll('.box').forEach((box) => {
      const viewBtn = box.querySelector('.fa-eye');
      const img = box.querySelector('img').src;
      const name = box.querySelector('.name').textContent;
      const price = box.querySelector('.price').textContent.trim();

      // Texto personalizado de especificaciones (puedes hacerlo dinámico si deseas)
      let specs = '';
      if (name.includes('RAM')) {
        specs = 'DDR5 | 16GB | 5200MHz | Corsair Vengeance';
      } else if (name.includes('Procesador')) {
        specs = '13ª Gen | 16 núcleos | 5.4GHz Turbo | Socket LGA1700';
      } else if (name.includes('SSD')) {
        specs = '1TB | PCIe 4.0 NVMe | 7000MB/s | Samsung 980 PRO';
      } else {
        specs = 'Especificaciones no disponibles.';
      }

      viewBtn.addEventListener('click', () => {
        quickViewImg.src = img;
        quickViewName.textContent = name;
        quickViewSpecs.textContent = specs;
        quickViewPrice.textContent = price;
        quickViewModal.style.display = 'flex';
      });
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
      quickViewModal.style.display = 'none';
    });

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', (e) => {
      if (e.target === quickViewModal) {
        quickViewModal.style.display = 'none';
      }
    });

    function actualizarTotales() {
      let total = 0;
      document.querySelectorAll('.box').forEach((box) => {
        const qtyInput = box.querySelector('.qty');
        const priceDiv = box.querySelector('.price');
        const subTotalDiv = box.querySelector('.sub-total span');
        if (!qtyInput || !priceDiv || !subTotalDiv) return;
        // Extrae el número del precio (puede tener $ y otros caracteres)
        const price = parseFloat(priceDiv.textContent.replace(/[^\d.]/g, ''));
        const qty = parseInt(qtyInput.value) || 0;
        const subTotal = price * qty;
        subTotalDiv.textContent = `$${subTotal}`;
        total += subTotal;
      });
      // Actualiza el total a pagar
      const totalLabel = document.querySelector('.cart-total p span');
      if (totalLabel) {
        totalLabel.textContent = `$${total}`;
      }
    }

    // --- ACTUALIZAR TOTAL EN TIEMPO REAL EN <div class="cart-total"> ---
    function actualizarTotalCartTotal() {
      let total = 0;
      document.querySelectorAll('.box').forEach((box) => {
        const qtyInput = box.querySelector('.qty');
        const priceDiv = box.querySelector('.price');
        if (!qtyInput || !priceDiv) return;
        const price = parseFloat(priceDiv.textContent.replace(/[^\d.]/g, ''));
        const qty = parseInt(qtyInput.value) || 0;
        total += price * qty;
      });
      const totalLabel = document.querySelector('.cart-total p span');
      if (totalLabel) totalLabel.textContent = `$${total}`;
    }
    // Llamar en cada cambio de cantidad
    document.addEventListener('input', function(e) {
      if (e.target.classList.contains('qty')) {
        actualizarTotalCartTotal();
      }
    });
    // Llamar también al eliminar productos
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('fa-times') || e.target.classList.contains('delete-btn')) {
        setTimeout(actualizarTotalCartTotal, 100);
      }
    });
    // Llamar al cargar
    actualizarTotalCartTotal();

    // Ejecutar al cargar
    actualizarTotales();

    // Listeners para inputs de cantidad
    document.querySelectorAll('.box .qty').forEach((input) => {
      input.addEventListener('input', actualizarTotales);
      input.addEventListener('change', actualizarTotales);
    });

    // Eliminar producto individual
    document.querySelectorAll('.box .fa-times').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const box = btn.closest('.box');
        if (box) {
          box.remove();
          actualizarTotales();
          mostrarAlertaCarrito('Producto eliminado del carrito', 'delete');
          // Si ya no hay productos, mostrar mensaje de carrito vacío
          setTimeout(() => {
            const boxContainer = document.querySelector('.box-container');
            if (document.querySelectorAll('.box').length === 0 && boxContainer) {
              boxContainer.innerHTML = '<p style="text-align:center;font-size:1.7rem;color:#b71c1c;">No hay productos en tu carrito.</p>';
            }
          }, 200);
        }
      });
    });

    // Eliminar todo el carrito
    const deleteAllBtn = document.querySelector('.more-btn .delete-btn');
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarConfirmacionCarrito('¿Estás seguro que deseas eliminar todo el carrito?', () => {
          document.querySelectorAll('.box').forEach((box) => box.remove());
          actualizarTotales();
          mostrarAlertaCarrito('Todos los productos fueron eliminados', 'delete');
        });
      });
    }

    // Guardar productos del carrito en localStorage al finalizar compra
    const finalizarCompraBtn = document.querySelector('.cart-total .btn');
    if (finalizarCompraBtn) {
      finalizarCompraBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir navegación inmediata
        // Recolectar productos actuales del carrito
        const productos = [];
        document.querySelectorAll('.box').forEach((box) => {
          const name = box.querySelector('.name')?.textContent || '';
          const img = box.querySelector('img')?.src || '';
          const price = parseFloat(box.querySelector('.price')?.textContent.replace(/[^\d.]/g, '') || '0');
          const qty = parseInt(box.querySelector('.qty')?.value || '1');
          const subtotal = price * qty;
          if (qty > 0) {
            productos.push({ name, img, price, qty, subtotal });
          }
        });
        localStorage.setItem('checkoutCart', JSON.stringify(productos));
        // Limpiar el carrito persistente después de finalizar compra
        localStorage.removeItem('cartItems');
        if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
        window.location.href = 'checkout.html'; // Redirigir manualmente
      });
    }

    // Si no hay productos en el carrito, mostrar mensaje y ocultar productos
    function mostrarCarritoVacioSiNoHayProductos() {
      const boxContainer = document.querySelector('.box-container');
      const cartTotal = document.querySelector('.cart-total');
      const moreBtn = document.querySelector('.more-btn');
      // Leer carrito persistente
      let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (cart.length === 0) {
        if (boxContainer) boxContainer.innerHTML = '<p style="text-align:center;font-size:1.7rem;color:#b71c1c;">No hay productos en tu carrito.</p>';
        if (cartTotal) cartTotal.style.display = 'none';
        if (moreBtn) moreBtn.style.display = 'none';
      } else {
        if (cartTotal) cartTotal.style.display = '';
        if (moreBtn) moreBtn.style.display = '';
      }
    }
    mostrarCarritoVacioSiNoHayProductos();
    // Llamar también después de eliminar productos
    document.querySelectorAll('.box .fa-times').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(mostrarCarritoVacioSiNoHayProductos, 100);
      });
    });
    const deleteAllBtn2 = document.querySelector('.more-btn .delete-btn');
    if (deleteAllBtn2) {
      deleteAllBtn2.addEventListener('click', () => {
        setTimeout(mostrarCarritoVacioSiNoHayProductos, 100);
      });
    }

    // --- NUEVO: Reasignar listeners y mantener funcionalidad tras poblar dinámicamente ---
    function listenersCarrito() {
      // Vista rápida
      document.querySelectorAll('.box').forEach((box) => {
        const viewBtn = box.querySelector('.fa-eye');
        const img = box.querySelector('img').src;
        const name = box.querySelector('.name').textContent;
        const price = box.querySelector('.price').textContent.trim();
        let specs = '';
        if (name.includes('RAM')) specs = 'DDR5 | 16GB | 5200MHz | Corsair Vengeance';
        else if (name.includes('Procesador')) specs = '13ª Gen | 16 núcleos | 5.4GHz Turbo | Socket LGA1700';
        else if (name.includes('SSD')) specs = '1TB | PCIe 4.0 NVMe | 7000MB/s | Samsung 980 PRO';
        else specs = 'Especificaciones no disponibles.';
        if (viewBtn) {
          viewBtn.onclick = () => {
            quickViewImg.src = img;
            quickViewName.textContent = name;
            quickViewSpecs.textContent = specs;
            quickViewPrice.textContent = price;
            quickViewModal.style.display = 'flex';
          };
        }
      });
      // Cerrar modal
      if (closeModal) closeModal.onclick = () => { quickViewModal.style.display = 'none'; };
      window.onclick = (e) => { if (e.target === quickViewModal) quickViewModal.style.display = 'none'; };

      // Sumatoria y actualización de localStorage
      function actualizarTotalesYStorage() {
        let total = 0;
        let nuevos = [];
        document.querySelectorAll('.box').forEach((box) => {
          const qtyInput = box.querySelector('.qty');
          const priceDiv = box.querySelector('.price');
          const name = box.querySelector('.name').textContent;
          const img = box.querySelector('img').src;
          const price = parseFloat(priceDiv.textContent.replace(/[^\d.]/g, ''));
          const qty = parseInt(qtyInput.value) || 0;
          const subTotalDiv = box.querySelector('.sub-total span');
          const subTotal = price * qty;
          if (subTotalDiv) subTotalDiv.textContent = `$${subTotal}`;
          total += subTotal;
          if (qty > 0) nuevos.push({ name, img, price, qty });
        });
        localStorage.setItem('cartItems', JSON.stringify(nuevos));
        if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
        const totalLabel = document.querySelector('.cart-total p span');
        if (totalLabel) totalLabel.textContent = `$${total}`;
      }
      actualizarTotalesYStorage();
      document.querySelectorAll('.box .qty').forEach((input) => {
        input.oninput = actualizarTotalesYStorage;
        input.onchange = actualizarTotalesYStorage;
      });
      // Eliminar producto individual
      document.querySelectorAll('.box .fa-times').forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const box = btn.closest('.box');
          if (box) {
            box.remove();
            actualizarTotalesYStorage();
            mostrarAlertaCarrito('Producto eliminado del carrito', 'delete');
            // Si ya no hay productos, mostrar mensaje de carrito vacío
            setTimeout(() => {
              const boxContainer = document.querySelector('.box-container');
              if (document.querySelectorAll('.box').length === 0 && boxContainer) {
                boxContainer.innerHTML = '<p style="text-align:center;font-size:1.7rem;color:#b71c1c;">No hay productos en tu carrito.</p>';
              }
            }, 200);
          }
        };
      });
      // Eliminar todo el carrito
      const deleteAllBtn = document.querySelector('.more-btn .delete-btn');
      if (deleteAllBtn) {
        deleteAllBtn.onclick = (e) => {
          e.preventDefault();
          mostrarConfirmacionCarrito('¿Estás seguro que deseas eliminar todo el carrito?', () => {
            document.querySelectorAll('.box').forEach((box) => box.remove());
            actualizarTotalesYStorage();
            mostrarCarritoVacioSiNoHayProductos();
          });
        };
      }
    }

    // Al cargar el carrito, poblar los productos desde localStorage (cartItems)
    function poblarCarritoDesdeStorage() {
      const boxContainer = document.querySelector('.box-container');
      if (!boxContainer) return;
      let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
      if (cart.length === 0) return;
      boxContainer.innerHTML = '';
      cart.forEach(product => {
        boxContainer.innerHTML += `
          <div class="box">
            <button type="button" class="fas fa-eye"></button>
            <button class="fas fa-times" type="button" name="delete"></button>
            <img src="${product.img}" alt="">
            <div class="name">${product.name}</div>
            <div class="flex">
              <div class="price"><span>$</span>${product.price}</div>
              <input type="number" name="qty" class="qty" min="1" max="99" value="${product.qty}" onkeypress="if(this.value.length == 2) return false;">
              <button type="button" class="fas fa-edit"></button>
            </div>
            <div class="sub-total">sub total : <span>$${product.price * product.qty}</span></div>
          </div>
        `;
      });
      listenersCarrito(); // Reasignar listeners y funcionalidad
    }
    poblarCarritoDesdeStorage();
  });

// --- ALERTA PERSONALIZADA BONITA ---
function mostrarAlertaCarrito(mensaje, tipo = 'success') {
  let alerta = document.createElement('div');
  let icono = tipo === 'success'
    ? '<i class="fas fa-check-circle" style="margin-right:10px;"></i>'
    : '<i class="fas fa-trash-alt" style="margin-right:10px;"></i>';
  alerta.innerHTML = `
    ${icono} ${mensaje}
  `;
  alerta.style.position = 'fixed';
  alerta.style.top = '32px';
  alerta.style.left = '50%';
  alerta.style.transform = 'translateX(-50%)';
  alerta.style.background = tipo === 'success'
    ? 'linear-gradient(90deg, #1cb5e0 0%, #185ea9 100%)'
    : 'linear-gradient(90deg, #e74c3c 0%, #b71c1c 100%)';
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

// --- ALERTA DE CONFIRMACIÓN BONITA ---
function mostrarConfirmacionCarrito(mensaje, onConfirm) {
  // Fondo oscuro
  let overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(34,46,58,0.35)';
  overlay.style.zIndex = '9998';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Caja de confirmación
  let box = document.createElement('div');
  box.style.background = '#fff';
  box.style.borderRadius = '1.5rem';
  box.style.boxShadow = '0 8px 32px 0 rgba(80,100,120,0.18)';
  box.style.padding = '2.2rem 2.5rem 2rem 2.5rem';
  box.style.maxWidth = '95vw';
  box.style.minWidth = '320px';
  box.style.display = 'flex';
  box.style.flexDirection = 'column';
  box.style.alignItems = 'center';
  box.style.gap = '1.2rem';
  box.innerHTML = `
    <div style="font-size:2.2rem;color:#b71c1c;"><i class='fas fa-exclamation-triangle'></i></div>
    <div style="font-size:1.5rem;color:#185ea9;text-align:center;">${mensaje}</div>
    <div style="display:flex;gap:1.2rem;margin-top:0.7rem;">
      <button id="btnConfirmarEliminar" style="background:linear-gradient(90deg,#e74c3c 0%,#b71c1c 100%);color:#fff;padding:0.8rem 2.2rem;border:none;border-radius:1.2rem;font-size:1.2rem;font-weight:600;cursor:pointer;">Sí, eliminar</button>
      <button id="btnCancelarEliminar" style="background:linear-gradient(90deg,#e3e9f7 60%,#f8fafc 100%);color:#185ea9;padding:0.8rem 2.2rem;border:none;border-radius:1.2rem;font-size:1.2rem;font-weight:600;cursor:pointer;">Cancelar</button>
    </div>
  `;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  // Eventos
  box.querySelector('#btnConfirmarEliminar').onclick = () => {
    document.body.removeChild(overlay);
    onConfirm();
  };
  box.querySelector('#btnCancelarEliminar').onclick = () => {
    document.body.removeChild(overlay);
  };
}