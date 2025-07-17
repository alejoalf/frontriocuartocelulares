import React from "react";
import { FaMobileAlt, FaTools, FaHeadphones, FaUnlockAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const servicios = [
  { nombre: "Venta de celulares", icono: <FaMobileAlt className="text-blue-600 dark:text-cyan-300" size={56} /> },
  { nombre: "Reparación de equipos", icono: <FaTools className="text-blue-600 dark:text-cyan-300" size={56} /> },
  { nombre: "Accesorios", icono: <FaHeadphones className="text-blue-600 dark:text-cyan-300" size={56} /> },
  { nombre: "Liberación de equipos", icono: <FaUnlockAlt className="text-blue-600 dark:text-cyan-300" size={56} /> },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.06,
      duration: 0.22,
      type: "spring",
      stiffness: 140,
      damping: 16
    } 
  }),
};

const Servicios = () => {
  const [hovered, setHovered] = React.useState(null);
  return (
    <section id="servicios" className="py-20 text-center transition-colors duration-300 text-blue-800 dark:bg-[#111111]">
      <motion.h2 
        className="text-4xl font-extrabold mb-12 text-blue-800 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.22, type: "spring", stiffness: 140, damping: 16 }}
      >
        Nuestros Servicios
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-10">
        {servicios.map((s, i) => (
          <motion.div
            key={s.nombre}
            className="group relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl p-10 w-80 md:w-96 flex flex-col items-center transform transition-all duration-500 cursor-pointer border border-blue-100 hover:border-blue-300 dark:border-gray-700 dark:text-cyan-100"
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            animate={hovered === i ? { scale: 1.07, y: -10 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.18, type: "spring", stiffness: 140, damping: 16 }}
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <motion.div 
              className="mb-4 relative z-10"
              whileHover={{ 
                scale: 1.07,
                rotate: [0, 5],
              }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {s.icono}
            </motion.div>
            <motion.h3 
              className="text-2xl font-semibold mb-2 text-blue-800 dark:text-cyan-100 relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.22, type: "spring", stiffness: 140, damping: 16 }}
            >
              {s.nombre}
            </motion.h3>
            {/* Línea decorativa */}
            <motion.div 
              className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-2"
              initial={{ width: 0 }}
              whileHover={{ width: "60%" }}
              transition={{ duration: 0.22, type: "spring", stiffness: 140, damping: 16 }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Servicios; 