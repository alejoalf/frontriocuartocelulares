import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import CartButton from "./CartButton";
import CartDrawer from "./CartDrawer";

const links = [
  { name: "Inicio", href: "#inicio" },
  { name: "Servicios", href: "#servicios" },
  { name: "Productos", href: "#categorias" },
  { name: "Galería", href: "#galeria" },
  { name: "Como Funciona", href: "#comofunciona" },
  // { name: "Testimonios", href: "#testimonios" }, // Oculto temporalmente
  { name: "Contacto", href: "#contacto" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map(link => link.href.replace('#', ''));
      const scrollPosition = window.scrollY + 200;

      let currentSection = "inicio";
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = sectionId;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 24 }}
      className={`fixed w-full z-50 top-0 left-0 transition-all ${scrolled ? "backdrop-blur-md bg-white/40 dark:bg-gray-900/40" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3">
        <a
          href="#inicio"
          className={`flex items-center gap-2 text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap min-w-0 overflow-hidden text-ellipsis ${
            scrolled ? "text-blue-700 dark:text-cyan-300" : "text-white dark:text-cyan-200"
          }`}
          style={{ maxWidth: '70vw' }}
        >
          <img src="/logo.png" alt="Logo Río Cuarto Celulares" className="h-10 w-auto sm:h-12 flex-shrink-0" />
          <span className="truncate">Río Cuarto Celulares</span>
        </a>
        <div className="hidden md:flex gap-4 sm:gap-8">
          {links.map(link => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors duration-200 text-base sm:text-lg ${
                  scrolled
                    ? isActive 
                      ? "text-blue-900 dark:text-cyan-100 font-semibold" 
                      : "text-blue-700 dark:text-cyan-200 hover:text-blue-900 dark:hover:text-cyan-100"
                    : isActive 
                      ? "text-white dark:text-cyan-100 font-semibold" 
                      : "text-white dark:text-cyan-200 hover:text-cyan-100"
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <CartButton onClick={() => setCartOpen(true)} />
        </div>
        <button
          className="ml-1 sm:ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-cyan-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition hidden md:inline-flex"
          onClick={() => setDark(d => !d)}
          title={dark ? "Modo claro" : "Modo oscuro"}
        >
          {dark ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
        <a
          href="https://wa.me/543584357917?text=Bienvenido%20a%20R%C3%ADo%20Cuarto%20Celulares%2C%20escribe%20tu%20consulta%20en%20el%20siguiente%20mensaje"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 sm:ml-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition hidden md:inline-flex"
          title="WhatsApp"
        >
          <FaWhatsapp size={24} />
        </a>
        {/* Botón hamburguesa */}
        <button
          className="md:hidden ml-1 sm:ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <FaBars size={24} />
        </button>
      </div>
      {/* Menú lateral móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", duration: 0.5, stiffness: 100, damping: 24 }}
            className="fixed top-0 right-0 w-11/12 max-w-xs h-full bg-white dark:bg-gray-900 shadow-2xl z-[999] flex flex-col p-4 gap-4 md:hidden"
          >
            <button
              className="self-end mb-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes size={28} />
            </button>
            {links.map(link => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`font-semibold text-base sm:text-lg transition-colors duration-200 px-2 py-3 rounded-lg ${
                    isActive 
                      ? "text-blue-900 dark:text-cyan-100 bg-blue-100 dark:bg-cyan-900" 
                      : "text-blue-700 dark:text-cyan-200 hover:text-blue-900 dark:hover:text-cyan-100 hover:bg-blue-50 dark:hover:bg-cyan-800"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </a>
              );
            })}
            <button
              className="bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-cyan-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-full p-3 flex items-center justify-center mt-2"
              onClick={() => setDark(d => !d)}
              title={dark ? "Modo claro" : "Modo oscuro"}
            >
              {dark ? <FaSun size={22} /> : <FaMoon size={22} />}
            </button>
            <a
              href="https://wa.me/543584357917?text=Bienvenido%20a%20R%C3%ADo%20Cuarto%20Celulares%2C%20escribe%20tu%20consulta%20en%20el%20siguiente%20mensaje"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition mt-4 justify-center"
              title="WhatsApp"
            >
              <FaWhatsapp size={22} /> WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); window.location.href = '/checkout'; }} />
    </motion.nav>
  );
};

export default Navbar; 