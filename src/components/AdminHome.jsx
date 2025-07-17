import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import Productos from "./Productos";
import AdminOrders from "./AdminOrders";

const PAGE_SIZE = 6;

export default function AdminHome() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState("productos");

  // Función para cargar productos
  const fetchProductos = async () => {
    const res = await fetch("http://localhost:5000/api/productos");
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    if (token) fetchProductos();
  }, [token]);

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem("adminToken", jwt);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("adminToken");
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-cyan-100 to-blue-200">
        <AdminLogin onLogin={handleLogin} />
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
            <div className="bg-white/90 shadow-2xl rounded-3xl p-8 md:p-10 w-full border border-blue-100">
              <AdminPanel token={token} onProductoAgregado={handleProductoAgregado} setProductos={setProductos} productos={productos} />
            </div>
          </div>
        </div>
      )}
      {tab === "pedidos" && (
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white/90 rounded-3xl shadow-2xl border border-blue-100 p-6 md:p-10">
            <AdminOrders />
          </div>
        </div>
      )}
    </div>
  );
}
