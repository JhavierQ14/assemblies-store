// profile-address.js
// Muestra la dirección guardada en localStorage en el perfil

document.addEventListener('DOMContentLoaded', function () {
  const addressP = document.querySelector('.profile-info-list .address span');
  if (!addressP) return;
  const savedAddress = JSON.parse(localStorage.getItem('user_address') || '{}');
  if (savedAddress && Object.keys(savedAddress).length > 0) {
    let addressText = '';
    if (savedAddress.flat) addressText += savedAddress.flat + ', ';
    if (savedAddress.street) addressText += savedAddress.street + ', ';
    if (savedAddress.city) addressText += savedAddress.city + ', ';
    if (savedAddress.state) addressText += savedAddress.state + ', ';
    if (savedAddress.country) addressText += savedAddress.country + ', ';
    if (savedAddress.pin_code) addressText += 'CP: ' + savedAddress.pin_code;
    addressP.textContent = addressText.replace(/, $/, '');
  }
});
