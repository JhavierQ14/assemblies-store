// Funcionalidad para el menú de categorías
// Ejecutar directamente, ya que el HTML ya está en el DOM cuando se inserta este script
const categoriesDropdown = document.querySelector('.categories-dropdown');
const categoriesToggle = document.querySelector('.categories-toggle');

if (categoriesToggle && categoriesDropdown) {
  // Toggle del menú principal de categorías
  categoriesToggle.addEventListener('click', function(e) {
    e.preventDefault();
    categoriesDropdown.classList.toggle('active');
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!categoriesDropdown.contains(e.target)) {
      categoriesDropdown.classList.remove('active');
    }
  });

  // Toggle de subcategorías por click en cualquier tamaño de pantalla
  const categoryLinks = document.querySelectorAll('.category-link');
  categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const categoryItem = this.closest('.category-item');
      const isActive = categoryItem.classList.contains('active');
      // Cerrar todos los submenús
      document.querySelectorAll('.category-item.active').forEach(item => {
        item.classList.remove('active');
      });
      // Si no estaba activo, abrirlo
      if (!isActive) {
        categoryItem.classList.add('active');
      }
    });
  });
}
