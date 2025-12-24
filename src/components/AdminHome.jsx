import React, { useState, useEffect, useCallback } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import Productos from "./Productos";
import AdminOrders from "./AdminOrders";
import { supabase } from "../config/supabaseClient";

const PAGE_SIZE = 6;

// Componente para mostrar estadísticas de categorías
function CategoriasStats({ productos }) {
  const stats = React.useMemo(() => {
    const categoriasMap = new Map();
    
    productos.forEach(producto => {
      const categoria = producto.categoria || "Sin categoría";
      if (!categoriasMap.has(categoria)) {
        categoriasMap.set(categoria, {
          nombre: categoria,
          cantidad: 0,
          stockTotal: 0
        });
      }
      
      const cat = categoriasMap.get(categoria);
      cat.cantidad++;
      cat.stockTotal += producto.stock || 0;
    });
    
    return Array.from(categoriasMap.values()).sort((a, b) => b.cantidad - a.cantidad);
  }, [productos]);

  if (stats.length === 0) return null;

  return (
    <div className="bg-white/90 shadow-xl rounded-2xl p-6 border border-blue-100 mb-6">
      <h3 className="text-lg font-bold mb-4 text-blue-800">Estadísticas de Categorías</h3>
      <div className="space-y-3">
        {stats.map((cat, index) => (
          <div key={cat.nombre} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="font-semibold text-blue-900">{cat.nombre}</div>
              <div className="text-sm text-blue-600">{cat.cantidad} producto{cat.cantidad !== 1 ? 's' : ''}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Stock total</div>
              <div className="font-bold text-green-600">{cat.stockTotal}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminHome() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState("productos");
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
      }
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (active) {
        setSession(newSession);
      }
    });
    return () => {
      active = false;
      authListener.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!session) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }
    setCheckingAdmin(true);
    supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data || data.role !== 'admin') {
          setIsAdmin(false);
          supabase.auth.signOut();
        } else {
          setIsAdmin(true);
        }
      })
      .finally(() => {
        if (active) setCheckingAdmin(false);
      });
    return () => {
      active = false;
    };
  }, [session]);

  const fetchProductos = useCallback(async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('*');
    if (error) {
      console.error('Error cargando productos:', error);
      return;
    }
    const rows = (data || []).sort((a, b) => {
      const dateA = new Date(a.created_at ?? a.createdAt ?? 0).getTime();
      const dateB = new Date(b.created_at ?? b.createdAt ?? 0).getTime();
      return dateB - dateA;
    });
    setProductos(rows);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchProductos();
    } else {
      setProductos([]);
    }
  }, [isAdmin, fetchProductos]);

  const handleLogin = (newSession) => {
    setSession(newSession);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  // Cuando se agrega un producto, refresca la lista
  const handleProductoAgregado = (nuevoProducto) => {
    if (nuevoProducto) {
      setProductos(prev => [nuevoProducto, ...prev]);
      setCurrentPage(1); // Volver a la primera página al agregar
    } else {
      fetchProductos();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
        <div className="bg-white/90 px-6 py-4 rounded-2xl shadow">Verificando permisos...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
        <div className="bg-white/90 px-6 py-4 rounded-2xl shadow text-center">
          <p className="font-semibold text-red-600">Tu cuenta no tiene acceso de administrador.</p>
          <button onClick={handleLogout} className="mt-4 bg-blue-700 text-white px-4 py-2 rounded">Salir</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200 flex flex-col items-center py-12 px-2">
      <div className="flex gap-4 mb-8">
        <button onClick={() => setTab("productos")} className={`px-6 py-2 rounded-t-lg font-bold text-lg border-b-2 ${tab === "productos" ? "border-blue-700 text-blue-800 bg-white/90" : "border-transparent text-gray-500 bg-white/60"}`}>Productos</button>
        <button onClick={() => setTab("pedidos")} className={`px-6 py-2 rounded-t-lg font-bold text-lg border-b-2 ${tab === "pedidos" ? "border-blue-700 text-blue-800 bg-white/90" : "border-transparent text-gray-500 bg-white/60"}`}>Pedidos</button>
        <button
          onClick={handleLogout}
          className="ml-8 bg-red-600 text-white px-3 py-1 rounded shadow-md hover:bg-red-700 transition"
        >
          Salir
        </button>
      </div>
      {tab === "productos" && (
        <div className="flex flex-col md:flex-row items-start justify-center w-full max-w-7xl gap-10 md:gap-16">
          <div className="flex-1 max-w-4xl w-full mb-8 md:mb-0">
            <section className="bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-8 md:p-10">
              <h2 className="text-4xl font-extrabold mb-8 text-blue-800 tracking-tight text-center font-sans drop-shadow">Productos</h2>
              <Productos productos={productos} adminMode={true} />
            </section>
          </div>
          <div className="w-full md:w-[400px] flex flex-col items-center">
            <CategoriasStats productos={productos} />
            <div className="bg-white/90 shadow-2xl rounded-3xl p-8 md:p-10 w-full border border-blue-100">
              <AdminPanel onProductoAgregado={handleProductoAgregado} productosExistentes={productos} />
            </div>
          </div>
        </div>
      )}
      {tab === "pedidos" && (
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-6 md:p-10">
            <AdminOrders session={session} />
          </div>
        </div>
      )}
    </div>
  );
}
