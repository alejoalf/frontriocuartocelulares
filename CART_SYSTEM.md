# Sistema de Carrito de Compras - Río Cuarto Celulares

## 🛒 Características Principales

### ✅ Funcionalidades Implementadas

1. **Carrito Persistente**
   - Almacenamiento en localStorage
   - Persistencia entre sesiones
   - Sincronización automática

2. **Gestión de Productos**
   - Agregar productos al carrito
   - Actualizar cantidades
   - Remover productos
   - Validación de stock en tiempo real

3. **Sistema de Cupones**
   - Cupón "descuento10" (10% de descuento)
   - Validación automática
   - Aplicación/remoción de cupones

4. **Cálculo de Envío**
   - Envío gratis: $50,000+
   - Envío reducido: $25,000+
   - Envío estándar: $5,000
   - Envío express: $12,000

5. **Interfaz de Usuario**
   - CartButton con contador y tooltip
   - CartDrawer con animaciones
   - FloatingCart para móviles
   - Notificaciones Toast

6. **Checkout Profesional**
   - Proceso de 4 pasos
   - Validación de formularios
   - Múltiples métodos de pago
   - Resumen de orden

## 🏗️ Arquitectura

### Estructura de Archivos

```
src/
├── components/
│   ├── CartButton.jsx          # Botón del carrito con tooltip
│   ├── CartDrawer.jsx          # Drawer principal del carrito
│   ├── FloatingCart.jsx        # Carrito flotante para móviles
│   ├── Checkout.jsx            # Proceso de checkout
│   └── Toast.jsx               # Sistema de notificaciones
├── store/
│   ├── cartSlice.js            # Redux slice del carrito
│   └── index.js                # Configuración del store
├── config/
│   └── cart.js                 # Configuración y constantes
├── hooks/
│   └── useCart.js              # Hook personalizado
└── App.jsx                     # Integración principal
```

### Estado del Carrito (Redux)

```javascript
{
  items: [],           // Productos en el carrito
  error: null,         // Mensajes de error
  success: null,       // Mensajes de éxito
  coupon: null,        // Cupón aplicado
  shipping: {          // Configuración de envío
    method: 'standard',
    cost: 0,
    address: null
  },
  isOpen: false,       // Estado del drawer
  loading: false       // Estado de carga
}
```

## 🚀 Uso

### Hook Personalizado

```javascript
import { useCart } from '../hooks/useCart';

function MyComponent() {
  const {
    items,
    count,
    total,
    addItem,
    removeItem,
    updateItemQuantity,
    openCart,
    closeCart
  } = useCart();

  return (
    <button onClick={() => addItem(product)}>
      Agregar al carrito
    </button>
  );
}
```

### Componentes Principales

#### CartButton
```javascript
<CartButton onClick={handleCartClick} />
```

#### CartDrawer
```javascript
<CartDrawer 
  open={isOpen} 
  onClose={handleClose} 
  onCheckout={handleCheckout} 
/>
```

#### FloatingCart
```javascript
<FloatingCart onOpenCart={handleOpenCart} />
```

## 🎨 Personalización

### Configuración de Cupones

```javascript
// config/cart.js
COUPONS: {
  'descuento10': {
    code: 'descuento10',
    discount: 10,
    type: 'percentage',
    description: '10% de descuento'
  }
}
```

### Métodos de Envío

```javascript
SHIPPING_METHODS: [
  {
    id: 'standard',
    name: 'Envío estándar',
    price: 5000,
    time: '3-5 días hábiles'
  }
]
```

### Umbrales de Envío

```javascript
FREE_SHIPPING_THRESHOLD: 50000,    // $50,000
REDUCED_SHIPPING_THRESHOLD: 25000, // $25,000
```

## 🔧 Funcionalidades Avanzadas

### Validación de Stock
- Verificación en tiempo real
- Límites de cantidad por producto
- Mensajes de error informativos

### Notificaciones
- Toast automáticos
- Diferentes tipos (success, error, warning)
- Duración configurable

### Animaciones
- Transiciones suaves
- Feedback visual
- Interacciones responsivas

### Responsive Design
- Adaptación móvil/desktop
- Carrito flotante en móviles
- Tooltips informativos

## 📱 Experiencia de Usuario

### Flujo de Compra
1. Usuario agrega productos
2. Ve notificaciones de confirmación
3. Abre carrito para revisar
4. Aplica cupón (opcional)
5. Procede al checkout
6. Completa formulario de 4 pasos
7. Confirma compra

### Características UX
- Persistencia de datos
- Validación en tiempo real
- Feedback visual inmediato
- Navegación intuitiva
- Diseño moderno y profesional

## 🛠️ Mantenimiento

### Agregar Nuevos Cupones
1. Editar `config/cart.js`
2. Agregar configuración del cupón
3. El sistema lo detectará automáticamente

### Modificar Envíos
1. Actualizar `SHIPPING_METHODS`
2. Ajustar umbrales
3. Los cambios se reflejan inmediatamente

### Personalizar Estilos
- Usar clases de Tailwind CSS
- Modificar componentes individuales
- Mantener consistencia visual

## 🔒 Seguridad

- Validación de datos en frontend y backend
- Sanitización de inputs
- Protección contra manipulación del estado
- Persistencia segura en localStorage

## 📊 Métricas

El sistema incluye:
- Contador de productos
- Cálculo de totales
- Tracking de cupones aplicados
- Estadísticas de envío

---

**Desarrollado para Río Cuarto Celulares**  
*Sistema profesional de e-commerce* 