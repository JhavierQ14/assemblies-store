// JS para perfil elegante: cambio de avatar (simulado)
document.addEventListener('DOMContentLoaded', function() {
  const editBtn = document.querySelector('.edit-avatar-btn');
  const avatarImg = document.querySelector('.profile-avatar');
  let fileInput = document.getElementById('avatarFileInput');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'avatarFileInput';
    document.body.appendChild(fileInput);
  }
  if (editBtn && avatarImg) {
    editBtn.addEventListener('click', function(e) {
      e.preventDefault();
      fileInput.click();
    });
    fileInput.addEventListener('change', function() {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          avatarImg.src = e.target.result;
          // Guardar avatar con clave única por usuario
          let userLogged = JSON.parse(localStorage.getItem('user_logged') || 'null');
          if (userLogged && userLogged.email) {
            localStorage.setItem('profile_avatar_' + userLogged.email, e.target.result);
            userLogged.avatar = e.target.result;
            localStorage.setItem('user_logged', JSON.stringify(userLogged));
            let users = JSON.parse(localStorage.getItem('users_db') || '[]');
            const idx = users.findIndex(u => u.email === userLogged.email);
            if (idx !== -1) {
              users[idx].avatar = e.target.result;
              localStorage.setItem('users_db', JSON.stringify(users));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  // Cargar datos del perfil desde localStorage si existen
  const nameSpan = document.querySelector('.profile-name span, .profile-name');
  const emailP = document.querySelector('.profile-info-list p:nth-child(2) span');
  const phoneP = document.querySelector('.profile-info-list p:nth-child(1) span');
  if (localStorage.getItem('profile_name') && nameSpan) {
    nameSpan.textContent = localStorage.getItem('profile_name');
  }
  if (localStorage.getItem('profile_email') && emailP) {
    emailP.textContent = localStorage.getItem('profile_email');
  }
  if (localStorage.getItem('profile_number') && phoneP) {
    phoneP.textContent = localStorage.getItem('profile_number');
  }
  // Mostrar avatar guardado por usuario si existe
  let userLogged = JSON.parse(localStorage.getItem('user_logged') || 'null');
  if (userLogged && userLogged.email && avatarImg) {
    const avatar = localStorage.getItem('profile_avatar_' + userLogged.email);
    if (avatar) {
      avatarImg.src = avatar;
    }
  }
});
