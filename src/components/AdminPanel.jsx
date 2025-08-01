import React, { useState, useMemo } from "react";

export default function AdminPanel({ token, onProductoAgregado, setProductos, productosExistentes = [] }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    stock: "",
    categoria: "",
    subcategoria: ""
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [showCategoriaSuggestions, setShowCategoriaSuggestions] = useState(false);
  const [showSubcategoriaSuggestions, setShowSubcategoriaSuggestions] = useState(false);

  // Generar categorías dinámicamente basadas en productos existentes
  const categoriasExistentes = useMemo(() => {
    const categorias = new Set();
    productosExistentes.forEach(p => {
      if (p.categoria) categorias.add(p.categoria);
    });
    return Array.from(categorias).sort();
  }, [productosExistentes]);

  // Generar subcategorías dinámicamente basadas en la categoría seleccionada
  const subcategoriasExistentes = useMemo(() => {
    const subcategorias = new Set();
    productosExistentes.forEach(p => {
      if (p.categoria === form.categoria && p.subcategoria) {
        subcategorias.add(p.subcategoria);
      }
    });
    return Array.from(subcategorias).sort();
  }, [productosExistentes, form.categoria]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      if (name === "categoria") {
        // Al cambiar categoría, resetea subcategoría
        return { ...prev, categoria: value, subcategoria: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setError("");
    
    // Validación manual
    if (!form.categoria || !form.subcategoria) {
      setError("Selecciona una categoría y subcategoría");
      return;
    }
    if (!form.nombre || !form.precio) {
      setError("Completa nombre y precio");
      return;
    }
    
    // Enviar producto
    const res = await fetch("https://backriocuartocelulares.onrender.com/api/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(form)
    });
    
    if (res.ok) {
      const productoCreado = await res.json();
      setMsg("Producto agregado correctamente");
      setForm({ nombre: "", descripcion: "", precio: "", imagen: "", stock: "", categoria: "", subcategoria: "" });
      if (onProductoAgregado) onProductoAgregado(productoCreado);
    } else {
      const errorData = await res.json().catch(() => ({}));
      if (res.status === 401) {
        // Logout automático
        localStorage.removeItem("adminToken");
        window.location.reload();
      } else {
        setError(errorData.error || "Error al agregar producto");
      }
    }
  };

  // El botón solo se habilita si todos los campos obligatorios están completos
  const puedeAgregar = form.categoria && form.subcategoria && form.nombre && form.precio;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-bold mb-2">Agregar producto</h2>
      
      {/* Categoría */}
      <div className="relative">
        <label className="block text-sm font-semibold mb-1">Categoría</label>
        <input
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          onFocus={() => setShowCategoriaSuggestions(true)}
          onBlur={() => setTimeout(() => setShowCategoriaSuggestions(false), 200)}
          placeholder="Escribe o selecciona una categoría"
          className="mb-2 w-full p-2 border rounded"
          required
        />
        {showCategoriaSuggestions && categoriasExistentes.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
            {categoriasExistentes.map(cat => (
              <button
                key={cat}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                onClick={() => {
                  setForm(f => ({ ...f, categoria: cat, subcategoria: "" }));
                  setShowCategoriaSuggestions(false);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subcategoría */}
      {form.categoria && (
        <div className="relative">
          <label className="block text-sm font-semibold mb-1">Subcategoría</label>
          <input
            name="subcategoria"
            value={form.subcategoria}
            onChange={handleChange}
            onFocus={() => setShowSubcategoriaSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSubcategoriaSuggestions(false), 200)}
            placeholder="Escribe o selecciona una subcategoría"
            className="mb-2 w-full p-2 border rounded"
            required
          />
          {showSubcategoriaSuggestions && subcategoriasExistentes.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">
              {subcategoriasExistentes.map(subcat => (
                <button
                  key={subcat}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                  onClick={() => {
                    setForm(f => ({ ...f, subcategoria: subcat }));
                    setShowSubcategoriaSuggestions(false);
                  }}
                >
                  {subcat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <input 
        name="nombre" 
        placeholder="Nombre del producto" 
        value={form.nombre} 
        onChange={handleChange} 
        className="mb-2 w-full p-2 border rounded" 
        required 
      />
      
      <textarea 
        name="descripcion" 
        placeholder="Descripción del producto" 
        value={form.descripcion} 
        onChange={handleChange} 
        className="mb-2 w-full p-2 border rounded" 
      />
      
      <input 
        name="precio" 
        type="number" 
        placeholder="Precio" 
        value={form.precio} 
        onChange={handleChange} 
        className="mb-2 w-full p-2 border rounded" 
        required 
        min="0"
      />
      
      <input 
        name="imagen" 
        placeholder="URL de imagen" 
        value={form.imagen} 
        onChange={handleChange} 
        className="mb-2 w-full p-2 border rounded" 
      />
      
      <input 
        name="stock" 
        type="number" 
        placeholder="Stock disponible" 
        value={form.stock} 
        onChange={handleChange} 
        className="mb-2 w-full p-2 border rounded" 
        min="0"
      />
      
      <button 
        type="submit" 
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition disabled:opacity-50" 
        disabled={!puedeAgregar}
      >
        Agregar producto
      </button>
      
      {msg && <div className="mt-2 text-green-600 font-semibold">{msg}</div>}
      {error && <div className="mt-2 text-red-600 font-semibold">{error}</div>}
    </form>
  );
}
