// Script para countdown de ofertas especiales en off-sale.html
// Busca todos los elementos con la clase .special-offer-expiry y actualiza el reloj en tiempo real


function startCountdowns() {
  const countdowns = document.querySelectorAll('.special-offer-expiry');
  countdowns.forEach(function(el) {
    const expiry = el.getAttribute('data-expiry');
    if (!expiry) return;
    const expiryDate = new Date(expiry);
    function updateCountdown() {
      const now = new Date();
      const diff = expiryDate - now;
      const countdownSpan = el.querySelector('.countdown-time');
      if (diff <= 0) {
        if (countdownSpan) {
          countdownSpan.innerHTML = '';
        }
        el.innerHTML = '<i class="fa-solid fa-clock"></i> <span class="expired">Oferta finalizada</span>';
        el.classList.add('expired');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      if (countdownSpan) {
        countdownSpan.textContent = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      } else {
        el.innerHTML = `<i class="fa-solid fa-clock"></i> Expira en: <span class="countdown-time">${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}</span>`;
      }
      setTimeout(updateCountdown, 1000);
    }
    updateCountdown();
  });
}


document.addEventListener('DOMContentLoaded', function () {
  startCountdowns();
  // Funcionalidad para agregar al carrito desde ofertas especiales
  document.querySelectorAll('.special-offer-form .fa-shopping-cart').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const form = btn.closest('form');
      const name = form.querySelector('.name').textContent;
      const price = form.querySelector('.price').textContent.replace(/[^\d.]/g, '');
      const qty = form.querySelector('.qty').value;
      // Aquí puedes adaptar la lógica para tu carrito real
      alert(`Agregado al carrito: ${name} (x${qty}) - $${price}`);
      // Aquí deberías llamar a la función real de agregar al carrito
    });
  });
  // Funcionalidad para ver detalles (puedes abrir un modal o redirigir)
  document.querySelectorAll('.special-offer-form .fa-eye').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const form = btn.closest('form');
      const name = form.querySelector('.name').textContent;
      alert(`Ver detalles de: ${name}`);
      // Aquí deberías mostrar el modal de detalles real
    });
  });
});



