import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaCheckCircle, FaArrowRight, FaArrowLeft, FaShoppingCart, FaEnvelope, FaPhone, FaHome, FaWhatsapp, FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateTelefono = tel => /^\d{8,}$/.test(tel.replace(/\D/g, ""));

const steps = [
  { label: "Datos personales", icon: <FaUser /> },
  { label: "Dirección", icon: <FaMapMarkerAlt /> },
  { label: "Confirmación", icon: <FaCheckCircle /> }
];

export default function Checkout() {
  const items = useSelector(state => state.cart.items);
  const total = items.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", direccion: "" });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  // Validaciones campo a campo
  const errors = {
    nombre: !form.nombre ? "El nombre es obligatorio" : "",
    email: !form.email ? "El email es obligatorio" : (!validateEmail(form.email) ? "Email inválido" : ""),
    telefono: !form.telefono ? "El teléfono es obligatorio" : (!validateTelefono(form.telefono) ? "Teléfono inválido (mínimo 8 dígitos)" : ""),
    direccion: !form.direccion ? "La dirección es obligatoria" : ""
  };
  const isStepValid = () => {
    if (step === 0) return !errors.nombre && !errors.email && !errors.telefono;
    if (step === 1) return !errors.direccion;
    if (step === 2) return Object.values(errors).every(e => !e) && items.length > 0;
    return false;
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleBlur = e => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

  const handleNext = e => {
    e.preventDefault();
    setTouched(t => ({ ...t, ...(step === 0 ? { nombre: true, email: true, telefono: true } : { direccion: true }) }));
    setError("");
    if (!isStepValid()) {
      setError("Por favor corrige los errores antes de continuar.");
      return;
    }
    setStep(s => s + 1);
  };
  const handleBack = e => {
    e.preventDefault();
    setError("");
    setStep(s => s - 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setTouched({ nombre: true, email: true, telefono: true, direccion: true });
    setError("");
    if (!isStepValid()) {
      setError("Por favor corrige los errores antes de continuar.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://backriocuartocelulares.up.railway.app/api/ordenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, total, items })
      });
      if (res.ok) {
        setSuccess(true);
        dispatch(clearCart());
      } else {
        const data = await res.json();
        setError(data.error || "Error al procesar la orden");
      }
    } catch {
      setError("Error de red al conectar con el servidor");
    }
    setLoading(false);
  };

  const handleMercadoPago = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("https://backriocuartocelulares.up.railway.app/api/pago/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, nombre: form.nombre, email: form.email })
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError("No se pudo iniciar el pago con Mercado Pago");
      }
    } catch {
      setError("Error al conectar con Mercado Pago");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <motion.div className="max-w-lg mx-auto mt-20 bg-white rounded-3xl shadow-2xl p-10 text-center flex flex-col items-center gap-4 border border-blue-100 animate-fade-in"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <FaCheckCircle className="text-green-500 text-5xl mb-2 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2 text-green-700">¡Compra realizada con éxito!</h2>
        <p className="mb-2">Te contactaremos pronto para coordinar la entrega.</p>
        <a href="/" className="mt-6 bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded font-bold text-lg shadow inline-block">Seguir comprando</a>
        <a href="https://wa.me/543584357917?text=Hola%2C%20acabo%20de%20realizar%20una%20compra%20en%20la%20web%20y%20quiero%20consultar%20por%20mi%20pedido" target="_blank" rel="noopener noreferrer" className="mt-2 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded font-bold text-lg shadow inline-flex items-center gap-2"><FaWhatsapp /> Consultar por WhatsApp</a>
      </motion.div>
    );
  }

  // Resumen lateral fijo (desktop)
  const ResumenLateral = () => (
    <div className="hidden md:block w-full max-w-xs ml-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-6 sticky top-10 self-start animate-fade-in">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-800"><FaShoppingCart /> Resumen</h3>
      {items.length === 0 ? (
        <div className="flex flex-col items-center text-gray-400 gap-2 py-8"><FaBoxOpen className="text-4xl" />Carrito vacío</div>
      ) : (
        <ul className="mb-4 divide-y">
          {items.map(item => (
            <li key={item.id} className="flex items-center gap-2 py-2">
              <img src={item.imagen || "/logo.png"} alt={item.nombre} className="w-10 h-10 object-contain rounded border bg-white" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-blue-900 text-sm truncate">{item.nombre}</div>
                <div className="text-xs text-gray-500">x{item.cantidad} - ${item.precio.toLocaleString()}</div>
                {item.stock !== undefined && item.stock <= 3 && item.stock > 0 && (
                  <span className="text-xs text-yellow-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Stock bajo</span>
                )}
                {item.stock !== undefined && item.stock === 0 && (
                  <span className="text-xs text-red-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Sin stock</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between text-base mb-1"><span>Subtotal:</span><span className="font-semibold">${total.toLocaleString()}</span></div>
      <div className="flex justify-between text-base mb-1"><span>Envío:</span><span className="font-semibold">{total > 50000 ? <span className="text-green-600 font-bold">Gratis</span> : "$5.000"}</span></div>
      <div className="flex justify-between text-lg font-bold border-t pt-2"><span>Total:</span><span className="text-blue-700">${(total + (total > 50000 ? 0 : 5000)).toLocaleString()}</span></div>
    </div>
  );

  // Revisión de datos antes de confirmar
  const DatosResumen = () => (
    <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-100 animate-fade-in">
      <h4 className="font-bold mb-2 text-blue-800 flex items-center gap-2"><FaUser /> Tus datos</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div><span className="font-semibold">Nombre:</span> {form.nombre}</div>
        <div><span className="font-semibold">Email:</span> {form.email}</div>
        <div><span className="font-semibold">Teléfono:</span> {form.telefono}</div>
        <div className="md:col-span-2"><span className="font-semibold">Dirección:</span> {form.direccion}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row items-start justify-center bg-gray-50 py-10 animate-fade-in">
      <motion.div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-blue-100 mx-auto md:mx-0"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Barra de progreso */}
        <div className="flex items-center mb-10 gap-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className={`flex items-center gap-2 ${i < step ? 'text-blue-700' : i === step ? 'text-blue-900 font-bold' : 'text-gray-400'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${i <= step ? 'border-blue-700 bg-blue-50' : 'border-gray-300 bg-white'} text-xl`}>{s.icon}</div>
                <span className="ml-1 mr-2 text-base font-semibold">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-1 ${i < step ? 'bg-blue-700' : 'bg-gray-200'} rounded-full`}></div>}
            </React.Fragment>
          ))}
        </div>
        <form onSubmit={step === 2 ? handleSubmit : handleNext} className="grid grid-cols-1 gap-8 mb-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-2"><FaUser /> Nombre completo</label>
                  <div className="relative">
                    <input name="nombre" value={form.nombre} onChange={handleChange} onBlur={handleBlur} className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${touched.nombre && errors.nombre ? 'border-red-400' : 'border-gray-200'}`} required />
                    {touched.nombre && !errors.nombre && <FaCheckCircle className="absolute right-3 top-3 text-green-500" />}
                    {touched.nombre && errors.nombre && <FaExclamationTriangle className="absolute right-3 top-3 text-red-500" />}
                  </div>
                  {touched.nombre && errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-2"><FaEnvelope /> Email</label>
                  <div className="relative">
                    <input name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${touched.email && errors.email ? 'border-red-400' : 'border-gray-200'}`} required />
                    {touched.email && !errors.email && <FaCheckCircle className="absolute right-3 top-3 text-green-500" />}
                    {touched.email && errors.email && <FaExclamationTriangle className="absolute right-3 top-3 text-red-500" />}
                  </div>
                  {touched.email && errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                </div>
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-1 flex items-center gap-2"><FaPhone /> Teléfono</label>
                  <div className="relative">
                    <input name="telefono" value={form.telefono} onChange={handleChange} onBlur={handleBlur} className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${touched.telefono && errors.telefono ? 'border-red-400' : 'border-gray-200'}`} required />
                    {touched.telefono && !errors.telefono && <FaCheckCircle className="absolute right-3 top-3 text-green-500" />}
                    {touched.telefono && errors.telefono && <FaExclamationTriangle className="absolute right-3 top-3 text-red-500" />}
                  </div>
                  {touched.telefono && errors.telefono && <div className="text-red-600 text-sm mt-1">{errors.telefono}</div>}
                </div>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="step2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block font-semibold mb-1 flex items-center gap-2"><FaHome /> Dirección</label>
                <div className="relative">
                  <input name="direccion" value={form.direccion} onChange={handleChange} onBlur={handleBlur} className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${touched.direccion && errors.direccion ? 'border-red-400' : 'border-gray-200'}`} required />
                  {touched.direccion && !errors.direccion && <FaCheckCircle className="absolute right-3 top-3 text-green-500" />}
                  {touched.direccion && errors.direccion && <FaExclamationTriangle className="absolute right-3 top-3 text-red-500" />}
                </div>
                {touched.direccion && errors.direccion && <div className="text-red-600 text-sm mt-1">{errors.direccion}</div>}
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.3 }}
              >
                <DatosResumen />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaShoppingCart /> Resumen de compra</h3>
                <ul className="mb-4 divide-y">
                  {items.map(item => (
                    <li key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <img src={item.imagen || "/logo.png"} alt={item.nombre} className="w-8 h-8 object-contain rounded border bg-white" />
                        <span>{item.nombre} <span className="text-xs text-gray-400">x{item.cantidad}</span></span>
                        {item.stock !== undefined && item.stock <= 3 && item.stock > 0 && (
                          <span className="text-xs text-yellow-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Stock bajo</span>
                        )}
                        {item.stock !== undefined && item.stock === 0 && (
                          <span className="text-xs text-red-600 font-bold flex items-center gap-1"><FaExclamationTriangle /> Sin stock</span>
                        )}
                      </div>
                      <span className="font-semibold">${(item.precio * item.cantidad).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold text-lg mb-6 border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <FaWhatsapp className="text-green-500" />
                  <span className="text-sm">¿Dudas? <a href="https://wa.me/543584357917?text=Hola%2C%20quiero%20consultar%20por%20mi%20compra" target="_blank" rel="noopener noreferrer" className="underline text-blue-700 font-semibold">Escribinos por WhatsApp</a></span>
                </div>
                {/* Botón Mercado Pago */}
                <button
                  type="button"
                  className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-8 rounded font-bold flex items-center gap-2 disabled:opacity-60"
                  onClick={handleMercadoPago}
                  disabled={!isStepValid() || loading}
                >
                  Pagar con Mercado Pago
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-4 flex gap-2">
            {step > 0 && <button type="button" onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded font-semibold flex items-center gap-2"><FaArrowLeft /> Atrás</button>}
            {step < 2 && <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded font-bold flex items-center gap-2 disabled:opacity-60" disabled={!isStepValid() || loading}>Siguiente <FaArrowRight /></button>}
            {step === 2 && <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded font-bold flex items-center gap-2 disabled:opacity-60" disabled={!isStepValid() || loading}>{loading ? <><span className="animate-spin mr-2"><FaCheckCircle /></span>Procesando...</> : <>Confirmar compra <FaCheckCircle /></>}</button>}
          </div>
          {error && <div className="text-red-600 mt-2 font-semibold">{error}</div>}
        </form>
      </motion.div>
      <ResumenLateral />
    </div>
  );
} 