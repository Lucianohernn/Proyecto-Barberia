const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3001; // Elige un puerto diferente al de React (3000)

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend de React
app.use(express.json()); // Permite que el servidor lea datos JSON en el cuerpo de la petición

// ----------------------------------------------------------------------
// CONEXIÓN A LA BASE DE DATOS
// Asegúrate de que XAMPP esté corriendo (Apache y MySQL)
// ----------------------------------------------------------------------
const db = mysql.createPool({
    host: 'localhost',
    user: 'root', // Usuario por defecto de XAMPP
    password: '', // Contraseña por defecto de XAMPP (déjala vacía)
    database: 'loginbarberia' // ¡CAMBIA ESTO! Debe ser el nombre de tu base de datos
});

// ----------------------------------------------------------------------
// ENDPOINT DE LOGIN (Ruta POST: /api/login)
// ----------------------------------------------------------------------
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Validación básica de datos
    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan credenciales.' });
    }

    try {
        // 1. Prepara la consulta SQL para buscar el usuario y la contraseña
        const [rows] = await db.query(
            'SELECT * FROM login WHERE usuario = ? AND password = ?',
            [username, password] // Los "?" son placeholders para prevenir ataques (SQL Injection)
        );

        // 2. Comprueba si se encontró un usuario
        if (rows.length === 1) {
            // Usuario encontrado y credenciales correctas
            const loggedInUser = rows[0].usuario; // 💡 Obtener el nombre de usuario de la fila
            
            res.json({ 
                success: true, 
                message: '¡Login exitoso!', 
                user: loggedInUser // 💡 ENVIAR el nombre de usuario de vuelta
            });
        } else {
            // Usuario no encontrado o credenciales incorrectas
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// ----------------------------------------------------------------------
// INICIO DEL SERVIDOR
// ----------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});