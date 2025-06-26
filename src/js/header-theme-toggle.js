// header-theme-toggle.js
// Lógica de modo oscuro/claro para Assemblies Store

function initThemeToggle(attempt = 0) {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    if (attempt < 10) setTimeout(() => initThemeToggle(attempt + 1), 100);
    return;
  }
  const themeIcon = themeToggle.querySelector('i');
  // Detectar modo guardado
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
  themeToggle.onclick = function(e) {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  };
}

document.addEventListener('headerLoaded', () => initThemeToggle(0));
document.addEventListener('DOMContentLoaded', () => initThemeToggle(0));
