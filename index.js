const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors'); // Importa cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());

// Configuración de CORS para permitir solicitudes desde localhost:3000 (o cualquier otro dominio)
app.use(cors({
    origin: '*', // Cambia esto por la URL de tu frontend
    methods: ['GET', 'POST'], // Asegura que los métodos que estás utilizando están permitidos
    allowedHeaders: ['Content-Type'] // Permite las cabeceras necesarias
}));

// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

app.get('/test', (req, res) => {
    res.json({ message: 'Funciona correctamente' });
  });

// Endpoint para enviar correos
app.post('/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL,
            subject: `Nuevo mensaje de ${name}`,
            text: `Teléfono: ${phone}\n\nMensaje:\n${message}`
        });

        res.status(200).json({ message: 'Correo enviado con éxito.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el correo.', details: error.message });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Excelente, el servidor está corriendo en http://localhost:${PORT}`);
});
