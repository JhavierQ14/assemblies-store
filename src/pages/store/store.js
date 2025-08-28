import { fetchProducts } from '../../services/product/product-service.js';
import { addToCart } from '../../services/cart/cart-service.js';

const boxContainer = document.querySelector('.box-container');
const filterForm = document.getElementById('filter-form');
const limitSelect = document.getElementById('filter-limit');
const pageSelect = document.getElementById('filter-page');
const searchInput = document.getElementById('filter-search');
const minPriceInput = document.getElementById('filter-price-min');
const maxPriceInput = document.getElementById('filter-price-max');
const paginationContainer = document.getElementById('pagination-container');

let currentPage = 1;
let currentLimit = 6;
let currentSubcategoryId = null; // Agregar variable para la subcategoría actual

// Detectar subcategoryId en la URL al cargar la página
function getSubcategoryIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('subcategoryId') || params.get('subCategoryId') || null;
}

// Inicializar subcategoría desde URL
currentSubcategoryId = getSubcategoryIdFromUrl();
console.log('[Store] Subcategoría detectada en URL:', currentSubcategoryId);

async function renderProducts(params = {}) {
  console.log('[Store] Renderizando productos con parámetros:', params);
  boxContainer.innerHTML = '<div class="loading-products">Cargando productos...</div>';
  try {
    const data = await fetchProducts(params);
    console.log('[Store] Datos recibidos:', data);
    // Adaptar a la estructura de respuesta del backend
    const items = data && data.items ? data.items : [];
    const pagination = data && data.pagination ? data.pagination : {};
    if (!Array.isArray(items)) {
      boxContainer.innerHTML = '<div class="error-products">La respuesta del servidor no es válida.</div>';
      paginationContainer.innerHTML = '';
      return;
    }
    if (!items.length) {
      boxContainer.innerHTML = '<div class="no-products">No se encontraron productos.</div>';
      paginationContainer.innerHTML = '';
      return;
    }
    boxContainer.innerHTML = items.map(product => `
      <form class="box" data-product-id="${product.id}" 
            data-product-name="${product.name.replace(/"/g, '&quot;')}"
            data-product-price="${product.price}"
            data-product-brand="${product.brandName || ''}"
            data-product-gallery='${JSON.stringify(product.gallery || []).replace(/'/g, '&#39;')}'>
        <a href="#" class="fas fa-eye"></a>
        <button class="fas fa-shopping-cart add-to-cart-btn" type="button" data-product-id="${product.id}"></button>
        <img src="${product.gallery && product.gallery[0] ? product.gallery[0].imageUrl : '../../assets/images/loader.gif'}" alt="${product.name}">
        <a href="#" class="cat">${product.brandName || ''}</a>
        <div class="name">${product.name}</div>
        <div class="flex">
          <div class="price"><span>$</span>${product.price}<span>/-</span></div>
          <input type="number" name="qty" class="qty" min="1" max="99" value="1">
        </div>
      </form>
    `).join('');
    
    // Agregar event listeners para los botones de agregar al carrito
    addCartEventListeners();
    
    renderPagination(pagination);
  } catch (e) {
    boxContainer.innerHTML = `<div class="error-products">Error al cargar productos: ${e.message}</div>`;
    paginationContainer.innerHTML = '';
  }
}

