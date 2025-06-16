function includeHTML(selector, url) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    });
}

window.addEventListener('DOMContentLoaded', () => {
  // Detecta si es la página de inicio para cargar el header especial
  const isHome = window.location.pathname.includes('home.html');
  if (isHome) {
    includeHTML('#main-header', '../components/header-home.html');
  } else {
    includeHTML('#main-header', '../components/header.html');
  }
  includeHTML('#main-footer', '../components/footer.html');
});
