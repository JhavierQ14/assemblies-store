// login.js
// Simula autenticación usando localStorage como "base de datos local"
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.login-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = form.elements['email'].value.trim();
    const pass = form.elements['pass'].value;
    // Buscar usuario en "bdlocal"
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const user = users.find(u => u.email === email);
    console.log('Intento login:', { email, pass, users, user }); // DEBUG
    if (user && user.pass === pass) {
      showLoginSuccess('¡Bienvenido de nuevo!');
      localStorage.setItem('user_logged', JSON.stringify(user));
      // Sincronizar datos con perfil
      localStorage.setItem('profile_name', user.name || '');
      localStorage.setItem('profile_email', user.email || '');
      localStorage.setItem('profile_number', user.number || '');
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1200);
    } else if (!user) {
      showLoginError('No existe una cuenta con este correo. Serás redirigido al registro...');
      setTimeout(() => {
        window.location.href = 'register.html';
      }, 1800);
    } else {
      showLoginError('Contraseña incorrecta.');
    }
  });
});

function showLoginSuccess(msg) {
  showLoginAlert(msg, 'success');
}
function showLoginError(msg) {
  showLoginAlert(msg, 'error');
}
function showLoginAlert(msg, type) {
  let alertDiv = document.createElement('div');
  alertDiv.className = 'login-alert ' + type;
  alertDiv.textContent = msg;
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.classList.add('show');
  }, 10);
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 400);
  }, 1500);
}
