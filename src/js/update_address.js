// update_address.js
// Guarda la dirección en localStorage y muestra feedback visual

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form-container form');
  if (!form) return;

  // Cargar datos previos si existen
  const savedAddress = JSON.parse(localStorage.getItem('user_address') || '{}');
  if (savedAddress && Object.keys(savedAddress).length > 0) {
    form.flat.value = savedAddress.flat || '';
    form.street.value = savedAddress.street || '';
    form.city.value = savedAddress.city || '';
    form.state.value = savedAddress.state || '';
    form.country.value = savedAddress.country || '';
    form.pin_code.value = savedAddress.pin_code || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const address = {
      flat: form.flat.value.trim(),
      street: form.street.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value.trim(),
      country: form.country.value.trim(),
      pin_code: form.pin_code.value.trim()
    };
    localStorage.setItem('user_address', JSON.stringify(address));
    showSuccess('¡Dirección actualizada correctamente!');
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1200);
  });

  function showSuccess(msg) {
    let alert = document.createElement('div');
    alert.className = 'address-success';
    alert.textContent = msg;
    form.parentNode.insertBefore(alert, form);
    setTimeout(() => alert.remove(), 1000);
  }
});
