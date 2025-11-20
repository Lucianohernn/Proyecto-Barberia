import React from "react";
import "./ReservaModal.css"; // opcional, para los estilos del modal

const ReservaModal = ({
  formData,
  handleChange,
  handleSubmit,
  estaReservado,
  onClose
}) => {
  return (
    <div className="reserva-overlay">
      <div className="reserva-modal card shadow-lg">
        <div className="card-body">
          <button className="btn-close" onClick={onClose}>X</button>

          <h2 className="card-title mb-3">¡Reservá tu turno ya!</h2>

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="mb-3">
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Nombre y Apellido"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            {/* Día */}
            <div className="mb-3">
              <select
                name="dia"
                className="form-select"
                value={formData.dia}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar día</option>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map(
                  (dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Horario */}
            <div className="mb-3">
              <select
                name="horario"
                className="form-select"
                value={formData.horario}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar horario</option>

                <optgroup label="Mañana">
                  {["08:00", "09:00", "10:00", "11:00"].map((hora) => (
                    <option
                      key={hora}
                      value={hora}
                      disabled={estaReservado(formData.dia, hora)}
                    >
                      {hora} {estaReservado(formData.dia, hora) ? "(OCUPADO)" : ""}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Tarde">
                  {["16:00", "17:00", "18:00", "19:00"].map((hora) => (
                    <option
                      key={hora}
                      value={hora}
                      disabled={estaReservado(formData.dia, hora)}
                    >
                      {hora} {estaReservado(formData.dia, hora) ? "(OCUPADO)" : ""}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Botón de envío */}
            <button type="submit" className="btn btn-success w-100">
              Confirmar Reserva
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservaModal;
