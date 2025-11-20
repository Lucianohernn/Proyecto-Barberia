const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require ('bcrypt');

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
    password: '', // Contraseña por defecto de XAMPP
    database: 'loginbarberia' // nombre de la base de datos
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
        // Buscar el usuario en la base
        const [rows] = await db.query('SELECT * FROM login WHERE usuario = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        // Comparar la contraseña ingresada con la encriptada
        const match = await bcrypt.compare(password, rows[0].password);

        if (!match) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
        }

        // Si coincide, login exitoso
        const loggedInUser = rows[0].usuario;

        res.json({
            success: true,
            message: '¡Login exitoso!',
            user: loggedInUser,
            role: rows[0].tipo
        });

    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// ----------------------------------------------------------------------
// ENDPOINT DE REGISTRO (Ruta POST: /api/register)
// ----------------------------------------------------------------------
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Validación básica
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Faltan credenciales.' });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await db.query(
            'SELECT * FROM login WHERE usuario = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.json({ success: false, message: 'El usuario ya existe.' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 5);

        // 🔥 AHORA SÍ: Guardar tipo = "user"
        await db.query(
            'INSERT INTO login (usuario, password, tipo) VALUES (?, ?, ?)',
            [username, hashedPassword, 'user']
        );

        res.json({ success: true, message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
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
        // 1️⃣ Guardar en la BD
        await db.query(
            'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono, mensaje]
        );

        // 2️⃣ Configurar MAILTRAP
        const transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "ba587ed8461f22",  // ⚠️ Reemplazar
                pass: "2ed528252d1401"   // ⚠️ Reemplazar
            },
        });

        // 3️⃣ Configurar el email
        const mailOptions = {
            from: '"Formulario Barbería" <no-reply@barberia.com>',
            to: 'test@inbox.mailtrap.io', // Mail atrapado en Mailtrap
            subject: 'Nuevo mensaje de contacto',
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${mensaje}</p>
            `,
        };

        // 4️⃣ Enviar correo (a Mailtrap)
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Mensaje guardado y enviado a Mailtrap correctamente.'
        });

    } catch (error) {
        console.error('Error al procesar mensaje:', error);
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
// ENDPOINT: Crear nueva novedad
// ----------------------------------------------------------------------
app.post('/api/novedades', async (req, res) => {
    const { img_id, titulo, subtitulo, cuerpo } = req.body;

    if (!titulo || !subtitulo || !cuerpo) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });
    }

    try {
        await db.query(
            'INSERT INTO novedades (img_id, titulo, subtitulo, cuerpo) VALUES (?, ?, ?, ?)',
            [img_id || null, titulo, subtitulo, cuerpo]
        );

        res.json({ success: true, message: 'Novedad creada correctamente.' });
    } catch (error) {
        console.error('Error al crear novedad:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// ----------------------------------------------------------------------
// ENDPOINT: Obtener todas las novedades
// ----------------------------------------------------------------------
app.get('/api/novedades', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM novedades ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener novedades:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// ----------------------------------------------------------------------
// ENDPOINT: Eliminar novedad por ID
// ----------------------------------------------------------------------
app.delete('/api/novedades/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM novedades WHERE id = ?', [id]);
        res.json({ success: true, message: 'Novedad eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar novedad:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});

// ----------------------------------------------------------------------
// INICIO DEL SERVIDOR
// ----------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});