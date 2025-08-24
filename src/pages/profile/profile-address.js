document.addEventListener('DOMContentLoaded', function () {
  const address = JSON.parse(localStorage.getItem('user_address') || '{}');
  const container = document.getElementById('profile-address');
  if (!container) return;
  container.innerHTML = '';
  if (!address || Object.keys(address).length === 0) {
    container.innerHTML = '<p>No hay dirección guardada.</p>';
    return;
  }
  container.innerHTML = `
    <div class="address-card">
      <div>${address.flat || ''} ${address.street || ''}</div>
      <div>${address.city || ''} - ${address.state || ''}</div>
      <div>${address.country || ''} | CP: ${address.pin_code || ''}</div>
      <div>${address.additional || ''}</div>
      <a href="update_address.html" class="edit-address">Editar</a>
    </div>
  `;
});
