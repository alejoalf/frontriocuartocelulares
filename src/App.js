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
import { FaArrowUp } from "react-icons/fa";

function App() {
  const [loading, setLoading] = React.useState(true);
  const [showTop, setShowTop] = React.useState(false);
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
    <div className="font-sans bg-gray-100 min-h-screen">
      <Navbar />
      <div id="inicio">
        <Header />
      </div>
      <Servicios />
      <div id="galeria">
        <Galeria />
      </div>
      <div id="testimonios">
        <Testimonials />
      </div>
      <Ubicacion />
      <Contacto />
      <Footer />
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 bg-blue-700 hover:bg-blue-900 text-white p-3 rounded-full shadow-lg animate-bounce transition"
          title="Ir arriba"
        >
          <FaArrowUp size={22} />
        </button>
      )}
    </div>
  );
}

export default App;
