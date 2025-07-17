import React from "react";
import { motion } from "framer-motion";

const pasos = [
  {
    titulo: "01.",
    svg: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="60" fill="#E0F2FE" />
        <path d="M40 80 L60 40 L80 80 Z" fill="#2563eb" />
        <rect x="55" y="60" width="10" height="25" rx="3" fill="#38bdf8" />
      </svg>
    ),
    texto: "Traes tu equipo a nuestro local o nos contactás por WhatsApp.",
  },
  {
    titulo: "02.",
    svg: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="60" fill="#bae6fd" />
        <rect x="40" y="40" width="40" height="40" rx="8" fill="#2563eb" />
        <rect x="55" y="55" width="10" height="20" rx="3" fill="#fff" />
        <circle cx="60" cy="60" r="6" fill="#38bdf8" />
      </svg>
    ),
    texto: "Diagnosticamos el problema y realizamos la reparación.",
  },
  {
    titulo: "03.",
    svg: (
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="60" fill="#7dd3fc" />
        <rect x="45" y="35" width="30" height="50" rx="8" fill="#2563eb" />
        <rect x="55" y="60" width="10" height="15" rx="3" fill="#fff" />
        <circle cx="60" cy="85" r="4" fill="#38bdf8" />
      </svg>
    ),
    texto: "Te devolvemos tu equipo listo y con garantía.",
  },
];

const ComoFunciona = () => (
  <section className="py-20 bg-blue-700/90 dark:bg-[#111111] text-white text-center">
    <h2 className="text-4xl font-extrabold mb-12">¿Cómo funciona?</h2>
    <div className="flex flex-col md:flex-row justify-center gap-12 max-w-6xl mx-auto">
      {pasos.map((paso, i) => (
        <motion.div
          key={i}
          className="flex-1 flex flex-col items-center px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <div className="mb-6">{paso.svg}</div>
          <div className="text-3xl font-bold mb-2 drop-shadow-lg">{paso.titulo}</div>
          <p className="text-lg font-medium drop-shadow-sm max-w-xs mx-auto">{paso.texto}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default ComoFunciona;  