import React, { useEffect, useState, useCallback } from "react";
import { FaBoxOpen, FaCheck, FaTimes, FaTruck, FaHourglassHalf, FaClipboardList } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../config/supabaseClient";

const ESTADOS = [
  { value: "pendiente", label: "Pendiente", icon: <FaHourglassHalf className="text-yellow-500" /> },
  { value: "procesando", label: "Procesando", icon: <FaClipboardList className="text-blue-500" /> },
  { value: "enviado", label: "Enviado", icon: <FaTruck className="text-cyan-600" /> },
  { value: "entregado", label: "Entregado", icon: <FaCheck className="text-green-600" /> },
  { value: "cancelado", label: "Cancelado", icon: <FaTimes className="text-red-600" /> },
];

function EstadoBadge({ estado }) {
  const e = ESTADOS.find(s => s.value === estado) || {};
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-gray-100 border ${
    estado === "pendiente" ? "border-yellow-300 text-yellow-700" :
    estado === "procesando" ? "border-blue-300 text-blue-700" :
    estado === "enviado" ? "border-cyan-300 text-cyan-700" :
    estado === "entregado" ? "border-green-300 text-green-700" :
    "border-red-300 text-red-700"}`}>{e.icon}{e.label || estado}</span>;
}

export default function AdminOrders({ session }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [estadoEdit, setEstadoEdit] = useState("");
  const [saving, setSaving] = useState(false);
  const fetchOrdenes = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data, error: dbError } = await supabase
      .from('ordenes')
      .select('*');
    if (dbError) {
      console.error('Error al obtener órdenes:', dbError);
      setError("Error al cargar las órdenes");
      setOrdenes([]);
    } else {
      const rows = (Array.isArray(data) ? data : []).sort((a, b) => {
        const dateA = new Date(a.created_at ?? a.createdAt ?? 0).getTime();
        const dateB = new Date(b.created_at ?? b.createdAt ?? 0).getTime();
        return dateB - dateA;
      });
      setOrdenes(rows);
      setError("");
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchOrdenes();
    } else {
      setOrdenes([]);
    }
  }, [session, fetchOrdenes]);

  // Abrir detalles
  const openDetails = (orden) => {
    setSelected(orden);
    setEstadoEdit(orden.estado);
  };
  // Cerrar modal
  const closeDetails = () => {
    setSelected(null);
    setEstadoEdit("");
  };
  // Cambiar estado
  const handleEstadoChange = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data, error: updateError } = await supabase.rpc('set_orden_estado', {
        p_orden_id: selected.id,
        p_estado: estadoEdit
      });
      if (updateError) {
        throw updateError;
      }
      if (data) {
        setOrdenes(ordenes => ordenes.map(o => o.id === data.id ? data : o));
      }
      closeDetails();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError("No se pudo actualizar el estado");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-blue-800"><FaBoxOpen /> Pedidos</h2>
      {loading ? (
        <div className="text-center text-gray-500 py-20">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-600 font-bold py-20">{error}</div>
      ) : ordenes.length === 0 ? (
        <div className="flex flex-col items-center text-gray-400 gap-2 py-20"><FaBoxOpen className="text-5xl" />No hay pedidos aún</div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o, i) => (
                <tr key={o.id} className="border-b hover:bg-blue-50/40">
                  <td className="p-3 font-bold">{o.id}</td>
                  <td className="p-3">{o.nombre}</td>
                  <td className="p-3">{o.email}</td>
                  <td className="p-3">{o.telefono}</td>
                  <td className="p-3">${Number(o.total).toLocaleString()}</td>
                  <td className="p-3"><EstadoBadge estado={o.estado} /></td>
                  <td className="p-3">{(() => {
                    const fecha = o.created_at ?? o.createdAt;
                    return fecha ? new Date(fecha).toLocaleString() : "-";
                  })()}</td>
                  <td className="p-3">
                    <button onClick={() => openDetails(o)} className="bg-blue-700 hover:bg-blue-900 text-white px-3 py-1 rounded text-xs font-bold">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal de detalles */}
      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <button onClick={closeDetails} className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold">×</button>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-800"><FaBoxOpen /> Pedido #{selected.id}</h3>
              <div className="mb-2"><span className="font-semibold">Cliente:</span> {selected.nombre}</div>
              <div className="mb-2"><span className="font-semibold">Email:</span> {selected.email}</div>
              <div className="mb-2"><span className="font-semibold">Teléfono:</span> {selected.telefono}</div>
              <div className="mb-2"><span className="font-semibold">Dirección:</span> {selected.direccion}</div>
              <div className="mb-2"><span className="font-semibold">Total:</span> ${Number(selected.total).toLocaleString()}</div>
              <div className="mb-2"><span className="font-semibold">Estado:</span> <EstadoBadge estado={selected.estado} /></div>
              <div className="mb-4"><span className="font-semibold">Fecha:</span> {(() => {
                const fecha = selected?.created_at ?? selected?.createdAt;
                return fecha ? new Date(fecha).toLocaleString() : "-";
              })()}</div>
              <div className="mb-4">
                <span className="font-semibold">Productos:</span>
                <ul className="mt-2 space-y-2">
                  {Array.isArray(selected.items) ? selected.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 border-b pb-1">
                      <img src={item.imagen || "/logo.png"} alt={item.nombre} className="w-8 h-8 object-contain rounded border bg-white" />
                      <span className="font-semibold">{item.nombre}</span>
                      <span className="text-xs text-gray-500">x{item.cantidad}</span>
                      <span className="ml-auto font-bold">${Number(item.precio).toLocaleString()}</span>
                    </li>
                  )) : <li className="text-gray-400">Sin productos</li>}
                </ul>
              </div>
              <div className="mb-2">
                <label className="font-semibold mr-2">Cambiar estado:</label>
                <select value={estadoEdit} onChange={e => setEstadoEdit(e.target.value)} className="border rounded px-2 py-1">
                  {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>
                <button onClick={handleEstadoChange} disabled={saving || estadoEdit === selected.estado} className="ml-2 bg-blue-700 hover:bg-blue-900 text-white px-3 py-1 rounded text-xs font-bold disabled:opacity-60">Guardar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 