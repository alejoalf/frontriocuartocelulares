# Sistema de Carrito y Categorías Dinámicas

## Sistema de Carrito

### Características principales:
- **Persistencia**: Los productos se mantienen en el carrito incluso al recargar la página
- **Sincronización en tiempo real**: Cambios de stock se reflejan automáticamente
- **Validación de stock**: No se pueden agregar más productos que el stock disponible
- **Interfaz intuitiva**: Drawer lateral con resumen de compra

### Componentes principales:
- `CartDrawer.jsx`: Drawer lateral con el carrito
- `FloatingCart.jsx`: Botón flotante para abrir el carrito
- `CartButton.jsx`: Botón en la navbar
- `useCart.js`: Hook personalizado para manejo del carrito
- `cartSlice.js`: Estado global con Redux Toolkit

### Funcionalidades:
1. **Agregar productos**: Click en "Agregar al carrito"
2. **Modificar cantidad**: Botones +/- en el carrito
3. **Eliminar productos**: Botón de eliminar individual
4. **Vaciar carrito**: Botón para limpiar todo
5. **Proceder al checkout**: Redirección a página de pago

## Sistema de Categorías Dinámicas

### Características principales:
- **Generación automática**: Las categorías se crean basándose en los productos existentes
- **Sugerencias inteligentes**: Al agregar productos, se muestran categorías existentes
- **Flexibilidad**: El administrador puede crear nuevas categorías libremente
- **Estadísticas**: Panel de administración muestra estadísticas por categoría

### Componentes principales:
- `Categorias.jsx`: Muestra las categorías dinámicamente generadas
- `Productos.jsx`: Filtra productos por categoría y subcategoría
- `AdminPanel.jsx`: Formulario con sugerencias de categorías existentes
- `AdminHome.jsx`: Panel con estadísticas de categorías

### Funcionalidades:

#### Vista Pública:
1. **Categorías dinámicas**: Se generan automáticamente basándose en los productos
2. **Contador de productos**: Muestra cuántos productos hay en cada categoría
3. **Imagen representativa**: Usa la primera imagen disponible de la categoría
4. **Colores automáticos**: Asigna colores de forma cíclica a las categorías
5. **Filtrado por subcategorías**: Permite filtrar dentro de cada categoría

#### Panel de Administración:
1. **Sugerencias de categorías**: Al escribir, muestra categorías existentes
2. **Sugerencias de subcategorías**: Filtradas por la categoría seleccionada
3. **Estadísticas**: Muestra cantidad de productos y stock total por categoría
4. **Flexibilidad**: Permite crear nuevas categorías y subcategorías
5. **Validación**: Asegura que se completen categoría y subcategoría

### Cómo funciona:

#### Generación de Categorías:
```javascript
const generarCategorias = (productos) => {
  const categoriasMap = new Map();
  
  productos.forEach(producto => {
    const categoria = producto.categoria || "Sin categoría";
    
    if (!categoriasMap.has(categoria)) {
      categoriasMap.set(categoria, {
        nombre: categoria,
        productos: [],
        cantidad: 0,
        imagen: null
      });
    }
    
    const cat = categoriasMap.get(categoria);
    cat.productos.push(producto);
    cat.cantidad++;
    
    if (!cat.imagen && producto.imagen) {
      cat.imagen = producto.imagen;
    }
  });
  
  return Array.from(categoriasMap.values());
};
```

#### Sugerencias en el Formulario:
```javascript
const categoriasExistentes = useMemo(() => {
  const categorias = new Set();
  productosExistentes.forEach(p => {
    if (p.categoria) categorias.add(p.categoria);
  });
  return Array.from(categorias).sort();
}, [productosExistentes]);
```

### Ventajas del Sistema Dinámico:

1. **Flexibilidad**: No hay categorías predefinidas, se adapta a los productos
2. **Escalabilidad**: Se pueden agregar nuevas categorías sin modificar código
3. **Consistencia**: Las categorías se mantienen consistentes entre productos
4. **Experiencia de usuario**: Sugerencias facilitan la entrada de datos
5. **Mantenimiento**: No requiere actualizaciones de código para nuevas categorías

### Flujo de Trabajo:

1. **Administrador agrega productos**: Completa categoría y subcategoría
2. **Sistema genera categorías**: Automáticamente basándose en los productos
3. **Vista pública muestra categorías**: Con contadores y filtros
4. **Usuarios navegan**: Por categorías y subcategorías
5. **Estadísticas se actualizan**: Automáticamente en el panel de admin

### Endpoints del Backend:

- `GET /api/productos`: Obtiene todos los productos
- `GET /api/categorias`: Obtiene categorías y subcategorías disponibles
- `POST /api/productos`: Crea nuevo producto (requiere autenticación)
- `PUT /api/productos/:id`: Actualiza producto (requiere autenticación)
- `DELETE /api/productos/:id`: Elimina producto (requiere autenticación)

### WebSocket Events:

- `stock-updated`: Cuando cambia el stock de un producto
- `producto-eliminado`: Cuando se elimina un producto

Este sistema proporciona una experiencia de usuario fluida y una gestión administrativa eficiente, permitiendo que el negocio evolucione sin restricciones de categorías predefinidas. 