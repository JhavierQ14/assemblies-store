// header-theme-toggle.js
// Lógica de modo oscuro/claro para Assemblies Store

function waitForThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    setTimeout(waitForThemeToggle, 100);
    return;
  }
  const themeIcon = themeToggle.querySelector('i');
  // Detectar modo guardado
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  themeToggle.addEventListener('click', function(e) {
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
  });
}
document.addEventListener('DOMContentLoaded', waitForThemeToggle);
