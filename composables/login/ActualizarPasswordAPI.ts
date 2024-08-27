const url = 'http://127.0.0.1:8000/api';

export const useActualizarPasswordAPI = () => {
  /**
   * Método que se dedica a crear el token a un usuario para que pueda actualizar su contraseña, primero verificando si el correo existe y luego crearlo.
   * @param correo :Correo ingresado por el usuario.
   * @returns En caso de existir el correo dentro de la BD retorna el token y un booleano 'true', en caso contrario retorna un 'false' y el motivo del fallo.
   */
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
        statusMessage: 'Error al crear el token: ' + error.message
      })
    }
  }

  /**
   * Método que se encarga de enviar el correo con un link unico gracias al token que va junto a el.
   * @param valorCorreo :Correo ya verificado que existe en la BD.
   * @param valorToken :Token que se encuentra dentro de la URL a la hora de entrar.
   * @returns retorna un mensaje de exito o fracaso explicando la situación.
   */
  const setEnviarEmail = async (valorCorreo: string, valorToken: string) => {
    const response = await fetch("/api/enviarEmailPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: valorCorreo,
        token: valorToken,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        status: "success",
        tittle: "Correo enviado",
        detail: "Por favor revise su correo para continuar con el proceso."
      }
    } else {
      console.error("Error a la hora de enviar el correo: ", data.error);
      return {
        status: "error",
        tittle: "Error "+ data.error.responseCode,
        detail: "Error a la hora de enviar el correo."
      }
    }
  }

  /**
   * Método encargado de actualizar la contraseña utilizando una API.
   * @param id :Variable para identificar a que usuario actualizar contraseña.
   * @param password :Nueva contraseña ingresada por el usuario.
   * @returns retorna un mensaje de exito o fracaso dependiendo de la situación.
   */
  const setUpdatePassword = async (id: string, password: string) => {
    const response = await fetch(`${url}/updatePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        password: password,
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return {
        status: "success",
        tittle: "Contraseña actualizada.",
        detail: data.message
      }
    } else {
      return {
        status: "error",
        tittle: "Error al actualizar",
        detail: data.message
      }
    }
  }

  return {
    setUpdatePassword,
    getTokenPassword,
    setEnviarEmail,
  };
}
