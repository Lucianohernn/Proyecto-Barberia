const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');

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
// ENDPOINT DE CONTACTO (Ruta POST: /api/contacto)
// ----------------------------------------------------------------------
app.post('/api/contacto', async (req, res) => {
    const { nombre, email, telefono, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    try {
        // 1️⃣ Guardar el mensaje en la base de datos
        const [result] = await db.query(
            'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono, mensaje]
        );

        // 2️⃣ Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '@gmail.com', // tu correo
                pass: '', // contraseña o clave de aplicación
            },
        });

        // 3️⃣ Configurar el contenido del email
        const mailOptions = {
            from: `"Formulario Barbería" <@gmail.com>`,
            to: '@gmail.com', // a dónde querés recibir los mensajes
            subject: 'Nuevo mensaje de contacto recibido',
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje}</p>
            `,
        };

        // 4️⃣ Enviar el correo
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Mensaje guardado y correo enviado correctamente.' });
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo o guardar el mensaje.' });
    }
});

// ----------------------------------------------------------------------
// ENDPOINTS DE RESERVAS
// ----------------------------------------------------------------------

// Crear una reserva
app.post('/api/reservas', async (req, res) => {
    const { usuario, fecha, hora, servicio } = req.body;

    if (!usuario || !fecha || !hora) {
        return res.status(400).json({ success: false, message: 'Faltan datos para la reserva.' });
    }

    try {
        // Verificar si ya hay una reserva en ese horario
        const [existe] = await db.query(
            'SELECT * FROM reservas WHERE fecha = ? AND hora = ? AND estado = "reservado"',
            [fecha, hora]
        );

        if (existe.length > 0) {
            return res.json({ success: false, message: 'Ese horario ya está reservado.' });
        }

        // Insertar la nueva reserva
        await db.query(
            'INSERT INTO reservas (usuario, fecha, hora, servicio) VALUES (?, ?, ?, ?)',
            [usuario, fecha, hora, servicio || null]
        );

        res.json({ success: true, message: 'Reserva realizada con éxito.' });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Obtener reservas del usuario logueado
app.get('/api/reservas/:usuario', async (req, res) => {
    const { usuario } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM reservas WHERE usuario = ? AND estado = "reservado"',
            [usuario]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// Cancelar una reserva
app.delete('/api/reservas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(
            'UPDATE reservas SET estado = "cancelado" WHERE id = ?',
            [id]
        );
        res.json({ success: true, message: 'Reserva cancelada correctamente.' });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});



// ----------------------------------------------------------------------
// INICIO DEL SERVIDOR
// ----------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});