import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/pages/HomePage.css';


const HomePage = () => {

  // --- Carrusel de promociones (textos) ---
  const promociones = [
    {
      titulo: "Arranca la semana con el mejor estilo, ¡reserva tu turno!",
      texto: ""
    },
    {
      titulo: "Cuidar tu barba nunca fue tan fácil",
      texto: "Descubrí productos premium y técnicas de afeitado profesional en un ambiente único pensado para vos."
    },
    {
      titulo: "Tu estilo, nuestra pasión",
      texto: "Cortes clásicos o modernos, perfilado de barba y una experiencia que te hace volver."
    }
  ];

  const [indexPromo, setIndexPromo] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndexPromo((prevIndex) => (prevIndex + 1) % promociones.length);
    }, 5000); // 5 segundos
    return () => clearInterval(intervalo);
  }, [promociones.length]);

  // Render
  return (
    <main className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="hero-section"
            style={{
              backgroundImage: "url('/images/home/banner.jpg')"
            }}
          >
            <div className="hero-overlay" />
            <div className="hero-text fade-in" key={indexPromo}>
              <p className="badge bg-secondary text-uppercase">Contenido Promocionado</p>
              <h1>{promociones[indexPromo].titulo}</h1>
              <p>{promociones[indexPromo].texto}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
