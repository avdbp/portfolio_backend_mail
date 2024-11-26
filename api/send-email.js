// Importamos nodemailer para manejar el envío de correos
const nodemailer = require("nodemailer");

// Exportamos la función handler
module.exports = async (req, res) => {
  // Verificamos que el método sea POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  // Parseamos el cuerpo de la solicitud
  const { name, email, message } = req.body;

  // Validamos los campos
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  // Configuramos el transportador de nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // Cambia esto por tu servidor SMTP
    port: 587, // Cambia según el puerto de tu servidor SMTP
    secure: false, // Cambia a 'true' si usas SSL/TLS
    auth: {
      user: "rocketmediaportfolio@gmail.com",  // Valor fijo para pruebas
      pass: "yecz emdz kcwu busv",  // Valor fijo para pruebas
    },
  });

  // Configuramos el correo
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "destinatario@example.com", // Cambia por tu correo de destino
    subject: "Nuevo mensaje desde el formulario",
    text: message,
  };

  try {
    // Enviamos el correo
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo." });
  }
};
