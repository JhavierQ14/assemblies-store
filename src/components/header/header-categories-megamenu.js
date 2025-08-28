


// El menú de categorías lee datos desde localStorage
// La petición se hace desde el index.html principal

import { getCategoriesFromStorage, onCategoriesReady } from '../../services/categories-simple.js';

let categoriesData = [];

function renderCategoriesMenu() {
  console.log('[renderCategoriesMenu] Iniciando con', categoriesData.length, 'categorías');
  const catList = document.getElementById('categories-list');
  if (!catList) {
    console.error('[renderCategoriesMenu] Elemento categories-list no encontrado');
    return;
  }
  
  catList.innerHTML = '';
  categoriesData.forEach((cat, idx) => {
    console.log('[renderCategoriesMenu] Procesando categoría:', cat);
    const div = document.createElement('div');
    div.className = 'category-btn' + (idx === 0 ? ' active' : '');
    div.dataset.category = cat.id;
    div.innerHTML = `<img src="${cat.imageUrl || '/assets/images/ROG PLACA MADRE.png'}" alt="${cat.name}" class="category-icon">${cat.name}`;
    catList.appendChild(div);
  });
  console.log('[renderCategoriesMenu] Completado. Elementos creados:', catList.children.length);
}

function renderSubcategories(catId) {
  console.log('[renderSubcategories] Buscando subcategorías para ID:', catId);
  const subList = document.getElementById('subcategories-list');
  if (!subList) {
    console.error('[renderSubcategories] Elemento subcategories-list no encontrado');
    return;
  }
  
  subList.innerHTML = '';
  const cat = categoriesData.find(c => c.id === catId);
  console.log('[renderSubcategories] Categoría encontrada:', cat);
  
  if (cat && cat.subCategories && cat.subCategories.length) {
    console.log('[renderSubcategories] Renderizando', cat.subCategories.length, 'subcategorías');
    cat.subCategories.forEach(sub => {
      const a = document.createElement('a');
      a.className = 'subcategory-link';
      a.href = `/pages/store/store.html?subcategoryId=${sub.id}`;
      a.textContent = sub.name;
      subList.appendChild(a);
    });
  } else {
    console.log('[renderSubcategories] Sin subcategorías, mostrando mensaje por defecto');
    subList.innerHTML = '<span style="color:#888;">Sin subcategorías</span>';
  }
  console.log('[renderSubcategories] Completado');
}

async function waitForElement(selector, timeout = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const el = document.querySelector(selector);
    if (el) return el;
    await new Promise(r => setTimeout(r, 50));
  }
  return null;
}

// Función para configurar los event listeners de las categorías
function setupCategoryListeners() {
  const catList = document.getElementById('categories-list');
  if (!catList) return;
  
  const catBtns = catList.querySelectorAll('.category-btn');
  catBtns.forEach(btn => {
    // Hover para desktop
    btn.addEventListener('mouseenter', function(e) {
      if (!('ontouchstart' in window)) {
        catBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderSubcategories(this.dataset.category);
      }
    });
    
    // Click para pantallas táctiles
    btn.addEventListener('click', function(e) {
      if ('ontouchstart' in window) {
        catBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderSubcategories(this.dataset.category);
      }
    });
    
    // Para accesibilidad, también cambiar con teclado
    btn.addEventListener('focus', function(e) {
      catBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderSubcategories(this.dataset.category);
    });
  });
}

// Inicialización simple del menú de categorías
(async function initializeCategoriesMenu() {
  try {
    // Esperar a que existan los elementos necesarios
    const catList = await waitForElement('#categories-list');
    const subList = await waitForElement('#subcategories-list');
    
    if (!catList || !subList) {
      console.warn('[header-categories-megamenu] Elementos del menú no encontrados');
      return;
    }
    
    // Usar la función que espera a que las categorías estén listas
    onCategoriesReady((categories) => {
      console.log('[initializeCategoriesMenu] Categorías recibidas:', categories);
      categoriesData = categories;
      
      if (categoriesData.length === 0) {
        console.warn('[header-categories-megamenu] No hay categorías disponibles');
        return;
      }
      
      console.log('[initializeCategoriesMenu] Renderizando menú con categorías:', categoriesData);
      
      // Renderizar menú
      renderCategoriesMenu();
      setupCategoryListeners();
      
      // Inicializar con la primera categoría
      if (categoriesData.length > 0) {
        console.log('[initializeCategoriesMenu] Inicializando con primera categoría:', categoriesData[0]);
        renderSubcategories(categoriesData[0].id);
      }
      
      console.log('[header-categories-megamenu] Menú inicializado con', categoriesData.length, 'categorías');
    });
    
  } catch (error) {
    console.error('[header-categories-megamenu] Error durante la inicialización:', error);
  }
})();

