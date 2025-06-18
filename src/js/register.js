// register.js
// Lógica de registro de usuario para Assemblies Store

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.login-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const pass = form.elements['pass'].value;
    const confirmPass = form.elements['confirm_pass'].value;

    // Validaciones básicas
    if (!name || !email || !pass || !confirmPass) {
      showRegisterAlert('Completa todos los campos.', 'error');
      return;
    }
    if (pass.length < 6) {
      showRegisterAlert('La contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }
    if (pass !== confirmPass) {
      showRegisterAlert('Las contraseñas no coinciden.', 'error');
      return;
    }
    // Validar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    if (users.find(u => u.email === email)) {
      showRegisterAlert('Ya existe una cuenta con este correo.', 'error');
      return;
    }
    // Crear usuario
    const newUser = {
      name,
      email,
      pass,
      avatar: '',
      role: 'cliente',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    showRegisterAlert('¡Registro exitoso! Redirigiendo al login...', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1800);
  });
});

function showRegisterAlert(msg, type) {
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
