import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import '../styles/components/pages/Galeria.css';


const Galeria = () => {
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (img) => {
    setSelectedImage(img);
    setShow(true);
  };

  // Ejemplo de imágenes con mensaje
  const imagenes = [
    {
      src: "/images/galeria/corteclasico.png",
      titulo: "Corte clásico",
      mensaje: "Un estilo que nunca pasa de moda."
    },
    {
      src: "/images/galeria/fademoderno.png",
      titulo: "Fade moderno",
      mensaje: "El look más pedido por los clientes jóvenes."
    },
    {
      src: "/images/galeria/barbaperfilada.jpg",
      titulo: "Barba perfilada",
      mensaje: "Un acabado perfecto para destacar tu estilo."
    },
    {
      src: "/images/galeria/cortelegante.png",
      titulo: "Estilo elegante",
      mensaje: "Ideal para ocasiones especiales."
    }
  ];

  return (
    <div className="container my-5 galeria-container">
      <h2 className="text-center mb-4">Nuestra Galería</h2>
      <div className="row">
        {imagenes.map((img, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm galeria-card">
              <img
                src={img.src}
                className="card-img-top"
                alt={img.titulo}
                style={{ objectFit: "cover", height: "200px", cursor: "pointer" }}
                onClick={() => handleShow(img.src)}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{img.titulo}</h5>
                <p className="card-text">{img.mensaje}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para ampliar imagen */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Body className="p-0">
          <img src={selectedImage} alt="Ampliada" className="img-fluid w-100" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Galeria;
