document.addEventListener('DOMContentLoaded', function () {
  const userLogged = JSON.parse(localStorage.getItem('user_logged') || 'null');
  if (userLogged) {
    const user_profile = { name: userLogged.name || '', email: userLogged.email || '', phone: userLogged.number || '' };
    localStorage.setItem('user_profile', JSON.stringify(user_profile));
  }
});
