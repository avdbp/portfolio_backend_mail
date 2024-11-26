const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "destinatario@example.com",
    subject: "Nuevo mensaje desde el formulario",
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res.status(500).json({ error: "Error al enviar el correo." });
  }
};
