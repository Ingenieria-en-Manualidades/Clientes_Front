import { H3Event } from "h3";
import { createTransport } from "nodemailer";
import { useStylesEmail } from "~/composables/stylesEmail";

export default defineEventHandler( async (event: H3Event) => {

  const { arrayStylesEmail, arrayURLs } = useStylesEmail();
  const { correo, token } = await readBody(event);
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
    html: `
      <div style="width: 80%">
        <div style="${arrayStylesEmail[0]}">
          <img src="${arrayURLs[0]}" alt="IENMLogito" style="width: 30%;" />
          <p style="${arrayStylesEmail[1]}">Recuperar contraseña</p>
        </div>
        <div style="${arrayStylesEmail[2]}">
          <img src="${arrayURLs[1]}" alt="Candado" style="width: 15%;" />
          <p style="${arrayStylesEmail[3]}">Hola señor/a, ¿olvido su contraseña?</p>
          <p>Recibimos una solicitud para restablecer la contraseña de su cuenta.</p>
          <p>Para restablecer su contraseña, haga clic en el botón de abajo</p>
          <a href="${arrayURLs[2]}${token}" style="${arrayStylesEmail[4]}" >restablecer contraseña</a>
          <p>O copia y pega la URL en tu navegador:</p>
          <p style="color: white">${arrayURLs[2]}${token}</p>
        </div>
      </div>`,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true };
  } catch (error) {
    return { success: false, error: error};
  }
})