function renderPagination(pagination) {
  // Actualizar el texto de la barra de control de página
  const pageInfo = document.querySelector('.products-page-info');
  if (pageInfo && pagination && pagination.totalPages) {
    pageInfo.innerHTML = `Página <select id="filter-page" name="page" class="products-select">${
      Array.from({ length: pagination.totalPages }, (_, i) => `<option value="${i + 1}"${pagination.currentPage === i + 1 ? ' selected' : ''}>${i + 1}</option>`).join('')
    }</select> de ${pagination.totalPages}`;
    // Volver a agregar el listener al select
    const pageSelect = document.getElementById('filter-page');
    if (pageSelect) {
      pageSelect.addEventListener('change', () => {
        currentPage = parseInt(pageSelect.value);
        updateProducts();
      });
    }
  }
  // Paginación tipo botones (opcional, puedes quitar si solo usas el select)
  if (!pagination || pagination.totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }
  let html = '<div class="store-pagination">';
  for (let i = 1; i <= pagination.totalPages; i++) {
    html += `<button class="page-btn${i === pagination.currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += '</div>';
  paginationContainer.innerHTML = html;
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      currentPage = parseInt(btn.dataset.page);
      updateProducts();
    });
  });
}

function updateProducts() {
  const params = {
    page: currentPage,
    limit: currentLimit,
    name: searchInput.value,
    minPrice: minPriceInput.value,
    maxPrice: maxPriceInput.value
  };
  
  // Agregar subcategoría si existe
  if (currentSubcategoryId) {
    params.subCategoryId = currentSubcategoryId;
    console.log('[Store] Incluyendo filtro por subcategoría:', currentSubcategoryId);
  }
  
  console.log('[Store] Actualizando productos con parámetros:', params);
  renderProducts(params);
}

filterForm.addEventListener('submit', e => {
  e.preventDefault();
  currentPage = 1;
  currentLimit = parseInt(limitSelect.value);
  updateProducts();
});

limitSelect.addEventListener('change', () => {
  currentLimit = parseInt(limitSelect.value);
  currentPage = 1;
  updateProducts();
});

pageSelect.addEventListener('change', () => {
  currentPage = parseInt(pageSelect.value);
  updateProducts();
});


// Inicialización mejorada
console.log('[Store] Inicializando tienda...');
console.log('[Store] Subcategoría detectada:', currentSubcategoryId);

// Cargar productos iniciales
const initialParams = {
  page: 1,
  limit: currentLimit
};

if (currentSubcategoryId) {
  initialParams.subCategoryId = currentSubcategoryId;
  console.log('[Store] Cargando productos de subcategoría:', currentSubcategoryId);
}

renderProducts(initialParams);

// Mostrar información de filtro activo si hay subcategoría
if (currentSubcategoryId) {
  const filterInfo = document.createElement('div');
  filterInfo.className = 'active-filter-info';
  filterInfo.innerHTML = `
    <p>📂 Mostrando productos de la subcategoría seleccionada</p>
    <button onclick="clearSubcategoryFilter()" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
      ✕ Ver todos los productos
    </button>
  `;
  filterInfo.style.cssText = 'background: #e3f2fd; padding: 10px; margin: 10px 0; border-radius: 5px; color: #1976d2; display: flex; justify-content: space-between; align-items: center;';
  
  const filterForm = document.getElementById('filter-form');
  if (filterForm) {
    filterForm.parentNode.insertBefore(filterInfo, filterForm);
  }
}

// Función global para limpiar filtro de subcategoría
window.clearSubcategoryFilter = function() {
  currentSubcategoryId = null;
  // Actualizar URL sin recargar página
  const url = new URL(window.location);
  url.searchParams.delete('subcategoryId');
  url.searchParams.delete('subCategoryId');
  window.history.replaceState({}, '', url);
  
  // Remover el mensaje de filtro activo
  const filterInfo = document.querySelector('.active-filter-info');
  if (filterInfo) {
    filterInfo.remove();
  }
  
  // Recargar productos sin filtro
  currentPage = 1;
  updateProducts();
  
  console.log('[Store] Filtro de subcategoría eliminado');
};

// Función para agregar event listeners a los botones del carrito
function addCartEventListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  console.log('[Store] Agregando listeners a botones del carrito:', addToCartButtons.length);
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const productBox = button.closest('.box');
      const qtyInput = productBox.querySelector('.qty');
      const quantity = parseInt(qtyInput.value) || 1;
      
      // Construir objeto del producto con todos los datos necesarios
      const productData = {
        productId: productBox.dataset.productId,
        name: productBox.dataset.productName,
        unitPrice: parseFloat(productBox.dataset.productPrice),
        quantity: quantity,
        description: productBox.dataset.productBrand || '',
        gallery: JSON.parse(productBox.dataset.productGallery || '[]')
      };
      
      console.log('[Store] Agregando al carrito:', productData);
      
      // Deshabilitar botón mientras se procesa
      button.disabled = true;
      button.classList.add('loading');
      
      try {
        const result = await addToCart(productData);
        console.log('[Store] Producto agregado al carrito:', result);
        
        // Mostrar feedback visual
        button.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
          button.style.backgroundColor = '';
          button.disabled = false;
          button.classList.remove('loading');
        }, 1000);
        
      } catch (error) {
        console.error('[Store] Error al agregar al carrito:', error);
        
        // Mostrar feedback de error
        button.style.backgroundColor = '#f44336';
        setTimeout(() => {
          button.style.backgroundColor = '';
          button.disabled = false;
          button.classList.remove('loading');
        }, 1000);
        
        // Mostrar mensaje de error al usuario
        alert('Error al agregar al carrito: ' + error.message);
      }
    });
  });
}

// Función de debug para verificar el estado actual
window.debugStore = function() {
  console.log('=== DEBUG STORE ===');
  console.log('currentSubcategoryId:', currentSubcategoryId);
  console.log('currentPage:', currentPage);
  console.log('currentLimit:', currentLimit);
  console.log('URL params:', new URLSearchParams(window.location.search).toString());
  console.log('searchInput value:', searchInput?.value);
  console.log('minPriceInput value:', minPriceInput?.value);
  console.log('maxPriceInput value:', maxPriceInput?.value);
  console.log('==================');
};

// Función para testear con una subcategoría específica
window.testSubcategory = function(subcategoryId) {
  console.log('[Store] Testing con subcategoría:', subcategoryId);
  currentSubcategoryId = subcategoryId;
  currentPage = 1;
  updateProducts();
};
