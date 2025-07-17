import React from "react";
import Loader from "./components/Loader.jsx";
import Galeria from "./components/Galeria.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Header from "./components/Header.jsx";
import Servicios from "./components/Servicios.jsx";
import Ubicacion from "./components/Ubicacion.jsx";
import Contacto from "./components/Contacto.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import Particles from "./components/Particles.jsx";
import { FaArrowUp } from "react-icons/fa";
import ComoFunciona from "./components/ComoFunciona.jsx";
import { motion } from "framer-motion";
import Productos from "./components/Productos.jsx";
import AdminPage from "./components/AdminPage";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./components/AdminHome";
import Checkout from "./components/Checkout";
import CartDrawer from "./components/CartDrawer.jsx";
import FloatingCart from "./components/FloatingCart.jsx";
import { ToastContainer } from "./components/Toast.jsx";

function MainContent() {
  const [loading, setLoading] = React.useState(true);
  const [showTop, setShowTop] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  // Sistema de Toasts global
  const [toasts, setToasts] = React.useState([]);
  // Función para agregar un toast
  const addToast = (message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };
  // Función para remover un toast
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (loading) return <Loader />;
  return (
    <div className="font-sans bg-animated bg-pattern min-h-screen relative">
      <Particles />
      <ScrollProgress />
      <Navbar onCartClick={() => setCartOpen(true)} />
      <FloatingCart onOpenCart={() => setCartOpen(true)} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div id="inicio">
        <Header />
      </div>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 24 }}
      >
        <Servicios />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 24 }}
      >
        <Productos />
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 24 }}
      >
        <div id="galeria">
          <Galeria />
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 24 }}
      >
        <ComoFunciona />
      </motion.section>
      {/*
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 24 }}
      >
        <div id="testimonios">
          <Testimonials />
        </div>
      </motion.section>
      */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 24 }}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-10 md:gap-20 px-4">
          <div className="flex-1 min-w-0">
            <Ubicacion />
          </div>
          <div className="flex-1 min-w-0">
            <Contacto />
          </div>
        </div>
      </motion.section>
      <Footer />
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 bg-blue-700 hover:bg-blue-900 text-white p-3 rounded-full animate-bounce transition"
          title="Ir arriba"
        >
          <FaArrowUp size={22} />
        </button>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => setCartOpen(false)} addToast={addToast} />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/*" element={<MainContent />} />
    </Routes>
  );
}

export default App; 