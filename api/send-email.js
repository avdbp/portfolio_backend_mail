const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        try {
            await transporter.sendMail({
                from: email,
                to: process.env.EMAIL,
                subject: `Nuevo mensaje de ${name}`,
                text: message
            });

            return res.status(200).json({ message: 'Correo enviado con éxito.' });
        } catch (error) {
            return res.status(500).json({ error: 'Error al enviar el correo.', details: error.message });
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido.' });
    }
};
