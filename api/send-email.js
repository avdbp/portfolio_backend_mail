const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido.' }); // Asegura que solo aceptes POST
    }

    const { name, email, message } = req.body;

    // Valida los campos
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Configura Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Asegúrate de usar un servicio compatible o tus propios ajustes SMTP
        auth: {
            user: process.env.EMAIL, // Configura estas variables en el entorno de Vercel
            pass: process.env.PASSWORD
        }
    });

    try {
        // Envía el correo
        await transporter.sendMail({
            from: email,
            to: process.env.EMAIL,
            subject: `Nuevo mensaje de ${name}`,
            text: message
        });

        return res.status(200).json({ message: 'Correo enviado con éxito.' });
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ error: 'Error al enviar el correo.', details: error.message });
    }
};
