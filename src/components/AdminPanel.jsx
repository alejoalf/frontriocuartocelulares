import React, { useState } from "react";

const categorias = [
  { 
    value: "Celulares", 
    label: "Celulares", 
    subcategorias: ["Samsung", "Apple", "Xiaomi", "Motorola", "Otra"] 
  },
  { 
    value: "Accesorios", 
    label: "Accesorios para celulares", 
    subcategorias: ["Cargadores", "Auriculares", "Cables", "Soportes", "Otros"] 
  },
  { 
    value: "Fundas", 
    label: "Fundas", 
    subcategorias: ["Silicona", "Rígidas", "Personalizadas", "Flip", "Otra"] 
  }
];

export default function AdminPanel({ token, onProductoAgregado, setProductos }) {
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

  // Subcategorías según la categoría elegida
  const subcats = categorias.find(c => c.value === form.categoria)?.subcategorias || [];

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
    const res = await fetch("http://localhost:5000/api/productos", {
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
        window.location.reload(); // O podés llamar a una función de logout si la tenés
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
      <select
        name="categoria"
        value={form.categoria}
        onChange={handleChange}
        className="mb-2 w-full p-2 border rounded"
        required
      >
        <option value="">Selecciona una sección</option>
        {categorias.map(cat => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      {/* Subcategoría */}
      {form.categoria && (
        <select
          name="subcategoria"
          value={form.subcategoria}
          onChange={handleChange}
          className="mb-2 w-full p-2 border rounded"
          required
        >
          <option value="">Selecciona tipo/marca</option>
          {subcats.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      )}
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="mb-2 w-full p-2 border rounded" required />
      <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} className="mb-2 w-full p-2 border rounded" required />
      <input name="imagen" placeholder="URL de imagen" value={form.imagen} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
      <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition" disabled={!puedeAgregar}>Agregar</button>
      {msg && <div className="mt-2 text-green-600">{msg}</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </form>
  );
}
