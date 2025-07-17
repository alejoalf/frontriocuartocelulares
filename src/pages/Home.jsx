import React from 'react';
import Galeria from '../components/home/Galeria';
import Productos from '../components/home/Productos';
import ComoFunciona from '../components/home/ComoFunciona';
import Testimonials from '../components/home/Testimonials';
import Ubicacion from '../components/home/Ubicacion';
import Contacto from '../components/home/Contacto';
import Footer from '../components/layout/Footer';

const Home = () => (
  <>
    <Galeria />
    <Productos />
    <ComoFunciona />
    <Testimonials />
    <Ubicacion />
    <Contacto />
    <Footer />
  </>
);

export default Home; 