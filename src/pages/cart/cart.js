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
        const price = parseFloat(priceDiv.textContent.replace(/[^\d.]/g, ''));
        const qty = parseInt(qtyInput.value) || 0;
        const subTotal = price * qty;
        subTotalDiv.textContent = `$${subTotal}`;
        total += subTotal;
      });
      const totalLabel = document.querySelector('.cart-total p span');
      if (totalLabel) {
        totalLabel.textContent = `$${total}`;
      }
    }

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
    document.addEventListener('input', function(e) {
      if (e.target.classList.contains('qty')) {
        actualizarTotalCartTotal();
      }
    });
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('fa-times') || e.target.classList.contains('delete-btn')) {
        setTimeout(actualizarTotalCartTotal, 100);
      }
    });
    actualizarTotalCartTotal();
    actualizarTotales();

    document.querySelectorAll('.box .qty').forEach((input) => {
      input.addEventListener('input', actualizarTotales);
      input.addEventListener('change', actualizarTotales);
    });

    document.querySelectorAll('.box .fa-times').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const box = btn.closest('.box');
        if (box) {
          const nombre = box.querySelector('.name').textContent;
          let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
          cart = cart.filter(item => item.name !== nombre);
          localStorage.setItem('cartItems', JSON.stringify(cart));
          poblarCarritoDesdeStorage();
          if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
          mostrarAlertaCarrito('Producto eliminado del carrito', 'delete');
        }
      });
    });

    const deleteAllBtn = document.querySelector('.more-btn .delete-btn');
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarConfirmacionCarrito('\u00bfEst\u00e1s seguro que deseas eliminar todo el carrito?', () => {
          localStorage.removeItem('cartItems');
          poblarCarritoDesdeStorage();
          if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
          mostrarAlertaCarrito('Todos los productos fueron eliminados', 'delete');
        });
      });
    }

    const finalizarCompraBtn = document.querySelector('.cart-total .btn');
    if (finalizarCompraBtn) {
      finalizarCompraBtn.addEventListener('click', (e) => {
        e.preventDefault();
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
        localStorage.removeItem('cartItems');
        if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
        window.location.href = 'checkout.html';
      });
    }

    function mostrarCarritoVacioSiNoHayProductos() {
      const boxContainer = document.querySelector('.box-container');
      const cartTotal = document.querySelector('.cart-total');
      const moreBtn = document.querySelector('.more-btn');
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

    function listenersCarrito() {
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
      if (closeModal) closeModal.onclick = () => { quickViewModal.style.display = 'none'; };
      window.onclick = (e) => { if (e.target === quickViewModal) quickViewModal.style.display = 'none'; };

      function actualizarTotalesYStorage() {
        let total = 0;
        let nuevos = [];
        document.querySelectorAll('.box').forEach((box) => {
          const qtyInput = box.querySelector('.qty');
          const priceDiv = box.querySelector('.price');
          const nameEl = box.querySelector('.name');
          const imgEl = box.querySelector('img');
          const subTotalDiv = box.querySelector('.sub-total span');
          if (!qtyInput || !priceDiv || !nameEl || !imgEl) {
             console.warn('\u26a0\ufe0f Elemento incompleto encontrado, saltando...', box);
             return;
          }
          const name = nameEl.textContent;
          const img = imgEl.src;
          const price = parseFloat(priceDiv.textContent.replace(/[^\\d.]/g, ''));
          const qty = parseInt(qtyInput.value) || 0;
          const subTotal = price * qty;
          if (subTotalDiv) subTotalDiv.textContent = `$${subTotal}`;
          total += subTotal;
          if (qty > 0) {
             nuevos.push({ name, img, price, qty });
          }
        });
        localStorage.setItem('cartItems', JSON.stringify(nuevos));
        console.log('\ud83d\uddd1\ufe0f ACTUALIZAR TOTALES - Productos despu\u00e9s de cambio:', nuevos);
        console.log('\ud83d\uddd1\ufe0f ACTUALIZAR TOTALES - Total items:', nuevos.reduce((total, item) => total + item.qty, 0));
        setTimeout(() => { if (window.actualizarContadorCarrito) { window.actualizarContadorCarrito(); } }, 100);
        const totalLabel = document.querySelector('.cart-total p span');
        if (totalLabel) totalLabel.textContent = `$${total}`;
      }
      actualizarTotalesYStorage();
      document.querySelectorAll('.box .qty').forEach((input) => {
        input.oninput = () => {
          actualizarTotalesYStorage();
          if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
        };
        input.onchange = () => {
          actualizarTotalesYStorage();
          if (window.actualizarContadorCarrito) window.actualizarContadorCarrito();
        };
      });
      document.querySelectorAll('.box .fa-times').forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const box = btn.closest('.box');
          if (box) {
            const productName = box.querySelector('.name').textContent;
            console.log('\u274c ELIMINAR INDIVIDUAL - Producto a eliminar:', productName);
            console.log('\u274c ELIMINAR INDIVIDUAL - Estado ANTES:', JSON.parse(localStorage.getItem('cartItems') || '[]'));
            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            cart = cart.filter(item => item.name !== productName);
            localStorage.setItem('cartItems', JSON.stringify(cart));
            box.remove();
            actualizarTotalesYStorage();
            setTimeout(() => { if (window.actualizarContadorCarrito) window.actualizarContadorCarrito(); }, 100);
            mostrarAlertaCarrito('Producto eliminado del carrito', 'delete');
            setTimeout(() => {
              const boxContainer = document.querySelector('.box-container');
              if (document.querySelectorAll('.box').length === 0 && boxContainer) {
                boxContainer.innerHTML = '<p style="text-align:center;font-size:1.7rem;color:#b71c1c;">No hay productos en tu carrito.</p>';
                const cartTotal = document.querySelector('.cart-total');
                const moreBtn = document.querySelector('.more-btn');
                if (cartTotal) cartTotal.style.display = 'none';
                if (moreBtn) moreBtn.style.display = 'none';
              }
            }, 200);
          }
        };
      });
      const deleteAllBtn = document.querySelector('.more-btn .delete-btn');
      if (deleteAllBtn) {
        deleteAllBtn.onclick = (e) => {
          e.preventDefault();
          mostrarConfirmacionCarrito('\u00bfEst\u00e1s seguro que deseas eliminar todo el carrito?', () => {
            document.querySelectorAll('.box').forEach((box) => box.remove());
            localStorage.removeItem('cartItems');
          });
        };
      }
    }

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
      listenersCarrito();
    }
    poblarCarritoDesdeStorage();
  });

function mostrarAlertaCarrito(mensaje, tipo = 'success') {
  let alerta = document.createElement('div');
  let icono = tipo === 'success'
    ? '<i class="fas fa-check-circle" style="margin-right:10px;"></i>'
    : '<i class="fas fa-trash-alt" style="margin-right:10px;"></i>';
  alerta.innerHTML = `\n    ${icono} ${mensaje}\n  `;
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
}
