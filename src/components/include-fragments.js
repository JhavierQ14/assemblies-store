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
        const headerHtml = await fetchText('./components/header/header.html');
        headerContainer.innerHTML = headerHtml;
        // cargar script de profile si existe
        const script = document.createElement('script');
        script.src = './components/header/header-profile.js';
        script.defer = true;
        document.body.appendChild(script);
      }

      if (footerContainer) {
        const footerHtml = await fetchText('./components/footer/footer.html');
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
