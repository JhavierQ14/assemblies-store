// checkout-user-data.js
// Guarda y muestra los datos del usuario (nombre, email, teléfono) y dirección en localStorage para el checkout

document.addEventListener('DOMContentLoaded', function () {
  // Guardar datos del perfil en user_profile para checkout
  const userLogged = JSON.parse(localStorage.getItem('user_logged') || 'null');
  if (userLogged) {
    const user_profile = {
      name: userLogged.name || '',
      email: userLogged.email || '',
      phone: userLogged.number || ''
    };
    localStorage.setItem('user_profile', JSON.stringify(user_profile));
  }
});
