import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FaTimes, FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaExpand } from "react-icons/fa";

// Datos de la galería con todas las imágenes disponibles
const galeriaData = {
  "Fundas": [
    {
      url: "/public-fundas/fundas de silicona.png",
      titulo: "Funda de Silicona Premium",
      descripcion: "Funda de silicona azul, flexible y resistente con acabado mate."
    },
    {
      url: "/public-fundas/fundas.png",
      titulo: "Colección de Fundas",
      descripcion: "Variedad de fundas para todos los modelos de celulares."
    },
    {
      url: "/public-fundas/fundastransparentes.png",
      titulo: "Fundas Transparentes",
      descripcion: "Fundas transparentes premium, protegen y muestran el diseño original."
    },
    {
      url: "/public-fundas/fundas2.png",
      titulo: "Fundas de Alta Calidad",
      descripcion: "Fundas premium con protección avanzada y diseño moderno."
    },
    {
      url: "/public-fundas/fundariguda.png",
      titulo: "Funda Rígida Protectora",
      descripcion: "Funda rígida con protección militar para máxima durabilidad."
    },
    {
      url: "/public-fundas/funda4.png",
      titulo: "Funda Elegante",
      descripcion: "Funda elegante con acabado premium y protección superior."
    },
    {
      url: "/public-fundas/funda 3.png",
      titulo: "Funda Moderna",
      descripcion: "Funda moderna con diseño contemporáneo y protección completa."
    },
    {
      url: "/public-fundas/Captura de pantalla 2025-08-04 204531.png",
      titulo: "Nueva Colección Fundas",
      descripcion: "Nueva colección de fundas con los últimos diseños y tecnologías."
    }
  ],
  "Celulares": [
    {
      url: "/public-telefonos/iphone.png",
      titulo: "iPhone de Última Generación",
      descripcion: "iPhone con cámara profesional y diseño elegante."
    },
    {
      url: "/public-telefonos/telefonos restaurados.png",
      titulo: "Teléfonos Restaurados",
      descripcion: "Teléfonos restaurados, como nuevos y con garantía completa."
    },
    {
      url: "/public-telefonos/telefonosiphone.jpeg",
      titulo: "Colección iPhone",
      descripcion: "Diferentes modelos de iPhone disponibles para todos los gustos."
    },
    {
      url: "/public-telefonos/telefono3.png",
      titulo: "Teléfono Premium",
      descripcion: "Teléfono de alta gama con características avanzadas."
    },
    {
      url: "/public-telefonos/telefono 2.png",
      titulo: "Teléfono Moderno",
      descripcion: "Teléfono moderno con tecnología de última generación."
    },
    {
      url: "/public-telefonos/sansunga15.png",
      titulo: "Samsung A15",
      descripcion: "Samsung Galaxy A15 con excelente relación calidad-precio."
    }
  ],
  "Accesorios": [
    {
      url: "/public-accesorios/auris.png",
      titulo: "Auriculares Bluetooth Premium",
      descripcion: "Auriculares inalámbricos de alta calidad, compatibles con todos los dispositivos."
    },
    {
      url: "/public-accesorios/cargador magnetico.png",
      titulo: "Cargadores Magnéticos",
      descripcion: "Cargadores magnéticos de carga rápida para todo tipo de celulares."
    },
    {
      url: "/public-accesorios/auriculares.png",
      titulo: "Auriculares Inalámbricos",
      descripcion: "Auriculares inalámbricos con cancelación de ruido y alta fidelidad."
    },
    {
      url: "/public-accesorios/relojdigital.png",
      titulo: "Reloj Digital Smart",
      descripcion: "Reloj digital inteligente con múltiples funciones y diseño moderno."
    },
    {
      url: "/public-accesorios/Captura de pantalla 2025-08-04 204403.png",
      titulo: "Accesorios Gaming",
      descripcion: "Accesorios gaming para una experiencia de juego superior."
    },
    {
      url: "/public-accesorios/Captura de pantalla 2025-08-04 204435.png",
      titulo: "Cargadores Rápidos",
      descripcion: "Cargadores de carga rápida con tecnología avanzada."
    },
    {
      url: "/public-accesorios/Captura de pantalla 2025-08-04 204453.png",
      titulo: "Cables Premium",
      descripcion: "Cables de alta velocidad para carga y transferencia de datos."
    },
    {
      url: "/public-accesorios/Captura de pantalla 2025-08-04 204510.png",
      titulo: "Adaptadores USB",
      descripcion: "Adaptadores USB para conectar cualquier dispositivo."
    },
    {
      url: "/public-accesorios/Captura de pantalla 2025-08-04 204550.png",
      titulo: "Accesorios iPhone",
      descripcion: "Accesorios específicos para iPhone con garantía Apple."
    },
    {
      url: "/public-accesorios/Captura de pantalla 2025-08-04 204633.png",
      titulo: "Kit Completo Accesorios",
      descripcion: "Kit completo de accesorios para todos tus dispositivos."
    }
  ],
  "Reparaciones": [
    {
      url: "/public-arreglo/arreglos1.png",
      titulo: "Cambio de Pantalla",
      descripcion: "Reemplazo de pantallas rotas o dañadas para cualquier modelo."
    },
    {
      url: "/public-arreglo/Gemini_Generated_Image_tmhr9ytmhr9ytmhr.png",
      titulo: "Reparación de Placa",
      descripcion: "Servicio técnico especializado en reparación de placas y componentes internos."
    },
    {
      url: "/public-arreglo/arreglo2.png",
      titulo: "Reparación Completa",
      descripcion: "Servicio de reparación completa con garantía y componentes originales."
    }
  ]
};

