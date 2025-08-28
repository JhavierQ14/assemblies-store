// Lógica del menú del header: manejo completo de todos los iconos y menús
(function () {
  let initialized = false;
  
  function initHeaderMenu() {
    if (initialized) return;
    
    // Buscar elementos
    const menuBtn = document.getElementById('menu-btn');
    const userBtn = document.getElementById('user-btn');
    const navbar = document.querySelector('.navbar');
    const profile = document.querySelector('.profile');

    // Si no están todos los elementos, reintentar
    if (!menuBtn || !navbar || !userBtn || !profile) {
      setTimeout(initHeaderMenu, 200);
      return;
    }

    // Función para cerrar todos los menús
    function closeAllMenus() {
      if (navbar) navbar.classList.remove('active');
      if (profile) profile.classList.remove('active');
    }

    // EVENT LISTENER: Botón del menú hamburguesa
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = navbar.classList.contains('active');
      closeAllMenus();
      
      if (!isActive) {
        navbar.classList.add('active');
      }
    });

    // EVENT LISTENER: Botón del usuario
    userBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = profile.classList.contains('active');
      closeAllMenus();
      
      if (!isActive) {
        profile.classList.add('active');
      }
    });

    // EVENT LISTENER: Cerrar al hacer click fuera
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // Verificar si el click fue dentro de algún menú o botón
      const isInsideNavbar = navbar.contains(target);
      const isMenuBtn = menuBtn.contains(target);
      const isInsideProfile = profile.contains(target);
      const isUserBtn = userBtn.contains(target);
      
      // Si no está dentro de ningún elemento relevante, cerrar todo
      if (!isInsideNavbar && !isMenuBtn && !isInsideProfile && !isUserBtn) {
        const hadOpenMenus = navbar.classList.contains('active') || profile.classList.contains('active');
        if (hadOpenMenus) {
          closeAllMenus();
        }
      }
    });

    // EVENT LISTENER: Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        const hadOpenMenus = navbar.classList.contains('active') || profile.classList.contains('active');
        if (hadOpenMenus) {
          closeAllMenus();
        }
      }
    });

    // EVENT LISTENER: Manejar redimensionamiento de ventana
    window.addEventListener('resize', function() {
      // Si la ventana se hace más grande que el breakpoint móvil, cerrar el menú móvil
      if (window.innerWidth > 1247) {
        if (navbar.classList.contains('active')) {
          navbar.classList.remove('active');
        }
      }
    });

    initialized = true;
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderMenu);
  } else {
    setTimeout(initHeaderMenu, 100);
  }
})();
