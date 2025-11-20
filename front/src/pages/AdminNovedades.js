import React, { useEffect, useState } from "react";
import "../styles/components/pages/AdminNovedades.css";

const AdminNovedades = () => {
  const [novedades, setNovedades] = useState([]);
  const [form, setForm] = useState({
    img_id: "",
    titulo: "",
    subtitulo: "",
    cuerpo: ""
  });
  const [loading, setLoading] = useState(false);

  // Cargar novedades desde el backend
  const fetchNovedades = async () => {
    const res = await fetch("http://localhost:3001/api/novedades");
    const data = await res.json();
    setNovedades(data);
  };

  useEffect(() => {
    fetchNovedades();
  }, []);

  // Manejar cambios del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear una nueva novedad
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("http://localhost:3001/api/novedades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message);
    setLoading(false);

    if (data.success) {
      setForm({ img_id: "", titulo: "", subtitulo: "", cuerpo: "" });
      fetchNovedades();
    }
  };

  // Eliminar novedad
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta novedad?")) return;

    const res = await fetch(`http://localhost:3001/api/novedades/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    alert(data.message);
    fetchNovedades();
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Panel de Novedades</h2>

      {/* Formulario */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="img_id"
          placeholder="ID de imagen (opcional)"
          value={form.img_id}
          onChange={handleChange}
        />

        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
        />

        <input
          name="subtitulo"
          placeholder="Subtítulo"
          value={form.subtitulo}
          onChange={handleChange}
          required
        />

        <textarea
          name="cuerpo"
          placeholder="Contenido"
          value={form.cuerpo}
          onChange={handleChange}
          required
        />

        <button className="admin-btn" type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Novedad"}
        </button>
      </form>

      <hr className="admin-divider" />

      {/* Lista de novedades */}
      <div className="admin-list">
        {novedades.map((item) => (
          <div key={item.id} className="admin-card">
            <h3>{item.titulo}</h3>
            <p>{item.subtitulo}</p>
            <small>ID Imagen: {item.img_id ?? "N/A"}</small>

            <button
              className="admin-delete-btn"
              onClick={() => handleDelete(item.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNovedades;
