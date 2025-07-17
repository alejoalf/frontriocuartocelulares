import { useSelector, useDispatch } from 'react-redux';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart
} from '../store/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  // Acceso simple al estado del carrito
  const items = useSelector(state => state.cart.items);

  // Acciones básicas
  const addItem = (product, quantity = 1) => {
    dispatch(addToCart({ ...product, cantidad: quantity }));
  };
  const removeItem = (productId) => {
    dispatch(removeFromCart(productId));
  };
  const updateItemQuantity = (productId, quantity, stock) => {
    dispatch(updateQuantity({ id: productId, cantidad: quantity, stock }));
  };
  const clearCartItems = () => {
    dispatch(clearCart());
  };

  // Cálculos simples
  const count = items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const total = subtotal;

  return {
    items,
    count,
    subtotal,
    total,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCartItems
  };
}; 