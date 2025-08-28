// Lógica para actualizar nombre/avatar del perfil desde localStorage
(function () {
  function initHeaderProfile() {
    // Solo manejar la actualización de datos del perfil, no events de click
    try {
      const user = JSON.parse(localStorage.getItem('user_profile') || 'null');
      if (user) {
        const nameEl = document.getElementById('profile-name-mini');
        const avatarEl = document.getElementById('profile-avatar-mini');
        
        // Mostrar nombre completo (nombres + apellidos)
        if (nameEl) {
          const fullName = [user.names, user.surnames].filter(Boolean).join(' ');
          nameEl.textContent = fullName || 'Usuario';
        }
        
        // Mostrar imagen de perfil o imagen por defecto
        if (avatarEl) {
          avatarEl.src = user.imagePerfil || '/assets/images/user-icon.png';
          avatarEl.onerror = () => {
            avatarEl.src = '/assets/images/user-icon.png';
          };
        }
      }
    } catch (e) {
      // Ignorar errores de localStorage
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

    // Inicializar contador del carrito desde localStorage
    function updateCartBadge(count) {
      const badge = document.getElementById('cart-count-badge');
      if (!badge) return;
      const n = Number(count) || 0;
      if (n > 0) {
        badge.textContent = String(n);
        badge.style.display = 'inline-block';
      } else {
        badge.textContent = '';
        badge.style.display = 'none';
      }
    }

    try {
      const stored = localStorage.getItem('totalItemCart');
      if (stored != null) updateCartBadge(Number(stored));
    } catch (e) {
      // ignore
    }

    // Escuchar eventos de actualización del carrito desde otras partes de la app
    window.addEventListener('cart:update', (ev) => {
      const total = ev?.detail?.total;
      updateCartBadge(total);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderProfile);
  } else {
    initHeaderProfile();
  }
})();
