const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Cambia esto si tienes un dominio específico
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Verificación del transportador
transporter.verify((error, success) => {
    if (error) {
        console.error('Error al verificar Nodemailer:', error);
    } else {
        console.log('Nodemailer está listo para enviar correos');
    }
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Endpoint para enviar correos
app.post('/api/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos obligatorios excepto el teléfono' });
    }

    try {
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL,
            subject: `Nuevo mensaje de ${name}`,
            html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Correo electrónico:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
        });

        res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Hubo un problema al enviar el correo' });
    }
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
