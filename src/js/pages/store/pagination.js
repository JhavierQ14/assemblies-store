// Paginación para la tienda
// Este archivo maneja la lógica de paginado de productos en store.html

document.addEventListener('DOMContentLoaded', function() {
  const productsContainer = document.querySelector('.products .box-container');
  const paginationNav = document.getElementById('store-pagination');
  const pageSizeSelect = document.getElementById('page-size');

  if (!productsContainer || !paginationNav || !pageSizeSelect) return;

  let currentPage = 1;
  let pageSize = parseInt(pageSizeSelect.value) || 10;

  function getVisibleProducts() {
    return Array.from(productsContainer.querySelectorAll('.box')).filter(box => box.style.display !== 'none');
  }

  function renderPagination() {
    const visibleProducts = getVisibleProducts();
    const total = visibleProducts.length;
    pageSize = pageSizeSelect.value === 'all' ? total : parseInt(pageSizeSelect.value) || 10;
    const totalPages = pageSize === 0 ? 1 : Math.ceil(total / pageSize);
    if (currentPage > totalPages) currentPage = 1;
    paginationNav.innerHTML = '';
    if (totalPages <= 1) return;
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      btn.textContent = i;
      btn.disabled = i === currentPage;
      btn.addEventListener('click', () => {
        currentPage = i;
        showPage();
        renderPagination();
      });
      paginationNav.appendChild(btn);
    }
  }

  function showPage() {
    const visibleProducts = getVisibleProducts();
    pageSize = pageSizeSelect.value === 'all' ? visibleProducts.length : parseInt(pageSizeSelect.value) || 10;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    visibleProducts.forEach((box, idx) => {
      box.style.display = (idx >= start && idx < end) ? '' : 'none';
    });
  }

  pageSizeSelect.addEventListener('change', () => {
    currentPage = 1;
    showPage();
    renderPagination();
  });

  // Reaccionar a cambios de filtro
  const filtersForm = document.getElementById('store-filters');
  if (filtersForm) {
    filtersForm.addEventListener('input', () => {
      currentPage = 1;
      showPage();
      renderPagination();
    });
    filtersForm.addEventListener('change', () => {
      currentPage = 1;
      showPage();
      renderPagination();
    });
  }

  // Inicial
  showPage();
  renderPagination();
});
