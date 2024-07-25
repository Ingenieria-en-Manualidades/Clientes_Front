import { H3Event } from "h3";
import { createTransport } from "nodemailer";

export default defineEventHandler( async (event: H3Event) => {
  const { correo } = await readBody(event);
  console.log("body", correo);

  const transporter = createTransport({
    service: 'Gmail',
    auth: {
      user: 'doctorjst321@gmail.com',
      pass: 'bgza jtql qata utqg'
    }
  })
  
  const mailOptions = {
    from: 'doctorjst321@gmail.com',
    to: correo,
    subject: 'Recuperar contraseña',
    text: 'Por favor, haga clic en el siguiente enlace para restablecer su contraseña: http://tusitio.com/reset-password?token=123456'
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Error al enviar el correo', error.message);
    // throw createError({
    //   statusCode: 500,
    //   statusMessage: 'Error al enviar el correo' + error.message
    // })
  }
})
