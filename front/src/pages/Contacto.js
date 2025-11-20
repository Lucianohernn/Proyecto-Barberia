import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import '../styles/components/pages/Contacto.css';

const Contacto = () => {
  // estados para cada campo del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(null); // para mostrar mensaje de exito

  // funcion que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // evita recargar la pagina

    //creacion de objeto con los datos del formulario
    const datosContacto = {nombre, email, telefono, mensaje};

    try {
      // envio datos al backend
      const respuesta = await fetch("http://localhost:3001/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosContacto),
      });

      if (respuesta.ok) {
        setEnviado("success");
        setNombre("");
        setEmail("");
        setTelefono("");
        setMensaje("");
      } else {
        setEnviado("error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setEnviado("error");
    }
  };


  return (
    <Container fluid className="py-5 contacto-section">
      <Row className="justify-content-center align-items-center">
        {/* Texto a la izquierda */}
        <Col md={5} className="mb-4 mb-md-0">
          <h2 className="fw-bold">Contactate con nosotros</h2>
          <p>Dejanos tu mensaje y te responderemos a la brevedad.</p>
        </Col>

        {/* Formulario a la derecha */}
        <Col md={6}>
          <Form onSubmit={handleSubmit}> 
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="nombreApellido">
                  <Form.Label>Nombre y Apellido</Form.Label>
                  <Form.Control 
                  type="text" 
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                   type="email" 
                   placeholder="ejemplo@correo.com"
                   value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                   />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="telefono">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control 
              type="tel" 
              placeholder="+54 9 11 1234-5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Motivo de Contacto</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Escribí tu mensaje aquí..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>

          {/* mensaje de confirmacion */}
          {enviado === "success" && (
            <Alert variant="success" className="mt-3">
              ¡Tu mensaje ha sido enviado con éxito!
            </Alert>
          )}
          {enviado === "error" && (
            <Alert variant="danger" className="mt-3">
              Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.
            </Alert>
          )}
        </Col>

      </Row>
    </Container>
  );
};

export default Contacto;
