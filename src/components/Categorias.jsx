import React from "react";
import { motion } from "framer-motion";

// Colores para las categorías (se asignan automáticamente)
const coloresCategorias = [
 
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
];

// Función para generar categorías dinámicamente
const generarCategorias = (productos) => {
  if (!productos || productos.length === 0) return [];

  // Agrupar productos por categoría
  const categoriasMap = new Map();
  
  productos.forEach(producto => {
    const categoria = producto.categoria || "Sin categoría";
    
    if (!categoriasMap.has(categoria)) {
      categoriasMap.set(categoria, {
        nombre: categoria,
        productos: [],
        cantidad: 0,
        imagen: null,
        descuento: null
      });
    }
    
    const cat = categoriasMap.get(categoria);
    cat.productos.push(producto);
    cat.cantidad++;
    
    // Usar la primera imagen disponible como imagen de la categoría
    if (!cat.imagen && producto.imagen) {
      cat.imagen = producto.imagen;
    }
  });

  // Convertir a array y asignar colores
  return Array.from(categoriasMap.values()).map((cat, index) => ({
    id: cat.nombre.toLowerCase().replace(/\s+/g, '-'),
    nombre: cat.nombre,
    imagen: cat.imagen || "/logo.png",
    cantidad: cat.cantidad,
    color: coloresCategorias[index % coloresCategorias.length],
    descuento: null // Por ahora sin descuentos dinámicos
  }));
};

export default function Categorias({ onCategoriaClick, categoriaSeleccionada, productos = [] }) {
  // Generar categorías dinámicamente
  const categorias = generarCategorias(productos);

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Categorías
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explora nuestra amplia gama de productos 
          </p>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categorias.map((categoria, index) => (
            <motion.div
              key={categoria.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => onCategoriaClick(categoria.nombre)}
                className={`w-full h-48 rounded-2xl shadow-2xl overflow-hidden relative group transition-all duration-300 ${
                  categoriaSeleccionada === categoria.nombre 
                    ? 'ring-4 ring-gray-400 ring-offset-2 ring-offset-gray-900' 
                    : 'hover:shadow-gray-500/25'
                }`}
              >
                {/* Fondo con gradiente */}
                <div className={`absolute inset-0 ${categoria.color} opacity-90`} />
                
                {/* Imagen de fondo */}
                <div className="absolute inset-0 bg-black/20" />
                <img
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/logo.png";
                  }}
                />
                
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  {/* Nombre de la categoría */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">
                      {categoria.nombre}
                    </h3>
                    <p className="text-sm text-blue-200 mt-1">
                      {categoria.cantidad} producto{categoria.cantidad !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Descuento (si existe) */}
                  {categoria.descuento && (
                    <div className="text-center">
                      <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {categoria.descuento}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Mensaje si no hay categorías */}
        {categorias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No hay productos disponibles para mostrar categorías
            </p>
          </div>
        )}

        {/* Botón para ver todos los productos */}
        <div className="text-center mt-12">
          <button
            onClick={() => onCategoriaClick("")}
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              categoriaSeleccionada === "" 
                ? "bg-red-500 text-white shadow-lg shadow-red-500/50" 
                : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            }`}
          >
            Ver todos los productos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
} 