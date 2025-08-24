document.addEventListener('DOMContentLoaded', function () {
  const nameSpan = document.getElementById('checkout-user-name');
  const phoneSpan = document.getElementById('checkout-user-phone');
  const emailSpan = document.getElementById('checkout-user-email');
  const addressSpan = document.getElementById('checkout-user-address');
  const user = JSON.parse(localStorage.getItem('user_profile') || '{}');
  const address = JSON.parse(localStorage.getItem('user_address') || '{}');
  if (user && Object.keys(user).length > 0) {
    if (nameSpan) nameSpan.textContent = user.name || 'Usuario';
    if (phoneSpan) phoneSpan.textContent = user.phone || '';
    if (emailSpan) emailSpan.textContent = user.email || '';
  }
  if (address && Object.keys(address).length > 0 && addressSpan) {
    let addressText = '';
    if (address.flat) addressText += address.flat + ', ';
    if (address.street) addressText += address.street + ', ';
    if (address.city) addressText += address.city + ', ';
    if (address.state) addressText += address.state + ', ';
    if (address.country) addressText += address.country + ', ';
    if (address.pin_code) addressText += 'CP: ' + address.pin_code;
    addressSpan.textContent = addressText.replace(/, $/, '');
  }
});
