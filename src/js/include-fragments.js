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
      fetch('header.html')
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
      fetch('footer.html')
         .then(response => response.text())
         .then(data => {
            footerDiv.innerHTML = data;
            document.dispatchEvent(new CustomEvent('footerLoaded'));
         })
         .catch(error => console.error('Error loading footer:', error));
   }
});
