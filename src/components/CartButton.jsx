import React from "react";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";

export default function CartButton({ onClick }) {
  const items = useSelector(state => state.cart.items);
  const count = items.reduce((sum, p) => sum + p.cantidad, 0);
  return (
    <button onClick={onClick} className="relative p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition">
      <FaShoppingCart size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
          {count}
        </span>
      )}
    </button>
  );
} 