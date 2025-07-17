import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";

export default function FloatingCart({ onOpenCart }) {
  const items = useSelector(state => state.cart.items);
  const count = items.reduce((sum, item) => sum + item.cantidad, 0);
  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          className="fixed bottom-6 left-6 z-50 md:hidden"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <motion.button
            onClick={onOpenCart}
            className="relative bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart size={24} />
            <motion.span
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold min-w-[24px] flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          </motion.button>
          {/* Tooltip con total */}
          <motion.div
            className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm font-semibold text-gray-800">
              Total: ${total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              {count} {count === 1 ? 'producto' : 'productos'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 