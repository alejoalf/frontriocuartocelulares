import React from "react";
import { motion } from "framer-motion";

const Header = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#285be7] dark:bg-[#111111]">
    {/* Partículas flotantes eliminadas, fondo transparente */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, type: "spring", stiffness: 140, damping: 16 }}
      className="relative z-10 text-center text-white dark:text-cyan-100 px-4"
    >
      <motion.h1 
        className="text-6xl md:text-8xl font-extrabold drop-shadow mb-4 tracking-tight"
        animate={{
          textShadow: [
            "0 0 20px rgba(255,255,255,0.3)",
            "0 0 40px rgba(255,255,255,0.5)",
            "0 0 20px rgba(255,255,255,0.3)",
          ],
        }}
        transition={{
          duration: 0.22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Tu celular, <span className="text-cyan-200 dark:text-cyan-300">como nuevo</span>
      </motion.h1>
      <motion.p 
        className="text-2xl md:text-3xl mb-8 font-light drop-shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.22, type: "spring", stiffness: 140, damping: 16 }}
      >
        Venta, reparación y accesorios en un solo lugar
      </motion.p>
      <motion.a
        href="#servicios"
        className="inline-block bg-white/90 dark:bg-gray-800/90 dark:text-cyan-200 text-blue-700 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-cyan-100 dark:hover:bg-gray-700 transition-all duration-300"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.22, type: "spring", stiffness: 140, damping: 16 }}
      >
        Ver servicios
      </motion.a>
    </motion.div>
  </section>
);

export default Header; 