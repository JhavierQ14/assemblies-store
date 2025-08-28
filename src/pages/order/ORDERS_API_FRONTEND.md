# API de Órdenes - Documentación para Frontend

## Base URL
```
/api/orders
```

## Autenticación
Todos los endpoints requieren autenticación JWT en el header:
```
Authorization: Bearer <jwt_token>
```

---

## 📋 Tabla de Contenidos
1. [Enums y Tipos de Datos](#enums-y-tipos-de-datos)
2. [Estructura de Respuestas](#estructura-de-respuestas)
3. [Endpoints](#endpoints)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Códigos de Error](#códigos-de-error)

---

## 🔧 Enums y Tipos de Datos

### PaymentMethod (Métodos de Pago)
```javascript
const PaymentMethods = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card", 
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  PAYPAL: "PayPal",
  CASH_ON_DELIVERY: "Cash on Delivery"
}
```

### OrderStatus (Estados de Orden)
```javascript
const OrderStatuses = {
  PROCESSING: "Processing",          // Estado inicial - esperando pago
  CONFIRMED: "Confirmed",            // Pago confirmado
  PAYMENT_FAILED: "Payment Failed",  // Fallo en el pago
  EXPIRED: "Expired",               // Orden expirada sin pago
  PREPARING: "Preparing",           // Preparando para envío
  SHIPPED: "Shipped",              // Enviado
  DELIVERED: "Delivered",          // Entregado
  CANCELLED: "Cancelled",          // Cancelado
  REFUNDED: "Refunded"            // Reembolsado
}
```

### Transiciones de Estado Permitidas
```
PROCESSING → CONFIRMED | CANCELLED | PAYMENT_FAILED | EXPIRED
CONFIRMED → PREPARING | CANCELLED | REFUNDED
PAYMENT_FAILED → CANCELLED | PROCESSING (reintentar)
EXPIRED → CANCELLED | PROCESSING (reintentar)
PREPARING → SHIPPED | CANCELLED
SHIPPED → DELIVERED
DELIVERED → REFUNDED
CANCELLED → (estado final)
REFUNDED → (estado final)
```

---

## 📤 Estructura de Respuestas

### Respuesta Estándar
```typescript
interface ApiResponse<T> {
  success: string;     // "true" | "false"
  message: string;     // Mensaje descriptivo
  data: T | null;      // Datos específicos del endpoint
}
```

### Orden Completa (OrderResponseDto)
```typescript
interface OrderResponseDto {
  id: string;                              // UUID de la orden
  userId: string;                          // ID del usuario
  products: OrderProductResponseDto[];     // Lista de productos
  total: number;                          // Total en decimal
  status: string;                         // Estado actual (ver OrderStatus)
  orderDate: string;                      // ISO date string
  statusUpdateDate: string;               // ISO date string
  shippingAddress: ShippingAddressResponseDto;
  paymentMethod: string;                  // Ver PaymentMethod
}
```

### Producto en Orden (OrderProductResponseDto)
```typescript
interface OrderProductResponseDto {
  productId: string;     // ID del producto
  name: string;          // Nombre del producto
  unitPrice: number;     // Precio unitario
  quantity: number;      // Cantidad
  subtotal: number;      // unitPrice * quantity
}
```

### Dirección de Envío (ShippingAddressResponseDto)
```typescript
interface ShippingAddressResponseDto {
  street: string;        // Dirección
  city: string;          // Ciudad
  country: string;       // País
  postalCode: string;    // Código postal
}
```

---

## 🌐 Endpoints

### 1. 🛒 Crear Orden
```http
POST /api/orders
```

**Permisos**: `CLIENT`, `ADMIN`, `MANAGEMENT`

**Request Body**:
```typescript
interface CreateOrderRequestDto {
  products: OrderProductRequestDto[];      // REQUERIDO - Lista de productos
  shippingAddress: ShippingAddressRequestDto;  // REQUERIDO - Dirección de envío
  paymentMethod: string;                   // REQUERIDO - Método de pago (ver enum)
}

interface OrderProductRequestDto {
  productId: string;     // REQUERIDO - ID del producto
  name: string;          // REQUERIDO - Nombre del producto
  unitPrice: number;     // REQUERIDO - Precio unitario
  quantity: number;      // REQUERIDO - Cantidad (> 0)
}

interface ShippingAddressRequestDto {
  street: string;        // REQUERIDO - Dirección
  city: string;          // REQUERIDO - Ciudad
  country: string;       // REQUERIDO - País
  postalCode: string;    // REQUERIDO - Código postal
}
```

**Response (201 Created)**:
```typescript
interface CreateOrderResponse {
  success: "true";
  message: "Order created successfully";
  data: {
    order: OrderResponseDto;    // Orden creada
    paymentUrl: string | null;  // URL de pago de Stripe (si aplica)
    clientSecret: string | null; // Igual que paymentUrl (compatibilidad)
  }
}
```

**Casos especiales**:
- Si `paymentMethod` es `CREDIT_CARD` o `DEBIT_CARD`, se incluye `paymentUrl` para Stripe
- El `userId` se extrae automáticamente del JWT token
- Se verifica y reduce el stock automáticamente

---

### 2. 🔍 Obtener Orden por ID
```http
GET /api/orders/{id}
```

**Permisos**: `CLIENT`, `ADMIN`, `MANAGEMENT`

**Response (200 OK)**:
```typescript
interface GetOrderResponse {
  success: "true";
  message: "Orden encontrada";
  data: OrderResponseDto;
}
```

**Response (404 Not Found)**:
```typescript
interface ErrorResponse {
  success: "false";
  message: "Orden no encontrada";
  data: null;
}
```

---

### 3. 📋 Obtener Todas las Órdenes
```http
GET /api/orders/all
```

**Permisos**: `ADMIN`, `MANAGEMENT` únicamente

**Response (200 OK)**:
```typescript
interface GetAllOrdersResponse {
  success: "true";
  message: "Órdenes obtenidas exitosamente";
  data: OrderResponseDto[];
}
```

---

### 4. 👤 Obtener Órdenes del Usuario Autenticado (Recomendado)
```http
GET /api/orders/user-orders
```

**Permisos**: `CLIENT`, `ADMIN`, `MANAGEMENT`

**Características**:
- ✅ **Más seguro**: El `userId` se extrae automáticamente del JWT token
- ✅ **Más simple**: No necesitas pasar el `userId` en la URL
- ✅ **Mejor UX**: El frontend no necesita conocer el `userId`

**Response (200 OK)**:
```typescript
interface GetUserOrdersResponse {
  success: "true";
  message: "Órdenes del usuario obtenidas";
  data: OrderResponseDto[];
}
```

---

### 5. 👤 Obtener Órdenes por Usuario (Deprecated)
```http
GET /api/orders/user/{userId}
```

**⚠️ DEPRECATED**: Usar `/user-orders` en su lugar

**Permisos**: `CLIENT`, `ADMIN`, `MANAGEMENT`

**Response (200 OK)**:
```typescript
interface GetUserOrdersResponse {
  success: "true";
  message: "Órdenes del usuario obtenidas";
  data: OrderResponseDto[];
}
```

---

### 6. 📊 Obtener Órdenes por Estado
```http
GET /api/orders/status/{status}
```

**Permisos**: `ADMIN`, `MANAGEMENT` únicamente

**Parámetros**:
- `status`: Cualquier valor del enum `OrderStatus` (ejemplo: "Processing", "Confirmed", etc.)

**Response (200 OK)**:
```typescript
interface GetOrdersByStatusResponse {
  success: "true";
  message: "Orders by status retrieved";
  data: OrderResponseDto[];
}
```

**Response (400 Bad Request)**:
```typescript
interface ErrorResponse {
  success: "false";
  message: "Invalid status: {status}";
  data: null;
}
```

---

### 7. ✏️ Actualizar Estado de Orden
```http
PATCH /api/orders/{id}/status
```

**Permisos**: `ADMIN`, `MANAGEMENT` únicamente

**Request Body**:
```typescript
interface UpdateOrderStatusRequestDto {
  status: string;  // REQUERIDO - Nuevo estado (ver enum OrderStatus)
}
```

**Response (200 OK)**:
```typescript
interface UpdateStatusResponse {
  success: "true";
  message: "Order status updated";
  data: OrderResponseDto;
}
```

**Response (400 Bad Request)**:
```typescript
interface ErrorResponse {
  success: "false";
  message: "Error updating status: {reason}";
  data: null;
}
```

**Validaciones**:
- El estado debe ser válido según las transiciones permitidas
- Ejemplo: No se puede cambiar de "DELIVERED" a "PROCESSING"

---

### 8. ❌ Cancelar Orden
```http
PATCH /api/orders/{id}/cancel
```

**Permisos**: `CLIENT`, `ADMIN`, `MANAGEMENT`

**Response (200 OK)**:
```typescript
interface CancelOrderResponse {
  success: "true";
  message: "Orden cancelada exitosamente";
  data: OrderResponseDto;
}
```

**Response (400 Bad Request)**:
```typescript
interface ErrorResponse {
  success: "false";
  message: "Error al cancelar la orden: {reason}";
  data: null;
}
```

**Validaciones**:
- Solo el propietario de la orden puede cancelarla (excepto ADMIN/MANAGEMENT)
- Solo se pueden cancelar órdenes en estados: `PROCESSING`, `CONFIRMED`, `PREPARING`, `PAYMENT_FAILED`, `EXPIRED`
- Se restaura automáticamente el stock de productos
- Se envía email de cancelación automáticamente

---

### 9. 🗑️ Eliminar Orden
```http
DELETE /api/orders/{id}
```

**Permisos**: `ADMIN` únicamente

**Response (200 OK)**:
```typescript
interface DeleteOrderResponse {
  success: "true";
  message: "Orden eliminada exitosamente";
  data: null;
}
```

**Response (400 Bad Request)**:
```typescript
interface ErrorResponse {
  success: "false";
  message: "Error al eliminar orden: {reason}";
  data: null;
}
```

**Validaciones**:
- No se pueden eliminar órdenes `SHIPPED` o `DELIVERED`
- Se restaura automáticamente el stock si la orden estaba en `PROCESSING`

---

## 💡 Ejemplos de Uso

### Crear una Orden con Pago por Tarjeta
```javascript
const createOrder = async () => {
  const orderData = {
    products: [
      {
        productId: "prod-123",
        name: "iPhone 15",
        unitPrice: 999.99,
        quantity: 1
      },
      {
        productId: "prod-456", 
        name: "AirPods Pro",
        unitPrice: 249.99,
        quantity: 2
      }
    ],
    shippingAddress: {
      street: "123 Main St, Apt 4B",
      city: "New York", 
      country: "USA",
      postalCode: "10001"
    },
    paymentMethod: "CREDIT_CARD"
  };

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  
  if (result.success === "true") {
    const { order, paymentUrl } = result.data;
    console.log('Orden creada:', order.id);
    
    // Si hay URL de pago, redirigir a Stripe
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }
};
```

### Obtener Órdenes del Usuario Autenticado (Nuevo Método Recomendado)
```javascript
const getUserOrders = async () => {
  const response = await fetch('/api/orders/user-orders', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  
  if (result.success === "true") {
    return result.data; // Array de OrderResponseDto
  }
  
  throw new Error(result.message);
};

// Uso simple - no necesitas conocer el userId
const orders = await getUserOrders();
console.log('Mis órdenes:', orders);
```

### Obtener Órdenes de un Usuario (Método Anterior)
```javascript
const getUserOrders = async (userId) => {
  const response = await fetch(`/api/orders/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  
  if (result.success === "true") {
    return result.data; // Array de OrderResponseDto
  }
  
  throw new Error(result.message);
};
```

### Cancelar una Orden
```javascript
const cancelOrder = async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  
  if (result.success === "true") {
    console.log('Orden cancelada:', result.data);
    return result.data;
  }
  
  throw new Error(result.message);
};
```

### Filtrar Órdenes por Estado (Solo Admin)
```javascript
const getOrdersByStatus = async (status) => {
  const response = await fetch(`/api/orders/status/${status}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  
  if (result.success === "true") {
    return result.data; // Array de OrderResponseDto
  }
  
  throw new Error(result.message);
};

// Ejemplo de uso
const processingOrders = await getOrdersByStatus('Processing');
const shippedOrders = await getOrdersByStatus('Shipped');
```

---

## ⚠️ Códigos de Error

### HTTP Status Codes
- `200` - OK: Operación exitosa
- `201` - Created: Orden creada exitosamente  
- `400` - Bad Request: Error en los datos enviados
- `401` - Unauthorized: Token JWT inválido o faltante
- `403` - Forbidden: Sin permisos suficientes
- `404` - Not Found: Orden no encontrada
- `500` - Internal Server Error: Error interno del servidor

### Errores Comunes

#### Error de Stock Insuficiente
```typescript
{
  success: "false",
  message: "Error creating order: Stock insuficiente para el producto: prod-123",
  data: null
}
```

#### Error de Transición de Estado Inválida
```typescript
{
  success: "false", 
  message: "Error updating status: From DELIVERED you can only change to REFUNDED",
  data: null
}
```

#### Error de Permisos para Cancelar
```typescript
{
  success: "false",
  message: "Error al cancelar la orden: No tienes permisos para cancelar esta orden", 
  data: null
}
```

#### Error de Estado No Cancelable
```typescript
{
  success: "false",
  message: "Error al cancelar la orden: La orden no puede ser cancelada en su estado actual: Delivered",
  data: null
}
```

---

## 🔐 Seguridad y Permisos

### Mejoras de Seguridad (Nuevas)
- **Extracción automática del userId**: El nuevo endpoint `/user-orders` extrae el `userId` directamente del campo `jti` del JWT token
- **No exposición de IDs**: El frontend no necesita manejar o conocer el `userId`
- **Validación mejorada**: Se valida el token JWT directamente sin consultas adicionales a la base de datos

### Matriz de Permisos
| Endpoint | CLIENT | ADMIN | MANAGEMENT |
|----------|--------|-------|------------|
| POST /orders | ✅ | ✅ | ✅ |
| GET /orders/{id} | ✅ | ✅ | ✅ |
| GET /orders/all | ❌ | ✅ | ✅ |
| GET /orders/user-orders | ✅ | ✅ | ✅ |
| GET /orders/user/{userId} | ✅* | ✅ | ✅ |
| GET /orders/status/{status} | ❌ | ✅ | ✅ |
| PATCH /orders/{id}/status | ❌ | ✅ | ✅ |
| PATCH /orders/{id}/cancel | ✅* | ✅ | ✅ |
| DELETE /orders/{id} | ❌ | ✅ | ❌ |

*\* CLIENT solo puede acceder a sus propias órdenes*

### Notas de Seguridad
- El `userId` se extrae automáticamente del JWT usando el campo `jti`, no se puede falsificar
- **Nuevo método recomendado**: Usar `/user-orders` en lugar de `/user/{userId}` para mayor seguridad
- Las validaciones de negocio se aplican en el backend
- Los clientes solo pueden cancelar sus propias órdenes
- El stock se maneja automáticamente para prevenir overselling

### Extracción del userId del Token JWT
El sistema ahora utiliza el campo `jti` (JWT ID) del token para extraer el `userId` directamente, lo que:
- ✅ **Mejora la performance**: No requiere consultas adicionales a la base de datos
- ✅ **Aumenta la seguridad**: El `userId` no puede ser manipulado desde el frontend
- ✅ **Simplifica el código**: El frontend no necesita manejar userIds

---

## 📝 Notas Adicionales

### Integración con Stripe
- Solo se crea sesión de pago para `CREDIT_CARD` y `DEBIT_CARD`
- La URL de pago redirige a Stripe Checkout
- Después del pago, Stripe redirige a las URLs configuradas:
  - Success: `{frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`
  - Cancel: `{frontend_url}/payment/cancel`

### Gestión de Stock
- El stock se reduce automáticamente al crear la orden
- Se restaura automáticamente al cancelar o eliminar órdenes
- Se verifica disponibilidad antes de procesar el pago

### Emails Automáticos
- Se envía email de cancelación automáticamente
- Los templates están en el backend, no requieren configuración frontend

### Estados y Flujo de Negocio
```
[CREAR ORDEN] → PROCESSING → [PAGO] → CONFIRMED → PREPARING → SHIPPED → DELIVERED
                    ↓             ↓         ↓         ↓
                CANCELLED     CANCELLED  CANCELLED  REFUNDED
```

Esta documentación cubre todos los aspectos necesarios para implementar la funcionalidad de órdenes en el frontend. Para cualquier duda adicional, consultar el código fuente o contactar al equipo de backend.
