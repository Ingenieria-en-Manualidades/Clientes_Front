
const url = 'http://127.0.0.1:8000/api';

export const useActualizarPasswordAPI = () => {

  const getTokenPassword = async (correo: string) => {
    try {
      const resultado = await fetch(`${url}/generartoken`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: correo,
        })
      });
  
      const data = await resultado.json();
  
      if (resultado.ok) {
        return {
          success: true,
          token: data.token
        }
      }else{
        return {
          success: false,
          status: resultado.status,
          motivo: data.error,
        }
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error al enviar al crear el token: ' + error.message
      })
    }
  }

  const setEnviarEmail = async (valorCorreo: string, token: string) => {
    try {
      const response = await fetch("/api/enviarEmailPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: valorCorreo,
        }),
      });
      if (response.ok) {
        respuesta.tittle = "Correo enviado";
        respuesta.detail =
          "Por favor revise su correo para continuar con el proceso de recuperar contraseña.";
      } else {
        console.error("Error con el response");
        respuesta.status = "error";
        respuesta.tittle = "Correo no enviado";
        respuesta.detail = "ERROR EN EL RESPONSE";
      }
    } catch (error) {
      console.error("Error en el catch", error.message);
      respuesta.status = "error";
      respuesta.tittle = "Correo no enviado";
      respuesta.detail = "ERROR EN EL CATCH";
    }
  }

  return {
    getTokenPassword,
  };
}
