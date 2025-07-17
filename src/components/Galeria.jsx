import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const secciones = [
  {
    nombre: "Fundas",
    imagenes: [
      {
        url: "/public-fundas/fundas de silicona.png",
        titulo: "Funda de Silicona",
        descripcion: "Funda de silicona azul, flexible y resistente."
      },
      {
        url: "/public-fundas/fundas.png",
        titulo: "Fundas Varias",
        descripcion: "Variedad de fundas para todos los modelos."
      },
      {
        url: "/public-fundas/fundastransparentes.png",
        titulo: "Fundas Transparentes",
        descripcion: "Fundas transparentes premium, protegen y muestran el diseño original."
      }
    ]
  },
  {
    nombre: "Celulares",
    imagenes: [
      {
        url: "/public-telefonos/iphone.png",
        titulo: "iPhone",
        descripcion: "iPhone de última generación, cámara profesional y diseño elegante."
      },
      {
        url: "/public-telefonos/telefonos restaurados.png",
        titulo: "Teléfonos Restaurados",
        descripcion: "Teléfonos restaurados, como nuevos y con garantía."
      },
      {
        url: "/public-telefonos/telefonosiphone.jpeg",
        titulo: "Teléfonos iPhone",
        descripcion: "Diferentes modelos de iPhone disponibles."
      }
    ]
  },
  {
    nombre: "Accesorios",
    imagenes: [
      {
        url: "/public-accesorios/auris.png",
        titulo: "Auriculares Bluetooth",
        descripcion: "Auriculares inalámbricos de alta calidad, compatibles con todos los dispositivos."
      },
      {
        url: "/public-accesorios/cargador magnetico.png",
        titulo: "Cargadores Rápidos",
        descripcion: "Cargadores de carga rápida para todo tipo de celulares."
      }
    ]
  },
  {
    nombre: "Reparaciones",
    imagenes: [
      {
        url: "/public-arreglo/arreglos1.png",
        titulo: "Cambio de Pantalla",
        descripcion: "Reemplazo de pantallas rotas o dañadas para cualquier modelo."
      },
      {
        url: "/public-arreglo/Gemini_Generated_Image_tmhr9ytmhr9ytmhr.png",
        titulo: "Reparación de Placa",
        descripcion: "Servicio técnico especializado en reparación de placas y componentes internos."
      }
    ]
  }
];

function SkeletonCard() {
  return (
    <div className="w-72 h-48 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
  );
}

const Galeria = () => {
  const [loading, setLoading] = React.useState(true);
  const [loaded, setLoaded] = React.useState(Array(secciones.length).fill(false));
  const [lightbox, setLightbox] = React.useState({ open: false, seccionIdx: 0, imgIdx: 0 });
  const [hovered, setHovered] = React.useState(null);

  React.useEffect(() => {
    if (loaded.every(Boolean)) setLoading(false);
  }, [loaded]);

  const handleImgLoad = (seccionIdx, imgIdx) => {
    setLoaded(prev => {
      const copy = [...prev];
      copy[seccionIdx] = true;
      return copy;
    });
  };

  const openLightbox = (seccionIdx, imgIdx) => setLightbox({ open: true, seccionIdx, imgIdx });
  const closeLightbox = () => setLightbox({ open: false, seccionIdx: 0, imgIdx: 0 });
  const prevImg = e => {
    e.stopPropagation();
    setLightbox(l => {
      const imgs = secciones[l.seccionIdx].imagenes;
      return { ...l, imgIdx: (l.imgIdx - 1 + imgs.length) % imgs.length };
    });
  };
  const nextImg = e => {
    e.stopPropagation();
    setLightbox(l => {
      const imgs = secciones[l.seccionIdx].imagenes;
      return { ...l, imgIdx: (l.imgIdx + 1) % imgs.length };
    });
  };

  React.useEffect(() => {
    if (!lightbox.open) return;
    const onKey = e => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setLightbox(l => ({ ...l, imgIdx: (l.imgIdx - 1 + secciones[l.seccionIdx].imagenes.length) % secciones[l.seccionIdx].imagenes.length }));
      if (e.key === "ArrowRight") setLightbox(l => ({ ...l, imgIdx: (l.imgIdx + 1) % secciones[l.seccionIdx].imagenes.length }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox.open]);

  return (
    <section className="py-20 text-center transition-colors duration-300 text-blue-800 pt-10 dark:bg-[#111111]">
      <motion.h2 
        className="text-4xl font-extrabold mb-12 text-blue-700 dark:text-cyan-200 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Galería
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-12 px-4">
        {secciones.map((seccion, sIdx) => (
          <div key={seccion.nombre} className="flex flex-col items-center cursor-pointer group"
            onClick={() => openLightbox(sIdx, 0)}
            onMouseEnter={() => setHovered(sIdx)}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.img
              src={seccion.imagenes[0].url}
              alt={seccion.imagenes[0].titulo}
              className="w-80 h-48 md:w-96 md:h-64 object-cover rounded-2xl border-2 border-white dark:border-gray-700 group-hover:scale-105 transition-all duration-300 mb-4 dark:bg-gray-900"
              animate={hovered === sIdx ? { scale: 1.07 } : { scale: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, type: 'spring', stiffness: 140, damping: 16 }}
            />
            <span className="text-xl font-bold text-blue-700 dark:text-cyan-200 group-hover:underline">{seccion.nombre}</span>
          </div>
        ))}
      </div>
      {/* Lightbox actualizado */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            className="fixed inset-0 bg-black/80 dark:bg-black/90 flex items-center justify-center z-[9999] cursor-zoom-out px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl flex flex-col md:flex-row max-w-7xl w-full max-h-[98vh] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 16, duration: 0.22 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                key={lightbox.imgIdx}
                className="flex-1 flex items-center justify-center bg-black/80 dark:bg-black/90 min-w-[400px] max-w-[700px] min-h-[500px] max-h-[90vh]"
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -120, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 140, damping: 16, duration: 0.22 }}
              >
                <motion.img
                  src={secciones[lightbox.seccionIdx].imagenes[lightbox.imgIdx].url}
                  alt={secciones[lightbox.seccionIdx].imagenes[lightbox.imgIdx].titulo}
                  className="object-contain w-full h-full max-h-[90vh] max-w-[700px] rounded-2xl drop-shadow-2xl"
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 16, duration: 0.22 }}
                />
              </motion.div>
              <motion.div
                key={"panel-" + lightbox.imgIdx}
                className="flex-1 flex flex-col justify-center p-12 text-left min-w-[400px] max-w-[700px] min-h-[500px] max-h-[90vh]"
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 120, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 140, damping: 16, duration: 0.22, delay: 0.1 }}
              >
                <motion.h3
                  className="text-4xl font-bold mb-6 text-blue-700 dark:text-cyan-200"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.22 }}
                >
                  {secciones[lightbox.seccionIdx].imagenes[lightbox.imgIdx].titulo}
                </motion.h3>
                <motion.p
                  className="text-gray-700 dark:text-cyan-100 text-xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.22 }}
                >
                  {secciones[lightbox.seccionIdx].imagenes[lightbox.imgIdx].descripcion}
                </motion.p>
              </motion.div>
              <button
                className="absolute top-3 right-3 text-gray-700 dark:text-cyan-100 text-2xl p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-cyan-300 transition"
                onClick={closeLightbox}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-cyan-100 text-2xl p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-cyan-300 transition"
                onClick={prevImg}
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-cyan-100 text-2xl p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-cyan-300 transition"
                onClick={nextImg}
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Galeria; 