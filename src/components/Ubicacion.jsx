import React from "react";
import { FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

const Ubicacion = () => (
  <section id="ubicacion" className="py-20 text-center transition-colors duration-300 dark:bg-[#111111]">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.22, type: 'spring', stiffness: 140, damping: 16 }}
      className="max-w-4xl mx-auto"
    >
      <h2 className="text-4xl font-extrabold mb-6 text-blue-700 dark:text-cyan-200 tracking-tight">Dónde estamos</h2>
      <div className="flex flex-col items-center gap-2 mb-4">
          <FaMapMarkerAlt className="text-blue-600 dark:text-cyan-500" size={28} />
        <span className="text-lg font-semibold text-gray-900 dark:text-cyan-100">Vélez Sarsfield 119 local 38, X5800 Río Cuarto, Córdoba</span>
      </div>
      <div className="flex justify-center mb-4">
        <iframe
          title="Ubicación"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.1234567890123!2d-64.35000000000001!3d-33.13000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d2000e75d35ac5%3A0x7ef06c928085a4fd!2sV%C3%A9lez%20Sarsfield%20119%20local%2038%2C%20X5800%20R%C3%ADo%20Cuarto%2C%20C%C3%B3rdoba!5e0!3m2!1ses-419!2sar!4v1234567890123!5m2!1ses-419!2sar"
          width="900"
          height="300"
          allowFullScreen=""
          loading="lazy"
          className="rounded border-2 border-white dark:border-gray-700"
        ></iframe>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-cyan-200 font-medium">
          <FaPhone />
          <span>0358 435-7917</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-cyan-200 font-medium">
          <FaClock />
          <span>Lun-Vie: 8:30-13:00, 16:30-20:00 | Sáb: 9:00-13:00</span>
        </div>
      </div>
    </motion.div>
  </section>
);

export default Ubicacion; 