// Componente de partículas flotantes para la galería
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8,
    size: Math.random() * 3 + 1
  }));

  return (
    <div className="galeria-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="galeria-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 8,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Componente de carrusel automático
const AutoCarousel = ({ imagenes, categoria }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && imagenes.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imagenes.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, imagenes.length]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const goToImage = (index) => {
    setCurrentIndex(index);
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imagenes.length);
      }, 3000);
    }
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % imagenes.length;
    goToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
    goToImage(prevIndex);
  };

  if (imagenes.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-3xl font-bold text-white">{categoria}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={prevImage}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
            title="Anterior"
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            onClick={togglePlayPause}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
          <button
            onClick={nextImage}
            className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
            title="Siguiente"
          >
            <FaChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <div className="relative">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-center"
        >
                     <div className="relative carousel-image-container">
             <img
               src={imagenes[currentIndex].url}
               alt={imagenes[currentIndex].titulo}
               className="w-full h-64 md:h-80 lg:h-96 object-contain rounded-xl mx-auto shadow-2xl auto-carousel"
               style={{ objectPosition: 'center' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-left">
              <h4 className="font-bold text-xl md:text-2xl mb-2">{imagenes[currentIndex].titulo}</h4>
              <p className="text-base md:text-lg text-blue-100 line-clamp-2 mb-3">{imagenes[currentIndex].descripcion}</p>
              <div className="flex items-center gap-3">
                                 <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-semibold">
                   {imagenes[currentIndex].categoria}
                 </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="text-center mt-4 text-white/80 text-base">
          {currentIndex + 1} de {imagenes.length}
        </div>
      </div>
      
      {imagenes.length > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {imagenes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              title={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente de tarjeta de imagen con diseño original
const ImageCard = ({ imagen, categoria, onClick, index, isVisible }) => {
  return (
    <motion.div
      className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 image-card w-full"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onClick}
    >
      <div className="relative overflow-hidden w-full h-full">
        <motion.img
          src={imagen.url}
          alt={imagen.titulo}
          className="w-full h-full object-cover transition-transform duration-700"
          whileHover={{ scale: 1.1 }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        

      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-lg font-bold mb-2">{imagen.titulo}</h3>
        <p className="text-sm text-gray-200 line-clamp-2 mb-3">{imagen.descripcion}</p>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
            {categoria}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </motion.div>
  );
};

// Componente principal de la galería
const Galeria = () => {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [lightbox, setLightbox] = useState({ open: false, imagen: null, categoria: null });
  const [isVisible, setIsVisible] = useState(false);
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const controls = useAnimation();

  const todasLasImagenes = Object.entries(galeriaData).flatMap(([categoria, imagenes]) =>
    imagenes.map(imagen => ({ ...imagen, categoria }))
  );

  const imagenesFiltradas = React.useMemo(() => {
    let filtradas = categoriaActiva === "Todas" 
      ? todasLasImagenes 
      : galeriaData[categoriaActiva] || [];

    return filtradas;
  }, [categoriaActiva, todasLasImagenes]);

  // Mostrar solo 8 imágenes inicialmente (2 filas de 4)
  const imagenesAMostrar = mostrarTodas ? imagenesFiltradas : imagenesFiltradas.slice(0, 8);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("galeria");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [controls]);

  const openLightbox = (imagen, categoria) => {
    setLightbox({ open: true, imagen, categoria });
  };

  const closeLightbox = () => {
    setLightbox({ open: false, imagen: null, categoria: null });
  };

  const categorias = ["Todas", ...Object.keys(galeriaData)];

  // Resetear mostrarTodas cuando cambie la categoría
  useEffect(() => {
    setMostrarTodas(false);
  }, [categoriaActiva]);

  return (
    <section id="galeria" className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      <FloatingParticles />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Nuestra Galería
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre nuestra amplia colección de productos y servicios con la mejor calidad y precios del mercado
          </p>
        </motion.div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AutoCarousel 
            imagenes={todasLasImagenes} 
            categoria="Todos los Productos"
          />
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              className={`category-filter px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                categoriaActiva === categoria
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 shadow-md'
              }`}
            >
              {categoria}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="galeria-masonry"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {imagenesAMostrar.map((imagen, index) => (
            <div key={`${imagen.categoria}-${index}`} className="galeria-item">
              <ImageCard
                imagen={imagen}
                categoria={imagen.categoria}
                onClick={() => openLightbox(imagen, imagen.categoria)}
                index={index}
                isVisible={isVisible}
              />
            </div>
          ))}
        </motion.div>

        {/* Botón Ver Más */}
        {!mostrarTodas && imagenesFiltradas.length > 8 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => setMostrarTodas(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver más productos ({imagenesFiltradas.length - 8} más)
            </button>
          </motion.div>
        )}

        {/* Botón Ver Menos */}
        {mostrarTodas && imagenesFiltradas.length > 8 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => setMostrarTodas(false)}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Ver menos
            </button>
          </motion.div>
        )}

        {imagenesFiltradas.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No hay imágenes disponibles en esta categoría.
              </p>
            </div>
          </motion.div>
        )}

      <AnimatePresence>
        {lightbox.open && (
          <motion.div
              className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
                 className="relative max-w-4xl w-full max-h-[80vh] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
                 transition={{ type: "spring", stiffness: 100, damping: 20 }}
                 onClick={(e) => e.stopPropagation()}
               >
                                 <div className="relative h-64 md:h-80 bg-black">
                   <img
                     src={lightbox.imagen?.url}
                     alt={lightbox.imagen?.titulo}
                     className="w-full h-full object-contain"
                   />
                   
              <button
                onClick={closeLightbox}
                     className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
              >
                     <FaTimes size={20} />
              </button>
                   
              <button
                     className="absolute top-4 right-16 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-200"
                     onClick={() => window.open(lightbox.imagen?.url, '_blank')}
              >
                     <FaExpand size={20} />
              </button>
                 </div>

                                 <div className="p-6">
                   <div className="flex items-start justify-between mb-4">
                     <div>
                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                         {lightbox.imagen?.titulo}
                       </h3>
                       <p className="text-base text-gray-600 dark:text-gray-300 mb-3">
                         {lightbox.imagen?.descripcion}
                       </p>
                       <div className="flex items-center gap-4">
                         <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                           {lightbox.categoria}
                         </span>
                       </div>
                     </div>
                   </div>
                 </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
};

export default Galeria; 