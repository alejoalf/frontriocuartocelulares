import React from "react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const testimonios = [
  {
    nombre: "Juan Pérez",
    texto: "Excelente atención y servicio. Mi celular quedó como nuevo!",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    nombre: "María Gómez",
    texto: "Rápidos y confiables. Los recomiendo totalmente.",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    nombre: "Carlos Ruiz",
    texto: "Muy buena variedad de accesorios y precios justos.",
    foto: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4,
  },
];

function SkeletonAvatar() {
  return <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />;
}

const Testimonials = () => {
  const [loading, setLoading] = React.useState(true);
  const [loaded, setLoaded] = React.useState(Array(testimonios.length).fill(false));
  const [hovered, setHovered] = React.useState(null);

  React.useEffect(() => {
    if (loaded.every(Boolean)) setLoading(false);
  }, [loaded]);

  const handleImgLoad = idx => {
    setLoaded(prev => {
      const copy = [...prev];
      copy[idx] = true;
      return copy;
    });
  };

  return (
    <section className="py-20 text-center transition-colors duration-300">
      <h2 className="text-4xl font-extrabold mb-12 text-blue-700 dark:text-cyan-200 tracking-tight">Testimonios</h2>
      <div className="flex flex-wrap justify-center gap-10">
        {testimonios.map((t, i) => (
          <motion.div
            key={t.nombre}
            className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 w-80 flex flex-col items-center transition-all duration-200 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.22, type: 'spring', stiffness: 140, damping: 16, delay: i * 0.06 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            animate={hovered === i ? { scale: 1.07 } : { scale: 1 }}
          >
            {loading && !loaded[i] && <SkeletonAvatar />}
            <img
              src={t.foto}
              alt={t.nombre}
              className={`w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-200 dark:border-cyan-700 ${loading && !loaded[i] ? "hidden" : ""}`}
              onLoad={() => handleImgLoad(i)}
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-cyan-100">{t.nombre}</h3>
            <div className="flex gap-1 mb-2">
              {[...Array(t.rating)].map((_, idx) => (
                <FaStar key={idx} className="text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 dark:text-cyan-200 italic">"{t.texto}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials; 