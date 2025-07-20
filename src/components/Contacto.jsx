import React from "react";
import { FaWhatsapp, FaEnvelope, FaInstagram, FaFacebook, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Contacto = () => {
  return (
    <section id="contacto" className="py-20 text-center relative transition-colors duration-300 dark:bg-[#111111]">
      {/* Botón flotante de WhatsApp en móvil */}
      <a
        href="https://wa.me/543584357917?text=Bienvenido%20a%20R%C3%ADo%20Cuarto%20Celulares%2C%20escribe%20tu%20consulta%20en%20el%20siguiente%20mensaje"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition md:hidden animate-bounce"
        title="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.22, type: 'spring', stiffness: 140, damping: 16 }}
        className="max-w-lg mx-auto"
      >
        <h2 className="text-4xl font-extrabold mb-8 text-blue-700 dark:text-cyan-200 tracking-tight">Contacto</h2>
        <div className="flex flex-col gap-4 w-full max-w-[500px] mx-auto mb-8 mt-24">
          <a
            href="https://wa.me/543584357917?text=Bienvenido%20a%20R%C3%ADo%20Cuarto%20Celulares%2C%20escribe%20tu%20consulta%20en%20el%20siguiente%20mensaje"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white w-full py-3 rounded-full font-semibold flex items-center gap-4 justify-center text-lg transition shadow"
          >
            <FaWhatsapp size={34}/> WhatsApp
          </a>
          <a
            href="https://www.instagram.com/riocuartocelulares/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-500 hover:bg-pink-600 text-white w-full py-3 rounded-full font-semibold flex items-center gap-4 justify-center text-lg transition shadow"
          >
            <FaInstagram size={34}/> Instagram
          </a>
          <a
            href="https://www.facebook.com/riocuartocelulares"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-800 hover:bg-blue-900 text-white w-full py-3 rounded-full font-semibold flex items-center gap-4 justify-center text-lg transition shadow"
          >
            <FaFacebook size={34}/> Facebook
          </a>
          <a
            href="mailto:info@riocuartocelulares.com"
            className="bg-blue-500 hover:bg-blue-600 text-white w-full py-3 rounded-full font-semibold flex items-center gap-4 justify-center text-lg transition shadow"
          >
            <FaEnvelope size={34}/> Email
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default Contacto; 