import { useCookie, useRuntimeConfig } from "nuxt/app";

export const useValidaciones = () => {
  /**
   * Método que funciona para verificar si el input fue llenado o si el correo esta bien diligenciado.
   * @param email : Correo del usuario al cual se va a verificar su diligenciamento.
   * @returns En caso de que el correo este bien diligenciado retorna un 'true' y en caso contrario retorna 'false' y el motivo del false en formato del mensaje.
   */
  const config = useRuntimeConfig();

  const url = config.public.apiBackendCliente;
  const validarEmail = (email: string) => {
    if (!email) {
      return {
        success: false,
        status: "error",
        tittle: "Correo vacío.",
        detail: "Por favor ingresar el correo.",
      };
    }
  
    if (!email.includes("@")) {
      return {
        status: "warn",
        tittle: "Mala diligenciación.",
        detail: "El correo debe tener un '@' como minimo.",
      };
    }
  
    return { success: true};
  };

  /**
   * Recibe el token de la URL para verificar si existe dentro de la BD y permitirle actualizar contraseña y en caso de no retornar al usuario al login.
   * @param tokenPassword :Token que recibe desde la URL a la hora de entrar.
   * @returns En caso de existir el token retorna un 'true' y la id del usuario para identificar al usuario a modificar y en caso contrario un 'false' y los motivos del porque.
   */
  const verificarToken = async (tokenPassword: string | string[]) => {
    
    const response = await fetch(`${url}api/verificarToken/${tokenPassword}`, {
      method: 'GET'
    });

    console.log("resultado verificar token: ", response);
    const resultado = await response.json();
    if (!resultado.success) {

      if (resultado.codigo === 404) {
        return {
          status: false,
          tittle: resultado.message,
          detail: "El link con el cual entro es incorrecto."
        };
      }

      if (resultado.codigo === 403) {
        return {
          status: false,
          tittle: resultado.message,
          detail: "Por favor repita el proceso de recuperar contraseña."
        };
      }

      if (resultado.codigo === 500) {
        return {
          status: false,
          tittle: resultado.message,
          detail: "Error del servidor a la hora de verificar el token."
        };
      }
    } else {
      return { status: true, id_username: resultado.id_username };
    }
  }

  const verificarLogin = async () => {
    try {
      const token = useCookie("token");
      
      // Llamamos al token del usuario y verificamos su existencia.
      if (!token.value) {
        return false;
      }else{
        // Llamamos al endpoint "logout" del 'Modulo-Cliente Backend' dandole el token del usuario para borrarlo en la BD.
        const response = await fetch(`${url}api/verificarTokenLogin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
            },
        });

        if (!response.ok) {
          console.error(`Error en la respuesta del servidor: ${response.status}`);
          return false;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const resultado = await response.json();
          return resultado.success;
        } else {
          return false;
        }
      }
    } catch (error) {
      console.error("Error a la hora de verificar el login: ", error);
      return false
    }
  }

  return {
    validarEmail,
    verificarToken,
    verificarLogin
  }
}
