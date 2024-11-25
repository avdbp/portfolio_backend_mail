const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Crea una instancia de Express
const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Cambia esto por la URL de tu frontend si es diferente
}));

// Middleware
app.use(bodyParser.json());

// Middleware de limitación de tasa
const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
});

app.use((req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => res.status(429).json({ message: 'Demasiadas solicitudes. Inténtalo más tarde.' }));
});

// Ruta de envío de correo
app.post('/send-email', async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El correo electrónico no es válido' });
    }

    if (phone && isNaN(phone)) {
        return res.status(400).json({ message: 'El número de teléfono debe ser válido' });
    }

    if (message.length > 1000) {
        return res.status(400).json({ message: 'El mensaje es demasiado largo' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.verify();

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL,
            subject: 'Nuevo mensaje desde el formulario de contacto',
            html: `
                <h3>Nuevo mensaje de contacto</h3>
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Correo electrónico:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Hubo un error al enviar el correo' });
    }
});

// Exporta la aplicación para que Vercel pueda ejecutarla como una función serverless
module.exports = (req, res) => {
  app(req, res);
};
