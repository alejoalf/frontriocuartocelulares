import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setProductos, updateProductoStock, removeProducto } from "../store/cartSlice";
import { useSocket } from "../hooks/useSocket";

const API_URL = "https://backriocuartocelulares.up.railway.app/api/productos";
const PAGE_SIZE = 6;

function ConfirmModal({ open, onClose, onConfirm, producto }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center">
        <h3 className="text-lg font-bold mb-4">¿Eliminar producto?</h3>
        <div className="mb-4 text-blue-700 font-semibold">{producto?.nombre}</div>
        <div className="flex gap-4 justify-center">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ open, onClose, onSave, producto }) {
  const [form, setForm] = React.useState(producto || {});
  React.useEffect(() => { setForm(producto || {}); }, [producto]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-left"
        onSubmit={e => { e.preventDefault(); onSave(form); }}
      >
        <h3 className="text-lg font-bold mb-4 text-center">Editar producto</h3>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input className="w-full p-2 rounded border" value={form.nombre || ""} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Descripción</label>
          <textarea className="w-full p-2 rounded border" value={form.descripcion || ""} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Precio</label>
          <input type="number" className="w-full p-2 rounded border" value={form.precio || ""} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))} required min="0" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Imagen (URL)</label>
          <input className="w-full p-2 rounded border" value={form.imagen || ""} onChange={e => setForm(f => ({ ...f, imagen: e.target.value }))} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Stock</label>
          <input type="number" className="w-full p-2 rounded border" value={form.stock || 0} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} min="0" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Categoría</label>
          <input className="w-full p-2 rounded border" value={form.categoria || ""} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} required />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Subcategoría</label>
          <input className="w-full p-2 rounded border" value={form.subcategoria || ""} onChange={e => setForm(f => ({ ...f, subcategoria: e.target.value }))} required />
        </div>
        <div className="flex gap-4 justify-center">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Cancelar</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 font-semibold">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default function Productos({ productos: productosProp, adminMode }) {
  // Hooks siempre arriba
  const [productos, setProductosLocal] = React.useState(productosProp || []);
  const [loading, setLoading] = React.useState(!productosProp);
  const [cat, setCat] = React.useState("");
  const [subcat, setSubcat] = React.useState("");
  const [busqueda, setBusqueda] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [productoAEliminar, setProductoAEliminar] = React.useState(null);
  const [msg, setMsg] = React.useState("");
  const [error, setError] = React.useState("");
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [productoAEditar, setProductoAEditar] = React.useState(null);
  
  const dispatch = useDispatch();
  const socket = useSocket();

  // Escuchar eventos de WebSocket
  React.useEffect(() => {
    if (!socket) return;

    // Escuchar actualizaciones de stock
    socket.on('stock-updated', (data) => {
      console.log('Stock actualizado:', data);
      dispatch(updateProductoStock(data));
      
      // Actualizar también el estado local
      setProductosLocal(prev => 
        prev.map(p => 
          p.id === data.productoId 
            ? { ...p, stock: data.stock }
            : p
        )
      );
    });

    // Escuchar eliminación de productos
    socket.on('producto-eliminado', (data) => {
      console.log('Producto eliminado:', data);
      dispatch(removeProducto(data.productoId));
      
      // Actualizar también el estado local
      setProductosLocal(prev => 
        prev.filter(p => p.id !== data.productoId)
      );
    });

    return () => {
      socket.off('stock-updated');
      socket.off('producto-eliminado');
    };
  }, [socket, dispatch]);

  React.useEffect(() => {
    if (productosProp) {
      setProductosLocal(productosProp);
      dispatch(setProductos(productosProp));
      setLoading(false);
    }
  }, [productosProp, dispatch]);

  React.useEffect(() => {
    if (!productosProp) {
      setLoading(true);
      fetch(API_URL)
        .then(res => res.json())
        .then(data => {
          setProductosLocal(data);
          dispatch(setProductos(data));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [productosProp, dispatch]);

  // Categorías y subcategorías (de todos los productos, no solo filtrados)
  const categorias = React.useMemo(() => Array.from(new Set((productosProp || productos).map(p => p.categoria).filter(Boolean))), [productosProp, productos]);
  const subcategorias = React.useMemo(() =>
    cat
      ? Array.from(new Set((productosProp || productos).filter(p => p.categoria === cat).map(p => p.subcategoria).filter(Boolean)))
      : [],
    [cat, productosProp, productos]
  );
  React.useEffect(() => {
    setSubcat("");
  }, [cat]);

  // Filtrado
  const productosFiltrados = React.useMemo(() =>
    productos.filter(p => {
      const matchBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
      const matchCategoria = !cat || p.categoria === cat;
      const matchSubcat = !subcat || p.subcategoria === subcat;
      const tieneStock = adminMode || (p.stock && p.stock > 0); // Solo mostrar productos con stock en vista pública, pero mostrar todos en admin
      return matchBusqueda && matchCategoria && matchSubcat && tieneStock;
    }),
    [productos, busqueda, cat, subcat, adminMode]
  );

  // Paginación después del filtrado
  const totalPages = Math.ceil(productosFiltrados.length / PAGE_SIZE) || 1;
  const productosPagina = productosFiltrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  React.useEffect(() => { setCurrentPage(1); }, [busqueda, cat, subcat, productosFiltrados.length]);

  // Eliminar producto
  const handleDelete = async () => {
    setError("");
    setMsg("");
    if (!productoAEliminar) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/${productoAEliminar.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProductosLocal(prev => prev.filter(p => p.id !== productoAEliminar.id));
        dispatch(removeProducto(productoAEliminar.id));
        setMsg("Producto eliminado correctamente");
      } else {
        setError("Error al eliminar producto");
      }
    } catch {
      setError("Error de red al eliminar producto");
    }
    setModalOpen(false);
    setProductoAEliminar(null);
    setTimeout(() => { setMsg(""); setError(""); }, 2500);
  };

  // Editar producto
  const handleEdit = async (form) => {
    setError("");
    setMsg("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setProductosLocal(prev => prev.map(p => p.id === form.id ? { ...p, ...form } : p));
        dispatch(setProductos(productos.map(p => p.id === form.id ? { ...p, ...form } : p)));
        setMsg("Producto editado correctamente");
        setEditModalOpen(false);
        setProductoAEditar(null);
      } else {
        setError("Error al editar producto");
      }
    } catch {
      setError("Error de red al editar producto");
    }
    setTimeout(() => { setMsg(""); setError(""); }, 2500);
  };

  // Top categorías (solo vista pública)
  const categoriaImagenes = {
    'Celulares': '/public-categorias/celulares.png',
    'Accesorios': '/public-categorias/accesorios.png',
    'Funda': '/public-categorias/funda-removebg-preview.png',
    'Fundas': '/public-categorias/funda-removebg-preview.png',
    'Sin categoria': '/public-categorias/sin_categoria-removebg-preview.png',
    'Sin categoría': '/public-categorias/sin_categoria-removebg-preview.png',
  };
  const topCategorias = React.useMemo(() => {
    if (adminMode) return [];
    const map = new Map();
    (productosProp || productos).forEach(p => {
      if (!p.categoria) return;
      if (!map.has(p.categoria)) {
        map.set(p.categoria, { 
          nombre: p.categoria, 
          imagen: p.imagen || "/logo.png", 
          cantidad: 1 
        });
      } else {
        const cat = map.get(p.categoria);
        cat.cantidad++;
        if (!cat.imagen || cat.imagen === "/logo.png") cat.imagen = p.imagen || "/logo.png";
        map.set(p.categoria, cat);
      }
    });
    // Usar imagen mapeada si existe
    return Array.from(map.values()).map(cat => {
      const imgPath = categoriaImagenes[cat.nombre] || cat.imagen || "/logo.png";
      return {
        ...cat,
        imagen: imgPath
      };
    });
  }, [productosProp, productos, adminMode]);

  if (loading) return <div className="text-center py-10 text-lg text-blue-700 font-semibold">Cargando productos...</div>;
  if (!productos.length) return <div className="text-center py-10 text-lg text-blue-700 font-semibold">No hay productos.</div>;

  // Vista ADMIN: tabla/lista
  if (adminMode) {
    return (
      <section className="w-full">
        <ConfirmModal open={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleDelete} producto={productoAEliminar} />
        <EditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleEdit} producto={productoAEditar} />
        {msg && <div className="text-green-600 text-center font-semibold mb-4">{msg}</div>}
        {error && <div className="text-red-600 text-center font-semibold mb-4">{error}</div>}
        <div className="overflow-x-auto rounded-xl shadow border bg-white dark:bg-gray-900">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50 dark:bg-gray-800">
              <tr>
                <th className="p-3 text-left">Imagen</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Categoría</th>
                <th className="p-3 text-left">Subcategoría</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map(p => (
                <tr key={p.id} className="border-b hover:bg-blue-50/40 dark:hover:bg-gray-800/40">
                  <td className="p-3"><img src={p.imagen || "/logo.png"} alt={p.nombre} className="w-14 h-14 object-contain rounded border bg-white" /></td>
                  <td className="p-3 font-bold text-blue-700 dark:text-cyan-200">{p.nombre}</td>
                  <td className="p-3 text-gray-700 dark:text-cyan-100">{p.descripcion}</td>
                  <td className="p-3 font-bold text-blue-700 dark:text-cyan-200">${Number(p.precio).toLocaleString()}</td>
                  <td className={`p-3 font-bold ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {p.stock || 0}
                  </td>
                  <td className="p-3">{p.categoria || <span className="italic">Sin categoría</span>}</td>
                  <td className="p-3">{p.subcategoria || <span className="italic">Sin subcategoría</span>}</td>
                  <td className="p-3 flex gap-2">
                    <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 shadow" onClick={() => { setProductoAEditar(p); setEditModalOpen(true); }} title="Editar"><FaEdit size={16} /></button>
                    <button className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 shadow" onClick={() => { setProductoAEliminar(p); setModalOpen(true); }} title="Eliminar"><FaTrash size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold shadow hover:bg-blue-300 transition disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Anterior"
            >
              &#8592;
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold shadow transition-all duration-150 ${currentPage === i + 1 ? "bg-blue-700 text-white scale-110" : "bg-blue-100 text-blue-700 hover:bg-blue-300"}`}
                onClick={() => setCurrentPage(i + 1)}
                aria-label={`Página ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold shadow hover:bg-blue-300 transition disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Siguiente"
            >
              &#8594;
            </button>
          </div>
        )}
      </section>
    );
  }

  // Vista pública (tarjetas)
  return (
    <section className="bg-[#285be7] dark:bg-[#111111] text-white w-full pt-10 pb-10">
      <div className="w-full max-w-7xl mx-auto">
        <ConfirmModal open={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleDelete} producto={productoAEliminar} />
        <EditModal open={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={handleEdit} producto={productoAEditar} />
        {msg && <div className="text-green-600 text-center font-semibold mb-4">{msg}</div>}
        {error && <div className="text-red-600 text-center font-semibold mb-4">{error}</div>}
        {/* Búsqueda y tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-6 w-full">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full max-w-xl p-4 rounded-2xl border border-blue-200 shadow focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg bg-white/90 font-medium"
          />
          {/* Tabs de categorías eliminados para dejar solo Top Categorías */}
        </div>
        {/* Top Categorías (solo público) */}
        {!adminMode && topCategorias.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-4 ml-2">Top Categorías</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 px-2 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-x-visible">
              {/* Tarjeta 'Todos' */}
              <button
                onClick={() => setCat("")}
                className={`flex flex-col items-center bg-gray-50 rounded-2xl shadow-sm border border-gray-200 px-6 py-7 min-w-[160px] max-w-[210px] transition-all duration-200 hover:shadow-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none ${cat === '' ? 'ring-2 ring-blue-400' : ''}`}
                style={{ flex: '0 0 auto' }}
              >
                <div className="flex items-center justify-center mb-3">
                  <img
                    src={'/logo.png'}
                    alt={'Todos'}
                    className="w-20 h-20 object-contain mb-3 mx-auto"
                  />
                </div>
                <span className="font-bold text-blue-800 text-base mb-1 text-center">Todos</span>
                <span className="text-xs text-gray-400 font-medium">{productosProp ? productosProp.length : productos.length} items</span>
              </button>
              {topCategorias.map(cat => (
                <button
                  key={cat.nombre}
                  onClick={() => setCat(cat.nombre)}
                  className={`flex flex-col items-center bg-gray-50 rounded-2xl shadow-sm border border-gray-200 px-6 py-7 min-w-[160px] max-w-[210px] transition-all duration-200 hover:shadow-lg hover:border-blue-400 hover:bg-blue-50 focus:outline-none ${cat.nombre === cat ? "ring-2 ring-blue-400" : ""}`}
                  style={{ flex: '0 0 auto' }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <img
                      src={cat.imagen || "/logo.png"}
                      alt={cat.nombre}
                      className={`${cat.nombre === 'Celulares' ? 'w-24 h-24' : 'w-20 h-20'} object-contain mb-3 mx-auto`}
                      onError={e => { e.target.onerror = null; e.target.src = "/logo.png"; }}
                    />
                  </div>
                  <span className="font-bold text-blue-800 text-base mb-1 text-center">{cat.nombre}</span>
                  <span className="text-xs text-gray-400 font-medium">{cat.cantidad} {cat.cantidad === 1 ? "item" : "items"}</span>
                </button>
              ))}
            </div>
            {/* Tabs de subcategorías debajo de top categorías */}
            {cat && subcategorias.length > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8 mb-8">
                <button
                  className={`px-4 py-1 rounded-full font-semibold transition shadow-sm border ${subcat === "" ? "bg-cyan-600 text-white border-cyan-600" : "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200"}`}
                  onClick={() => setSubcat("")}
                >
                  Todas
                </button>
                {subcategorias.map(s => (
                  <button
                    key={s}
                    className={`px-4 py-1 rounded-full font-semibold transition shadow-sm border ${subcat === s ? "bg-cyan-600 text-white border-cyan-600" : "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200"}`}
                    onClick={() => setSubcat(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center w-full min-h-[300px]">
          {productosPagina.length === 0 ? (
            <div className="col-span-full text-gray-500 text-lg py-10">
              {!adminMode && productos.length > 0 ? 
                "No hay productos disponibles con stock." : 
                "No hay productos."
              }
            </div>
          ) : (
            productosPagina.map(p => (
              <div
                key={p.id}
                className={`group flex flex-col items-center bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 p-6 text-center mb-6 h-[370px] min-h-[370px] max-h-[370px] w-80 justify-between relative dark:text-cyan-100`}
              >
                {/* Acciones admin arriba a la derecha, pero en el flujo */}
                {adminMode && (
                  <div className="flex w-full justify-end mb-2">
                    <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 shadow ml-2" onClick={() => { setProductoAEditar(p); setEditModalOpen(true); }}><FaEdit size={16} /></button>
                    <button className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 shadow ml-2" onClick={() => { setProductoAEliminar(p); setModalOpen(true); }}><FaTrash size={16} /></button>
                  </div>
                )}
                <img
                  src={p.imagen || "/logo.png"}
                  alt={p.nombre}
                  className="w-24 h-24 object-contain mb-2 rounded-lg border border-blue-100 bg-white mx-auto flex-shrink-0"
                />
                <h3 className="text-lg font-bold text-blue-700 mb-1 break-words">{p.nombre}</h3>
                <div className="text-gray-700 mb-1 text-sm break-words">{p.descripcion}</div>
                <div className="text-xs text-gray-500 mb-1">Categoría: {p.categoria || <span className="italic">Sin categoría</span>}</div>
                <div className="text-xs text-gray-500 mb-2">Subcategoría: {p.subcategoria || <span className="italic">Sin subcategoría</span>}</div>
                <div className="text-blue-700 font-extrabold text-xl mb-2">${Number(p.precio).toLocaleString()}</div>
                {/* Mostrar estado de stock */}
                {p.stock !== undefined && (
                  <div className={`text-sm font-bold mb-2 ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {p.stock > 0 ? `Stock: ${p.stock}` : 'Sin stock'}
                  </div>
                )}
                {!adminMode && (
                  <div className="flex-grow flex flex-col justify-end w-full">
                    {p.stock && p.stock > 0 ? (
                      <button
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg transition mt-4"
                        onClick={() => dispatch(addToCart({ ...p, cantidad: 1 }))}
                      >
                        Agregar al carrito
                      </button>
                    ) : (
                      <button
                        className="w-full bg-gray-400 text-white font-bold py-2 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        Sin stock
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold shadow hover:bg-blue-300 transition disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Anterior"
            >
              &#8592;
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold shadow transition-all duration-150 ${currentPage === i + 1 ? "bg-blue-700 text-white scale-110" : "bg-blue-100 text-blue-700 hover:bg-blue-300"}`}
                onClick={() => setCurrentPage(i + 1)}
                aria-label={`Página ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 font-bold shadow hover:bg-blue-300 transition disabled:opacity-50"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Siguiente"
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}