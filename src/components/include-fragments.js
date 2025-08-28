// Inserta los fragments `components/header/header.html` y `components/footer/footer.html`
// dentro de los contenedores #header y #footer.
// Inserta los fragments `components/header/header.html` y `components/footer/footer.html`
// dentro de los contenedores #header y #footer.
(function () {
  async function fetchText(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Fetch failed: ' + path);
    return res.text();
  }

  async function includeFragments() {
    try {
      const headerContainer = document.querySelector('#header');
      const footerContainer = document.querySelector('#footer');
      
      if (headerContainer) {
        const headerUrl = '/components/header/header.html';
        const headerHtml = await fetchText(headerUrl);
        headerContainer.innerHTML = headerHtml;
        
        // Esperar un momento para que el DOM se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Cargar scripts secuencialmente para evitar conflictos
        const menuScript = document.createElement('script');
        menuScript.src = '/components/header/header-menu.js';
        menuScript.onload = () => {
          // Cargar script de profile después del menú
          const profileScript = document.createElement('script');
          profileScript.src = '/components/header/header-profile.js';
          profileScript.onload = () => {
            // Cargar script de categorías al final como módulo ES6
            const categoriesScript = document.createElement('script');
            categoriesScript.type = 'module'; // Agregar type="module"
            categoriesScript.src = '/components/header/header-categories-megamenu.js';
            document.body.appendChild(categoriesScript);
          };
          document.body.appendChild(profileScript);
        };
        document.body.appendChild(menuScript);
      }

      if (footerContainer) {
        const footerUrl = '/components/footer/footer.html';
        const footerHtml = await fetchText(footerUrl);
        footerContainer.innerHTML = footerHtml;
      }
    } catch (err) {
      console.warn('include-fragments error', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', includeFragments);
  } else {
    includeFragments();
  }
})();
