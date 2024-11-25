const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors'); // Importa cors

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors()); // Aplica el middleware cors para manejar CORS

// Configuración del transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
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
