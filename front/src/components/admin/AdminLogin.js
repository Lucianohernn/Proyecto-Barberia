import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false); // 🔹 NUEVO: modo registro o login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔹 Cambiamos la URL según el modo
    const url = isRegister
      ? "http://localhost:3001/api/register"
      : "http://localhost:3001/api/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (isRegister) {
          alert("✅ Registro exitoso. Ahora podés iniciar sesión.");
          setIsRegister(false); // volvemos al modo login
        } else {
          // 🔥 Guardamos la sesión
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", data.user);
          localStorage.setItem("role", data.role);

          if (onLoginSuccess) onLoginSuccess();

          alert("✅ Inicio de sesión correcto");
          navigate("/");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            {isRegister ? "Registrarse" : "Entrar"}
          </button>
        </form>

        {/* 🔹 Este bloque es el botón que preguntabas */}
        <p className="mt-3 text-center">
          {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="btn btn-link"
          >
            {isRegister ? "Iniciá sesión" : "Registrate acá"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
