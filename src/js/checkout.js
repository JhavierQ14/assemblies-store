// checkout.js
// Lee los productos del carrito desde localStorage y los muestra en el checkout

// Renderizar productos en tabla detallada y visualmente atractiva
function renderCheckoutTable() {
  const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
  const tbody = document.getElementById('checkout-products-body');
  const table = tbody ? tbody.closest('table') : null;
  // Eliminar cualquier tfoot previo
  if (table) {
    const oldTfoot = table.querySelector('tfoot');
    if (oldTfoot) oldTfoot.remove();
  }
  tbody.innerHTML = '';
  let total = 0;
  // Filtrar productos válidos (con nombre y precio definidos)
  const validProducts = cart.filter(product => product && product.name && product.price);
  if (validProducts.length === 0) {
    tbody.innerHTML = '';
    return;
  }
  validProducts.forEach(product => {
    const subtotal = product.subtotal || (product.price * product.qty);
    total += subtotal;
    tbody.innerHTML += `
      <tr class="product-row">
        <td class="product-detail">
          <img src="${product.img || '../images/loader.gif'}" alt="${product.name}" class="product-img">
          <div>
            <div class="product-name">${product.name}</div>
            <div class="product-desc">${product.desc || 'Sin descripción'}</div>
          </div>
        </td>
        <td style="text-align:center;">${product.qty || 1}</td>
        <td>$${product.price}</td>
        <td>$${subtotal}</td>
      </tr>
    `;
  });
  // Crear tfoot solo si hay productos
  if (table && validProducts.length > 0) {
    const tfoot = document.createElement('tfoot');
    tfoot.innerHTML = `<tr class="grand-total-row">
      <td colspan="3" class="total-label">Total a pagar :</td>
      <td class="total-value">$${total}</td>
    </tr>`;
    table.appendChild(tfoot);
  }
}
document.addEventListener('DOMContentLoaded', renderCheckoutTable);

