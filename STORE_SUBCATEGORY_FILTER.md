# Funcionalidad de Filtro por Subcategoría - Store

## ✅ **Problema Resuelto**

**Antes**: La tienda siempre hacía peticiones genéricas sin considerar el parámetro `subcategoryId` en la URL.

**Ahora**: La tienda detecta automáticamente si se accede con `subcategoryId` y filtra los productos correspondientes.

## 🔧 **Implementación Realizada**

### 1. **Detección de Subcategoría en URL**
```javascript
// Detecta automáticamente subcategoryId en la URL
currentSubcategoryId = getSubcategoryIdFromUrl();
```

### 2. **Filtro Integrado en Peticiones**
```javascript
// Incluye subCategoryId en todas las peticiones cuando existe
function updateProducts() {
  const params = {
    page: currentPage,
    limit: currentLimit,
    name: searchInput.value,
    minPrice: minPriceInput.value,
    maxPrice: maxPriceInput.value
  };
  
  if (currentSubcategoryId) {
    params.subCategoryId = currentSubcategoryId;
  }
  
  renderProducts(params);
}
```

### 3. **Indicador Visual**
- Cuando hay filtro activo por subcategoría, se muestra un mensaje informativo
- Botón para limpiar el filtro y ver todos los productos

### 4. **Logs de Debug Mejorados**
- Logs en el cliente para ver parámetros enviados
- Logs en el servicio para verificar peticiones
- Función `debugStore()` para inspección

## 🚀 **Rutas Soportadas**

### Tienda General
```
http://localhost:5174/pages/store/store.html
```
- Muestra todos los productos
- Petición: `GET /api/products?page=1&limit=6`

### Tienda con Subcategoría
```
http://localhost:5174/pages/store/store.html?subcategoryId=85792b43-0fd3-4a51-88cf-9bb5915583b3
```
- Muestra solo productos de esa subcategoría
- Petición: `GET /api/products?page=1&limit=6&subCategoryId=85792b43-0fd3-4a51-88cf-9bb5915583b3`

## 🛠️ **Funciones de Debug/Testing**

### En la consola del navegador:

```javascript
// Ver estado actual de la tienda
debugStore();

// Probar con una subcategoría específica
testSubcategory('85792b43-0fd3-4a51-88cf-9bb5915583b3');

// Limpiar filtro de subcategoría
clearSubcategoryFilter();
```

## 📊 **Flujo Completo**

### Acceso Directo a Store
1. Usuario visita `/pages/store/store.html`
2. `getSubcategoryIdFromUrl()` retorna `null`
3. Petición genérica: `GET /api/products?page=1&limit=6`

### Acceso desde Menú de Categorías
1. Usuario hace clic en subcategoría del megamenú
2. Navega a `/pages/store/store.html?subcategoryId=XXX`
3. `getSubcategoryIdFromUrl()` retorna el ID
4. Petición filtrada: `GET /api/products?page=1&limit=6&subCategoryId=XXX`
5. Se muestra indicador visual del filtro activo

### Navegación dentro de Store
- Cambios de página mantienen el filtro de subcategoría
- Búsquedas y filtros de precio mantienen el filtro de subcategoría
- Botón "Ver todos" elimina el filtro de subcategoría

## 🔍 **Verificación**

### Para verificar que funciona:

1. **Acceso directo**: Abre `/pages/store/store.html` y verifica que se cargan todos los productos

2. **Con subcategoría**: Abre `/pages/store/store.html?subcategoryId=test` y verifica:
   - Se muestra el mensaje "Mostrando productos de la subcategoría seleccionada"
   - La petición incluye `subCategoryId=test`
   - Se puede limpiar el filtro con el botón "Ver todos"

3. **Debug**: Usa `debugStore()` en la consola para ver el estado interno

El sistema ahora maneja correctamente ambos casos de uso manteniendo la funcionalidad existente y agregando el filtro por subcategoría cuando es necesario.
