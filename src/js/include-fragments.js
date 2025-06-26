// Incluye header y footer en las páginas automáticamente
// filepath: /home/nvbh/repos/github/assemblies/src/js/include-fragments.js

function includeHTML(selector, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.querySelector(selector).innerHTML = html;
    });
}

document.addEventListener('DOMContentLoaded', function() {
   // Cargar header
   const headerDiv = document.getElementById('header');
   if (headerDiv) {
      // Detectar ruta relativa correcta
      let headerPath = 'header.html';
      if (!window.location.pathname.endsWith('/src/pages/header.html')) {
         headerPath = window.location.pathname.includes('/src/pages/') ? 'header.html' : 'pages/header.html';
      }
      fetch(headerPath)
         .then(response => response.text())
         .then(data => {
            headerDiv.innerHTML = data;
            // Disparar evento personalizado
            document.dispatchEvent(new CustomEvent('headerLoaded'));
         })
         .catch(error => console.error('Error loading header:', error));
   }

   // Cargar footer
   const footerDiv = document.getElementById('footer');
   if (footerDiv) {
      let footerPath = 'footer.html';
      if (!window.location.pathname.endsWith('/src/pages/footer.html')) {
         footerPath = window.location.pathname.includes('/src/pages/') ? 'footer.html' : 'pages/footer.html';
      }
      fetch(footerPath)
         .then(response => response.text())
         .then(data => {
            footerDiv.innerHTML = data;
            document.dispatchEvent(new CustomEvent('footerLoaded'));
         })
         .catch(error => console.error('Error loading footer:', error));
   }
});
