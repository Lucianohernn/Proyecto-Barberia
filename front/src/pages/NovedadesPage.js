import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/pages/NovedadesPage.css';

const Novedades = () => {
  const [novedades, setNovedades] = useState([]);

  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/novedades");
        const data = await response.json();
        setNovedades(data);
      } catch (error) {
        console.error("Error cargando novedades:", error);
      }
    };

    fetchNovedades();
  }, []);

  return (
    <div className="container my-5 novedades-container">
      <div className="text-center mb-4">
        <h2 className="fw-bold">Novedades</h2>
        <p className="text-muted">Enterate de lo último en nuestra barbería</p>
      </div>

      <div className="row">
        {novedades.length === 0 ? (
          <p className="text-center">No hay novedades por el momento.</p>
        ) : (
          novedades.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0 novedades-card">
                <div className="card-body d-flex flex-column">

                  {/* TÍTULO (OK) */}
                  <h5 className="card-title">{item.titulo}</h5>

                  {/* SUBTÍTULO (si existe) */}
                  {item.subtitulo && (
                    <p className="fw-bold text-muted">{item.subtitulo}</p>
                  )}

                  {/* CUERPO DE LA NOVEDAD */}
                  <p className="card-text">{item.cuerpo}</p>

                  {/* SI NO TENÉS FECHA, SE OCULTA AUTOMATICAMENTE */}
                  {item.fecha && (
                    <p className="text-muted small mt-auto">
                      Publicado: {new Date(item.fecha).toLocaleDateString()}
                    </p>
                  )}

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Novedades;
