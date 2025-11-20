import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/pages/NosotrosPage.css';

const NosotrosPage = () => {
  return (
    <div className="container my-5 titulo">
      {/* Título principal */}
      <div className="text-center mb-5">
        <h2>Sobre Nosotros</h2>
        <p className="text-muted">Conocé un poco más de nuestra historia</p>
      </div>

      {/* Historia */}
      <div className="card shadow-lg border-0 mb-5">
        <div className="row g-0">
          <div className="col-md-6">
            <img
              src="../images/nosotros/nosotros11.png"
              className="img-fluid h-100 w-100 object-fit-cover"
              alt="Nuestra barbería"
            />
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <div className="card-body p-4">
              <h2 className="card-title">Nuestra Historia</h2>
              <p className="card-text mt-3">
                La Barbería abrió sus puertas en el año 2010, como un pequeño
                local de barrio con un solo sillón y muchas ganas de crecer. Con
                el tiempo, gracias a la confianza de nuestros clientes, logramos
                expandirnos y abrir un espacio más amplio y moderno.
              </p>
              <p className="card-text mt-3">
                Hoy contamos con un equipo de profesionales apasionados, que
                combinan técnicas tradicionales con tendencias actuales para
                ofrecerte el mejor servicio.
              </p>
              <p className="fw-bold">¡Porque para nosotros lo importante es que te lleves la mejor experiencia!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Galería */}
        <div className="row text-center">
            <div className="col-md-4 mb-4">
                <img
                src="../images/nosotros/nosotros12.png"
                className="img-galeria"
                alt="Trabajo en la barbería"
                />
            </div>
            <div className="col-md-4 mb-4">
                <img
                src="../images/nosotros/cliente.jpg"
                className="img-galeria"
                alt="Clientes felices"
                />
            </div>
            <div className="col-md-4 mb-4">
                <img
                src="../images/nosotros/equipo.png"
                className="img-galeria"
                alt="Nuestro equipo"
                />
            </div>
        </div>
    </div>
  );
};

export default NosotrosPage;
