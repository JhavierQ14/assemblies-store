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
  // Header
  const headerEl = document.getElementById('header');
  if (headerEl) {
    includeHTML('#header', 'header.html');
  }
  // Footer
  const footerEl = document.getElementById('footer');
  if (footerEl) {
    includeHTML('#footer', 'footer.html');
  }
});
