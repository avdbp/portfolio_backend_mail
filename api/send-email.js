const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Solo aceptar solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    }

    const { name, email, message } = req.body;

    // Validar campos obligatorios
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Configurar Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Puedes usar otro servicio o configuraciones SMTP personalizadas
        auth: {
            user: process.env.EMAIL, // Correo configurado en variables de entorno
            pass: process.env.PASSWORD // Contraseña o token de aplicación
        }
    });

    try {
        // Enviar correo
        await transporter.sendMail({
            from: email, // Dirección del remitente
            to: process.env.EMAIL, // Dirección de destino (tu correo)
            subject: `Nuevo mensaje de ${name}`, // Asunto del correo
            text: message // Contenido del mensaje
        });

        return res.status(200).json({ message: 'Correo enviado con éxito.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al enviar el correo.', details: error.message });
    }
};
