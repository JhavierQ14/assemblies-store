// header-profile.js
// Muestra el nombre y avatar real del usuario en el panel de perfil del header y gestiona el logout

function updateHeaderProfile() {
  // Mostrar nombre y avatar real
  const nameMini = document.getElementById('profile-name-mini');
  const avatarMini = document.getElementById('profile-avatar-mini');
  const user = JSON.parse(localStorage.getItem('user_profile') || '{}');
  if (user && user.name && nameMini) nameMini.textContent = user.name;
  if (user && user.avatar && avatarMini) avatarMini.src = user.avatar;

  // Mostrar/ocultar panel al hacer clic en el icono
  const userBtn = document.getElementById('user-btn');
  const profilePanel = document.querySelector('.profile');
  if (userBtn && profilePanel) {
    userBtn.onclick = function (e) {
      e.stopPropagation();
      profilePanel.classList.toggle('active');
      document.querySelector('.navbar')?.classList.remove('active');
    };
    document.addEventListener('click', function (e) {
      if (!profilePanel.contains(e.target) && e.target !== userBtn) {
        profilePanel.classList.remove('active');
      }
    });
  }

  // Logout
  const logoutBtn = document.querySelector('.logout-btn-mini');
  if (logoutBtn) {
    logoutBtn.onclick = function (e) {
      e.preventDefault();
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_address');
      window.location.href = 'login.html';
    };
  }
}

document.addEventListener('headerLoaded', updateHeaderProfile);
document.addEventListener('DOMContentLoaded', updateHeaderProfile);
