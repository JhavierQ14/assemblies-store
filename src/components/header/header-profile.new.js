// Pequeña lógica para el header: toggle del profile y actualizar nombre/avatar si hay perfil en localStorage
(function () {
  function initHeaderProfile() {
    const userBtn = document.getElementById('user-btn');
    const menuBtn = document.getElementById('menu-btn');
    const profileEl = document.querySelector('.profile');

    if (userBtn && profileEl) {
      userBtn.addEventListener('click', () => profileEl.classList.toggle('active'));
    }
    if (menuBtn) {
      menuBtn.addEventListener('click', () => document.querySelector('.navbar')?.classList.toggle('active'));
    }

    try {
      const user = JSON.parse(localStorage.getItem('user_profile') || 'null');
      if (user) {
        const nameEl = document.getElementById('profile-name-mini');
        const avatarEl = document.getElementById('profile-avatar-mini');
        if (nameEl) nameEl.textContent = user.name || user.username || nameEl.textContent;
        if (avatarEl && user.avatar) avatarEl.src = user.avatar;
      }
    } catch (e) {
      // ignore
    }

    // logout buttons (may be present inside fragment)
    document.addEventListener('click', (e) => {
      if (e.target && e.target.matches('.logout-btn-mini')) {
        localStorage.removeItem('user_profile');
        localStorage.removeItem('access_token');
        // redirect to login
        window.location.href = '/pages/auth/login/login.html';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderProfile);
  } else {
    initHeaderProfile();
  }
})();
