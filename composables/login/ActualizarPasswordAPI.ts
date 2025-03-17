import { createError, useRuntimeConfig } from "nuxt/app";

export const useActualizarPasswordAPI = () => {

  const config = useRuntimeConfig();

  const url = config.public.apiBackendCliente;
  /**
   * Método que se dedica a crear el token a un usuario para que pueda actualizar su contraseña, primero verificando si el correo existe y luego crearlo.
   * @param correo :Correo ingresado por el usuario.
   * @returns En caso de existir el correo dentro de la BD retorna el token y un booleano 'true', en caso contrario retorna un 'false' y el motivo del fallo.
   */
  const getTokenPassword = async (correo: string) => {
    try {
      const resultado = await fetch(`${url}api/generartoken`, {
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
    try {
      const response = await fetch(`${url}api/enviarEmailContraseña`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: valorCorreo,
          token: valorToken
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data.success) {
          return {status: "success", tittle: "Correo enviado.", detail: data.message};
        } else {
          console.error("Error a la hora de enviar el correo: ", data.message);
          return {status: "error", tittle: "Error al enviar Email", detail: data.message};
        }
      } else {
        console.error("Error a la hora de ejecutar la API: ", data.message);
        return {status: "error", tittle: "Error al enviar Email", detail: "Error desconocido al tratar de ejecutar."};
      }
    } catch (error) {
      console.error("Error a la hora de enviar el Email dentro del catch: ", error.message);
      return {status: "error", tittle: "Error al enviar Email", detail: "Error desconocido al ejecutar."};
    }
  }

  /**
   * Método encargado de actualizar la contraseña utilizando una API del Groot.
   * @param id :Variable para identificar a que usuario actualizar contraseña.
   * @param password :Nueva contraseña ingresada por el usuario.
   * @returns retorna un mensaje de exito o fracaso dependiendo de la situación.
   */
  const setUpdatePassword = async (id: string, password: string) => {
    const response = await fetch(`${url}api/updatePassword`, {
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

  const setDeleteToken = async (token: string) => {
    const response = await fetch(`${url}api/borrarToken/${token}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Error a la hora de borrar: ", data.message);
    }
  }

  return {
    setUpdatePassword,
    getTokenPassword,
    setEnviarEmail,
    setDeleteToken,
  };
}