// Enviar datos completos al finalizar compra

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.checkout-container');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Obtener datos de usuario y dirección
    const user = JSON.parse(localStorage.getItem('user_profile') || '{}');
    const address = JSON.parse(localStorage.getItem('user_address') || '{}');
    const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
    const method = form.querySelector('select[name="method"]').value;
    // Validar datos
    if (!user.name || !user.phone || !user.email) {
      showCheckoutError('Completa tus datos personales en el perfil.');
      return;
    }
    if (!address.flat || !address.street || !address.city || !address.state || !address.country || !address.pin_code) {
      showCheckoutError('Completa tu dirección antes de finalizar la compra.');
      return;
    }
    if (!method) {
      showCheckoutError('Selecciona un método de pago.');
      return;
    }
    if (!cart.length) {
      showCheckoutError('Tu carrito está vacío.');
      return;
    }
    // Simular envío de datos
    const order = {
      user,
      address,
      cart,
      method,
      date: new Date().toISOString()
    };
    // Guardar historial de órdenes en localStorage
    const orders = JSON.parse(localStorage.getItem('ordersHistory') || '[]');
    orders.push(order);
    localStorage.setItem('ordersHistory', JSON.stringify(orders));
    localStorage.setItem('lastOrder', JSON.stringify(order));
    showCheckoutSuccess('¡Pedido realizado con éxito!');
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1500);
  });

  function showCheckoutError(msg) {
    let alert = document.createElement('div');
    alert.className = 'checkout-error';
    alert.textContent = msg;
    form.parentNode.insertBefore(alert, form);
    setTimeout(() => alert.remove(), 2000);
  }
  function showCheckoutSuccess(msg) {
    let alert = document.createElement('div');
    alert.className = 'checkout-success';
    alert.textContent = msg;
    form.parentNode.insertBefore(alert, form);
    setTimeout(() => alert.remove(), 1200);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const paymentSelect = document.getElementById('payment-method');
  const cardPanel = document.getElementById('card-panel');
  const paypalPanel = document.getElementById('paypal-panel');
  const codPanel = document.getElementById('cod-panel');
  if (!paymentSelect) return;
  paymentSelect.addEventListener('change', function () {
    if (cardPanel) cardPanel.style.display = (this.value === 'credit card' || this.value === 'debit card') ? 'block' : 'none';
    if (paypalPanel) paypalPanel.style.display = (this.value === 'paypal') ? 'block' : 'none';
    if (codPanel) codPanel.style.display = (this.value === 'cash on delivery') ? 'block' : 'none';
    // Actualizar datos de dirección y contacto en COD
    if (this.value === 'cash on delivery' && codPanel) {
      const address = JSON.parse(localStorage.getItem('user_address') || '{}');
      const user = JSON.parse(localStorage.getItem('user_profile') || '{}');
      let addressText = '';
      if (address.flat) addressText += address.flat + ', ';
      if (address.street) addressText += address.street + ', ';
      if (address.city) addressText += address.city + ', ';
      if (address.state) addressText += address.state + ', ';
      if (address.country) addressText += address.country + ', ';
      if (address.pin_code) addressText += 'CP: ' + address.pin_code;
      document.getElementById('cod-address').textContent = addressText.replace(/, $/, '');
      document.getElementById('cod-contact').textContent = (user.name || '') + (user.phone ? ' | ' + user.phone : '');
    }
  });

  // PayPal Button (sandbox)
  if (document.getElementById('paypal-button-container')) {
    if (window.paypal) {
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'blue', shape: 'pill', label: 'paypal' },
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{ amount: { value: '10.00' } }] // Monto de prueba
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            alert('Pago completado por ' + details.payer.name.given_name);
            window.location.href = 'orders.html';
          });
        }
      }).render('#paypal-button-container');
    }
  }

  // Validación y formateo de campos de tarjeta
  const cardNumber = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvc = document.getElementById('card-cvc');

  if (cardNumber) {
    cardNumber.addEventListener('input', function (e) {
      // Solo números y espacios, máximo 19 caracteres
      let value = this.value.replace(/[^0-9]/g, '');
      // Agrupar en bloques de 4
      value = value.replace(/(.{4})/g, '$1 ').trim();
      this.value = value.slice(0, 19);

      // Detectar tipo de tarjeta
      const visaLogo = document.getElementById('visa-logo');
      const mcLogo = document.getElementById('mastercard-logo');
      if (value.startsWith('4')) {
        // Visa
        if (visaLogo) visaLogo.style.opacity = '1';
        if (mcLogo) mcLogo.style.opacity = '0.2';
      } else if (/^(5[1-5]|2[2-7])/.test(value.replace(/\s/g, ''))) {
        // Mastercard (51-55, 2221-2720)
        if (visaLogo) visaLogo.style.opacity = '0.2';
        if (mcLogo) mcLogo.style.opacity = '1';
      } else {
        // Ninguna o desconocida
        if (visaLogo) visaLogo.style.opacity = '1';
        if (mcLogo) mcLogo.style.opacity = '1';
      }
    });
    cardNumber.addEventListener('keypress', function(e) {
      // Bloquear letras
      if (e.key && !/[0-9]/.test(e.key)) e.preventDefault();
    });
  }

  if (cardExpiry) {
    cardExpiry.addEventListener('input', function (e) {
      // Solo números y /
      let value = this.value.replace(/[^0-9]/g, '');
      if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2,4);
      this.value = value.slice(0,5);
    });
    cardExpiry.addEventListener('keypress', function(e) {
      // Bloquear letras
      if (e.key && !/[0-9]/.test(e.key)) e.preventDefault();
    });
  }

  if (cardCvc) {
    cardCvc.addEventListener('input', function (e) {
      // Solo números
      this.value = this.value.replace(/[^0-9]/g, '').slice(0,4);
    });
    cardCvc.addEventListener('keypress', function(e) {
      if (e.key && !/[0-9]/.test(e.key)) e.preventDefault();
    });
  }
});
