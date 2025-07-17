import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const redes = [
  { icon: <FaFacebookF size={22} />, href: "https://www.facebook.com/riocuartocelulares", label: "Facebook" },
  { icon: <FaInstagram size={22} />, href: "https://www.instagram.com/riocuartocelulares/", label: "Instagram" },
  { icon: <FaWhatsapp size={22} />, href: "https://wa.me/543584357917", label: "WhatsApp" },
];

const secciones = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "¿Cómo funciona?", href: "#" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Ubicación", href: "#ubicacion" },
  { label: "Contacto", href: "#contacto" },
];

const Footer = () => (
  <footer className="bg-blue-800 dark:bg-[#111111] text-cyan-100 pt-14 pb-8 px-4 mt-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-12 md:gap-24">
      {/* Logo y contacto */}
      <div className="flex-1 flex flex-col items-center md:items-start gap-6">
        <img src="/logo.png" alt="Logo Río Cuarto Celulares" className="h-24 w-auto mb-2 md:mb-0" />
        <div className="text-base leading-relaxed text-center md:text-left">
          <div className="mb-2">Tel: <a href="tel:+543584357917" className="hover:underline">+54 358 435-7917</a></div>
          <div><a href="mailto:info@riocuartocelulares.com" className="hover:underline">info@riocuartocelulares.com</a></div>
        </div>
        <div className="flex gap-3 mt-4">
          {redes.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-900 hover:bg-cyan-700 transition-colors rounded-lg w-12 h-12 flex items-center justify-center shadow-md"
              title={r.label}
            >
              {r.icon}
            </a>
          ))}
        </div>
      </div>
      {/* Secciones */}
      <div className="flex-1 flex flex-col items-center md:items-end gap-2">
        <h4 className="font-bold mb-4 text-lg text-white">Secciones</h4>
        <ul className="space-y-2 text-base text-center md:text-right">
          {secciones.map((sec) => (
            <li key={sec.label}><a href={sec.href} className="hover:underline">{sec.label}</a></li>
          ))}
        </ul>
      </div>
    </div>
    <div className="text-center text-xs text-cyan-200 mt-10">&copy; {new Date().getFullYear()} Río Cuarto Celulares. Todos los derechos reservados.</div>
  </footer>
);

export default Footer; 