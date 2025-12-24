import React, { useState, useMemo } from "react";
import { FaUpload, FaImage, FaTimes, FaSpinner } from "react-icons/fa";
import { supabase } from "../config/supabaseClient";

export default function AdminPanel({ onProductoAgregado, productosExistentes = [] }) {
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = typeof event.target?.result === 'string' ? event.target.result : '';
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setError('Selecciona una imagen primero');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const fileExt = selectedFile.name.split('.').pop() ?? 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('productos')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } = supabase
        .storage
        .from('productos')
        .getPublicUrl(uploadData.path);

      setForm(prev => ({ ...prev, imagen: publicData.publicUrl }));
      setMsg('Imagen subida correctamente');
      setSelectedFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      setError('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setImagePreview('');
    setForm(prev => ({ ...prev, imagen: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!form.categoria || !form.subcategoria) {
      setError("Selecciona una categoría y subcategoría");
      return;
    }
    if (!form.nombre || !form.precio) {
      setError("Completa nombre y precio");
      return;
    }

    const precioNumber = Number(form.precio);
    if (Number.isNaN(precioNumber) || precioNumber <= 0) {
      setError("Precio inválido");
      return;
    }
    const stockNumber = form.stock === "" ? 0 : Number(form.stock);
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      setError("Stock inválido");
      return;
    }

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      precio: precioNumber,
      imagen: form.imagen || null,
      stock: stockNumber,
      categoria: form.categoria,
      subcategoria: form.subcategoria
    };

    try {
      const { data, error: insertError } = await supabase
        .from('productos')
        .insert(payload)
        .select('*')
        .single();

      if (insertError) {
        throw insertError;
      }

      setMsg("Producto agregado correctamente");
      setForm({ nombre: "", descripcion: "", precio: "", imagen: "", stock: "", categoria: "", subcategoria: "" });
      setSelectedFile(null);
      setImagePreview('');
      onProductoAgregado?.(data);
    } catch (err) {
      console.error('Error agregando producto:', err);
      setError("Error al agregar producto");
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
      
      {/* Sección de imagen mejorada */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold mb-1">Imagen del producto</label>
        
        {/* URL de imagen */}
        <input 
          name="imagen" 
          placeholder="URL de imagen (opcional)" 
          value={form.imagen} 
          onChange={handleChange} 
          className="mb-2 w-full p-2 border rounded" 
        />
        
        {/* O separador */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs text-gray-500">O</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        
        {/* Subida de archivo */}
        <div className="space-y-2">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="flex items-center gap-2 p-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400 transition-colors"
          >
            <FaUpload className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : "Seleccionar imagen local"}
            </span>
          </label>
          
          {/* Preview de imagen */}
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
          
          {/* Botón para subir */}
          {selectedFile && (
            <button
              type="button"
              onClick={handleUploadImage}
              disabled={uploadingImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploadingImage ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <FaImage />
                  Subir imagen
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Mostrar imagen actual si existe */}
        {form.imagen && !imagePreview && (
          <div className="relative">
            <img 
              src={form.imagen} 
              alt="Imagen actual" 
              className="w-full h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, imagen: '' }))}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}
      </div>
      
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
