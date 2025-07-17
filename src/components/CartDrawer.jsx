import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart, clearCartError, clearCartSuccess } from "../store/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaTrash, FaTimes, FaBoxOpen, FaMinus, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { useCart } from "../hooks/useCart";
import { useSocket } from "../hooks/useSocket";

export default function CartDrawer({ open, onClose, onCheckout, addToast }) {
  const items = useSelector(state => state.cart.items);
  const error = useSelector(state => state.cart.error);
  const success = useSelector(state => state.cart.success);
  const dispatch = useDispatch();
  const socket = useSocket();
  const total = items.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const subtotal = total;
  // Simulación de envío
  const envio = items.length > 0 ? (total > 50000 ? 0 : 5000) : 0;
  const totalFinal = subtotal + envio;

  // Al cerrar el Drawer, limpiar el error y el mensaje de éxito
  const handleClose = () => {
    dispatch(clearCartError());
    dispatch(clearCartSuccess());
    if (onClose) onClose();
  };

  // Toasts para feedback de acciones
  useEffect(() => {
    if (success && addToast) {
      addToast(success, "success");
      dispatch(clearCartSuccess());
    }
  }, [success, addToast, dispatch]);
  useEffect(() => {
    if (error && addToast) {
      addToast(error, "error");
      dispatch(clearCartError());
    }
  }, [error, addToast, dispatch]);

  // Acciones con feedback
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    dispatch(clearCartError());
    dispatch(clearCartSuccess());
    if (addToast) addToast("Producto eliminado del carrito", "info");
  };
  const handleClear = () => {
    dispatch(clearCart());
    dispatch(clearCartError());
    dispatch(clearCartSuccess());
    if (addToast) addToast("Carrito vaciado", "info");
  };
  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    if (addToast) addToast("¡Listo para finalizar la compra!", "success");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* Overlay blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={handleClose}
            style={{ pointerEvents: open ? 'auto' : 'none' }}
          />
          {/* Drawer animado */}
          <motion.aside
            className="ml-auto w-full max-w-md h-full bg-white/90 dark:bg-gray-900/95 shadow-2xl flex flex-col relative pointer-events-auto border-l border-blue-100 dark:border-gray-800"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18, duration: 0.28 }}
            aria-label="Carrito de compras"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b bg-white/80 dark:bg-gray-900/80 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <FaShoppingCart className="text-blue-700 dark:text-cyan-200 text-2xl" />
                <h2 className="text-2xl font-extrabold text-blue-800 dark:text-cyan-100 tracking-tight">Carrito</h2>
                {items.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-700 dark:bg-cyan-900 dark:text-cyan-200 rounded-full px-3 py-1 text-xs font-bold">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                )}
              </div>
              <button onClick={handleClose} className="text-2xl font-bold hover:text-red-600 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Cerrar carrito"><FaTimes /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pb-36">
              <AnimatePresence>
                {success && (
                  <motion.div
                    className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.22 }}
                  >
                    {success}
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.22 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-16 gap-4">
                  <FaBoxOpen className="text-5xl mb-2" />
                  <span className="text-lg font-semibold">El carrito está vacío.</span>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map(item => (
                    <motion.li
                      key={item.id}
                      className="flex gap-4 items-center border-b pb-3 group relative bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-sm hover:shadow-lg transition-all"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.18 }}
                    >
                      <img src={item.imagen || "/logo.png"} alt={item.nombre} className="w-16 h-16 object-contain rounded border bg-white" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold break-words text-blue-900 dark:text-cyan-100">{item.nombre}</div>
                        <div className="text-sm text-gray-500">${Number(item.precio).toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => { dispatch(updateQuantity({ id: item.id, cantidad: item.cantidad - 1, stock: item.stock })); dispatch(clearCartError()); dispatch(clearCartSuccess()); }} disabled={item.cantidad <= 1} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50" aria-label="Quitar uno"><FaMinus /></button>
                          <span className="font-bold text-lg">{item.cantidad}</span>
                          <button onClick={() => { dispatch(updateQuantity({ id: item.id, cantidad: item.cantidad + 1, stock: item.stock })); dispatch(clearCartError()); dispatch(clearCartSuccess()); }} disabled={item.stock !== undefined && item.cantidad >= item.stock} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition disabled:opacity-50" aria-label="Agregar uno"><FaPlus /></button>
                          {item.stock !== undefined && item.cantidad >= item.stock && (
                            <span className="ml-2 text-xs text-red-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Stock máximo</span>
                          )}
                          {item.stock !== undefined && item.stock <= 3 && item.stock > 0 && (
                            <span className="ml-2 text-xs text-yellow-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Stock bajo</span>
                          )}
                          {item.stock !== undefined && item.stock === 0 && (
                            <span className="ml-2 text-xs text-red-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Sin stock</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-red-500 font-bold text-lg ml-2 opacity-70 group-hover:opacity-100 transition p-2 rounded-full hover:bg-red-100" aria-label="Eliminar producto"><FaTrash /></button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
            {/* Total y acciones fijos abajo */}
            <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/95 border-t p-6 z-20 shadow-2xl">
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between text-base">
                  <span className="text-gray-700 dark:text-cyan-100">Subtotal:</span>
                  <span className="font-semibold text-blue-800 dark:text-cyan-200">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-700 dark:text-cyan-100">Envío:</span>
                  <span className="font-semibold">{envio === 0 ? <span className="text-green-600 font-bold">Gratis</span> : `$${envio.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span className="text-blue-900 dark:text-cyan-100">Total:</span>
                  <span className="text-blue-700 dark:text-cyan-200">${totalFinal.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={handleClear} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded font-semibold transition flex items-center justify-center gap-2 text-base"><FaTrash /> Vaciar</button>
                <button onClick={handleCheckout} className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded font-bold transition flex items-center justify-center gap-2 text-base" disabled={items.length === 0}><FaShoppingCart /> Finalizar compra</button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 