// Configuración del comportamiento del megamenú (abrir/cerrar)
(function setupMegaMenuBehavior() {
  // Esperamos un poco para que el DOM esté completamente cargado
  setTimeout(() => {
    const toggle = document.querySelector('.categories-megamenu-dropdown .categories-toggle');
    const megamenu = document.getElementById('categories-megamenu');
    const dropdown = document.querySelector('.categories-megamenu-dropdown');
    const backBtn = document.querySelector('.back-to-main');
    
    console.log('[setupMegaMenuBehavior] Elementos encontrados:');
    console.log('- Toggle:', !!toggle);
    console.log('- Megamenu:', !!megamenu);
    console.log('- Dropdown:', !!dropdown);
    
    if (!toggle || !megamenu || !dropdown) {
      console.error('[setupMegaMenuBehavior] Faltan elementos del megamenú');
      return;
    }
    
    let open = false;
    let closeTimeout = null;

  function openMenu() {
    console.log('[OpenMenu] Iniciando apertura...');
    megamenu.style.display = 'flex';
    open = true;
    console.log('[OpenMenu] Display cambiado a flex, open =', open);
    
    // Responsive: mostrar solo menú de categorías en <=1247px
    if (window.innerWidth <= 1247) {
      const navbar = dropdown.closest('.navbar');
      // Verificar si el navbar está activo (menú móvil abierto)
      if (navbar.classList.contains('active')) {
        // Oculta todos los elementos del navbar excepto el mega menú
        navbar.querySelectorAll(':scope > a, :scope > *:not(.categories-megamenu-dropdown)').forEach(el => {
          if (!el.classList.contains('categories-megamenu-dropdown')) {
            el.style.display = 'none';
          }
        });
        dropdown.classList.add('open-only');
        if (backBtn) {
          backBtn.style.display = 'block';
        }
      } else {
        // Si el navbar no está activo pero es móvil, agregar clase para permitir overflow
        navbar.classList.add('megamenu-open');
      }
    } else {
      // En desktop, también agregar la clase por si acaso
      const navbar = dropdown.closest('.navbar');
      navbar.classList.add('megamenu-open');
    }
    console.log('[OpenMenu] Menú abierto completamente');
  }
  
  function closeMenu() {
    console.log('[CloseMenu] Iniciando cierre...');
    megamenu.style.display = 'none';
    open = false;
    console.log('[CloseMenu] Display cambiado a none, open =', open);
    
    const navbar = dropdown.closest('.navbar');
    
    if (window.innerWidth <= 1247) {
      // Restaura todos los elementos del navbar
      navbar.querySelectorAll(':scope > a, :scope > *:not(.categories-megamenu-dropdown)').forEach(el => {
        if (!el.classList.contains('categories-megamenu-dropdown')) {
          el.style.display = '';
        }
      });
      dropdown.classList.remove('open-only');
      if (backBtn) backBtn.style.display = 'none';
    }
    
    // Siempre quitar la clase megamenu-open
    navbar.classList.remove('megamenu-open');
    console.log('[CloseMenu] Menú cerrado completamente');
  }

  function backToMainMenu() {
    closeMenu();
    // Asegurar que el navbar móvil siga activo
    const navbar = dropdown.closest('.navbar');
    if (navbar && !navbar.classList.contains('active')) {
      navbar.classList.add('active');
    }
  }

  toggle.addEventListener('click', function(e) {
    console.log('[Toggle Click] Evento disparado');
    e.preventDefault();
    console.log('[Toggle Click] Estado actual - open:', open);
    console.log('[Toggle Click] Megamenu display:', megamenu.style.display);
    
    if (open) {
      console.log('[Toggle Click] Cerrando menú...');
      closeMenu();
    } else {
      console.log('[Toggle Click] Abriendo menú...');
      openMenu();
    }
  });

  // Event listener para el botón "Volver al menú principal"
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      backToMainMenu();
    });
  }

  // Mantener abierto el menú mientras el mouse está sobre él (solo en desktop)
  megamenu.addEventListener('mouseenter', function() {
    if (closeTimeout) clearTimeout(closeTimeout);
  });
  
  megamenu.addEventListener('mouseleave', function() {
    if (window.innerWidth > 1247) {
      closeTimeout = setTimeout(closeMenu, 180);
    }
  });

  // Cerrar solo si se hace click fuera del menú y del toggle
  document.addEventListener('mousedown', function(e) {
    // Solo procesar si el megamenú está abierto
    if (open && !megamenu.contains(e.target) && !toggle.contains(e.target) && 
        (!backBtn || !backBtn.contains(e.target))) {
      closeMenu();
    }
  });

  // Escuchar cambios de tamaño de ventana para limpiar estados responsive
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1247 && dropdown.classList.contains('open-only')) {
      dropdown.classList.remove('open-only');
      const navbar = dropdown.closest('.navbar');
      navbar.querySelectorAll(':scope > a, :scope > *:not(.categories-megamenu-dropdown)').forEach(el => {
        if (!el.classList.contains('categories-megamenu-dropdown')) {
          el.style.display = '';
        }
      });
      navbar.classList.remove('megamenu-open');
      if (backBtn) backBtn.style.display = 'none';
    }
  });
  
  }, 500); // Fin del setTimeout
})();

// Función de debug global
window.debugCategories = function() {
  console.log('=== DEBUG CATEGORÍAS ===');
  console.log('categoriesData:', categoriesData);
  console.log('localStorage appCategories:', localStorage.getItem('appCategories'));
  console.log('categories-list element:', document.getElementById('categories-list'));
  console.log('subcategories-list element:', document.getElementById('subcategories-list'));
  console.log('categories-toggle element:', document.querySelector('.categories-toggle'));
  console.log('categories-megamenu element:', document.getElementById('categories-megamenu'));
  console.log('megamenu display:', document.getElementById('categories-megamenu')?.style.display);
  console.log('========================');
};

// Función de test manual
window.testMenuToggle = function() {
  const megamenu = document.getElementById('categories-megamenu');
  if (megamenu) {
    const isVisible = megamenu.style.display !== 'none';
    megamenu.style.display = isVisible ? 'none' : 'flex';
    console.log('Menu toggled. Now visible:', !isVisible);
  } else {
    console.error('Megamenu element not found!');
  }
};