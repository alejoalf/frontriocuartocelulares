import React from "react";
import { FaWhatsapp, FaEnvelope, FaInstagram, FaFacebook, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Contacto = () => {
  const [fields, setFields] = React.useState({ nombre: "", email: "", mensaje: "" });
  const [touched, setTouched] = React.useState({ nombre: false, email: false, mensaje: false });
  const [submitted, setSubmitted] = React.useState(false);

  const errors = {
    nombre: !fields.nombre.trim(),
    email: !validateEmail(fields.email),
    mensaje: !fields.mensaje.trim(),
  };

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleBlur = e => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, mensaje: true });
    setSubmitted(true);
    if (!errors.nombre && !errors.email && !errors.mensaje) {
      // Aquí iría el envío real
      alert("¡Mensaje enviado!");
      setFields({ nombre: "", email: "", mensaje: "" });
      setTouched({ nombre: false, email: false, mensaje: false });
      setSubmitted(false);
    }
  };

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
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          <a
            href="https://wa.me/543584357917?text=Bienvenido%20a%20R%C3%ADo%20Cuarto%20Celulares%2C%20escribe%20tu%20consulta%20en%20el%20siguiente%20mensaje"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition"
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a
            href="mailto:info@riocuartocelulares.com"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition"
          >
            <FaEnvelope /> Email
          </a>
        </div>
        <form className="flex flex-col gap-4 text-left" onSubmit={handleSubmit} noValidate>
          <div className="relative">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={fields.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border p-3 rounded w-full focus:ring-2 transition bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-cyan-100 border-gray-200 dark:border-gray-700 ${touched.nombre && errors.nombre ? "border-red-500 focus:ring-red-400" : touched.nombre && !errors.nombre ? "border-green-500 focus:ring-green-400" : "focus:ring-blue-400 dark:focus:ring-cyan-400"}`}
              required
            />
            {touched.nombre && !errors.nombre && (
              <FaCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {touched.nombre && errors.nombre && (
            <span className="text-red-500 text-xs ml-1">El nombre es obligatorio.</span>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border p-3 rounded w-full focus:ring-2 transition bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-cyan-100 border-gray-200 dark:border-gray-700 ${touched.email && errors.email ? "border-red-500 focus:ring-red-400" : touched.email && !errors.email ? "border-green-500 focus:ring-green-400" : "focus:ring-blue-400 dark:focus:ring-cyan-400"}`}
              required
            />
            {touched.email && !errors.email && (
              <FaCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {touched.email && errors.email && (
            <span className="text-red-500 text-xs ml-1">Ingresa un email válido.</span>
          )}
          <div className="relative">
            <textarea
              name="mensaje"
              placeholder="Mensaje"
              value={fields.mensaje}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`border p-3 rounded w-full focus:ring-2 transition bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-cyan-100 border-gray-200 dark:border-gray-700 ${touched.mensaje && errors.mensaje ? "border-red-500 focus:ring-red-400" : touched.mensaje && !errors.mensaje ? "border-green-500 focus:ring-green-400" : "focus:ring-blue-400 dark:focus:ring-cyan-400"}`}
              required
            />
            {touched.mensaje && !errors.mensaje && (
              <FaCheckCircle className="absolute right-3 top-3 text-green-500" />
            )}
          </div>
          {touched.mensaje && errors.mensaje && (
            <span className="text-red-500 text-xs ml-1">El mensaje es obligatorio.</span>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-700 dark:bg-cyan-700 text-white py-3 rounded font-bold hover:bg-blue-800 dark:hover:bg-cyan-800 transition"
          >
            Enviar
          </motion.button>
          {submitted && (errors.nombre || errors.email || errors.mensaje) && (
            <span className="text-red-500 text-sm mt-2">Por favor completa todos los campos correctamente.</span>
          )}
        </form>
        <div className="flex justify-center gap-6 mt-8">
          <a href="https://www.instagram.com/riocuartocelulares/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600 transition text-2xl"><FaInstagram /></a>
          <a href="https://www.facebook.com/riocuartocelulares" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-cyan-200 hover:text-blue-800 dark:hover:text-cyan-100 transition text-2xl"><FaFacebook /></a>
        </div>
      </motion.div>
    </section>
  );
};

export default Contacto; 