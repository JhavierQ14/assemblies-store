// Filtros para la tienda
// Este archivo maneja la lógica de filtrado de productos en store.html

document.addEventListener('DOMContentLoaded', function() {
  const filtersForm = document.getElementById('store-filters');
  const productsContainer = document.querySelector('.products .box-container');

  if (!filtersForm || !productsContainer) return;

  function getFilters() {
    const formData = new FormData(filtersForm);
    return {
      category: formData.get('category'),
      minPrice: parseFloat(formData.get('minPrice')) || 0,
      maxPrice: parseFloat(formData.get('maxPrice')) || Infinity,
      orderBy: formData.get('orderBy')
    };
  }

  function filterProducts() {
    const filters = getFilters();
    const boxes = productsContainer.querySelectorAll('.box');
    boxes.forEach(box => {
      const name = box.querySelector('.name')?.textContent || '';
      const cat = box.querySelector('.cat')?.textContent || '';
      const price = parseFloat(box.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')) || 0;
      let visible = true;
      if (filters.category && filters.category !== 'all' && cat !== filters.category) visible = false;
      if (price < filters.minPrice) visible = false;
      if (price > filters.maxPrice) visible = false;
      box.style.display = visible ? '' : 'none';
    });
    // Ordenar
    let sorted = Array.from(boxes).filter(box => box.style.display !== 'none');
    if (filters.orderBy && filters.orderBy !== 'default') {
      if (filters.orderBy === 'price-asc') {
        sorted.sort((a, b) => parseFloat(a.querySelector('.price').textContent.replace(/[^\d.]/g, '')) - parseFloat(b.querySelector('.price').textContent.replace(/[^\d.]/g, '')));
      } else if (filters.orderBy === 'price-desc') {
        sorted.sort((a, b) => parseFloat(b.querySelector('.price').textContent.replace(/[^\d.]/g, '')) - parseFloat(a.querySelector('.price').textContent.replace(/[^\d.]/g, '')));
      } else if (filters.orderBy === 'alpha-asc') {
        sorted.sort((a, b) => a.querySelector('.name').textContent.localeCompare(b.querySelector('.name').textContent));
      } else if (filters.orderBy === 'alpha-desc') {
        sorted.sort((a, b) => b.querySelector('.name').textContent.localeCompare(a.querySelector('.name').textContent));
      }
      sorted.forEach(box => productsContainer.appendChild(box));
    }
  }

  filtersForm.addEventListener('input', filterProducts);
  filtersForm.addEventListener('change', filterProducts);

  document.getElementById('clear-filters').addEventListener('click', function() {
    filtersForm.reset();
    filterProducts();
  });

  filterProducts(); // Inicial
});
