import React from "react";
import { motion } from "framer-motion";
import { FaMobileAlt } from "react-icons/fa";

const Loader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-cyan-300">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 24 }}
      className="mb-4"
    >
      <img src="/logo.png" alt="Logo Río Cuarto Celulares" className="max-h-36 w-auto drop-shadow-lg" />
    </motion.div>
    <motion.div
      className="w-12 h-12 border-4 border-white border-t-cyan-300 rounded-full animate-spin"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.5, type: "spring", stiffness: 100, damping: 24 }}
    />
    <span className="mt-6 text-white text-lg font-semibold tracking-wide">Cargando...</span>
  </div>
);

export default Loader; 