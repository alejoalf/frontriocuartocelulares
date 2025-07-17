import { createSlice } from '@reduxjs/toolkit';

// Leer carrito de localStorage si existe
const loadCart = () => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch {}
};

const initialState = {
  items: loadCart(), // {id, nombre, precio, imagen, cantidad, stock, ...}
  error: null, // Para feedback de errores de stock
  success: null, // Para feedback de éxito
  productos: [], // Agregar productos al store
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(p => p.id === item.id);
      if (existing) {
        // Validar stock
        if (existing.cantidad + (item.cantidad || 1) > (item.stock || existing.stock || 1)) {
          state.error = 'No hay suficiente stock disponible';
          state.success = null;
        } else {
          existing.cantidad += item.cantidad || 1;
          state.error = null;
          state.success = 'Producto agregado al carrito';
        }
      } else {
        if ((item.cantidad || 1) > (item.stock || 1)) {
          state.error = 'No hay suficiente stock disponible';
          state.success = null;
        } else {
          state.items.push({ ...item, cantidad: item.cantidad || 1 });
          state.error = null;
          state.success = 'Producto agregado al carrito';
        }
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
      state.error = null;
      state.success = null;
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, cantidad, stock } = action.payload;
      const item = state.items.find(p => p.id === id);
      if (item) {
        const maxStock = stock || item.stock || 1;
        if (cantidad > maxStock) {
          state.error = 'No hay suficiente stock disponible';
          state.success = null;
        } else if (cantidad > 0) {
          item.cantidad = cantidad;
          state.error = null;
          state.success = null;
        }
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
      state.success = null;
      saveCart(state.items);
    },
    clearCartError: (state) => {
      state.error = null;
    },
    clearCartSuccess: (state) => {
      state.success = null;
    },
    // Nuevas acciones para productos
    setProductos: (state, action) => {
      state.productos = action.payload;
    },
    updateProductoStock: (state, action) => {
      const { productoId, stock } = action.payload;
      const producto = state.productos.find(p => p.id === productoId);
      if (producto) {
        producto.stock = stock;
      }
      // También actualizar stock en items del carrito
      const itemInCart = state.items.find(item => item.id === productoId);
      if (itemInCart) {
        itemInCart.stock = stock;
      }
    },
    removeProducto: (state, action) => {
      const productoId = action.payload;
      state.productos = state.productos.filter(p => p.id !== productoId);
      // Remover del carrito si está ahí
      state.items = state.items.filter(item => item.id !== productoId);
      saveCart(state.items);
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  clearCartError, 
  clearCartSuccess,
  setProductos,
  updateProductoStock,
  removeProducto
} = cartSlice.actions;
export default cartSlice.reducer; 