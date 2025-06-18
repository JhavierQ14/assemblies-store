// update_profile.js
// Simula el guardado de datos y los transfiere al perfil usando localStorage

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('.form-container form');
  if (!form) return;

  // Rellenar campos con datos actuales del usuario logueado
  const userLogged = JSON.parse(localStorage.getItem('user_logged') || 'null');
  if (userLogged) {
    if (form.elements['name']) form.elements['name'].value = userLogged.name || '';
    if (form.elements['email']) form.elements['email'].value = userLogged.email || '';
    if (form.elements['number']) form.elements['number'].value = userLogged.number || '';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Obtener datos del formulario
    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const number = form.elements['number'].value;
    // Guardar en localStorage (simulación)
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_email', email);
    localStorage.setItem('profile_number', number);
    // Actualizar usuario en users_db y user_logged
    let users = JSON.parse(localStorage.getItem('users_db') || '[]');
    let userLogged = JSON.parse(localStorage.getItem('user_logged') || 'null');
    if (userLogged) {
      // Buscar usuario por email anterior
      const idx = users.findIndex(u => u.email === userLogged.email);
      if (idx !== -1) {
        users[idx].name = name;
        users[idx].email = email;
        users[idx].number = number;
        // Si se cambia la contraseña, actualizarla
        const newPass = form.elements['new_pass'].value;
        const confirmPass = form.elements['confirm_pass'].value;
        if (newPass && newPass === confirmPass) {
          users[idx].pass = newPass;
        }
        // Actualizar user_logged
        userLogged = { ...users[idx] };
        localStorage.setItem('user_logged', JSON.stringify(userLogged));
      }
      localStorage.setItem('users_db', JSON.stringify(users));
    }
    // Mensaje de éxito
    showSuccess('¡Perfil actualizado correctamente!');
    // Redirigir al perfil después de un breve delay
    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 1200);
  });
});

function showSuccess(msg) {
  let alertDiv = document.createElement('div');
  alertDiv.className = 'profile-success-alert';
  alertDiv.textContent = msg;
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.classList.add('show');
  }, 10);
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 400);
  }, 1100);
}
