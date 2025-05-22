import { RefSymbol } from "@vue/reactivity";
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
  
    const emailRegex = /^[^@]+@[^@]+$/;
    if (!emailRegex.test(email)) {
      return {
        status: "warn",
        tittle: "Mala diligenciación.",
        detail: "El correo debe tener un '@' y caracteres a la izquierda y derecha del mismo.",
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

    const resultado = await response.json();
    
    if (resultado.success) {
      return { status: true, id_username: resultado.id_username };
    } else {
      return {
        status: false,
        title: resultado.title,
        detail: resultado.message
      };
    }
  }

  const verificarLogin = async () => {
    try {
      const token = useCookie("token");
      
      // Llamamos al token del usuario y verificamos su existencia.
      if (!token.value) {
        const resultCookie = await fetch('api/deleteCookiesRem', {
          method: 'DELETE',
        });
        token.value = "undefined";

        if (!resultCookie) {
          console.error("Error a la hora de eliminar cookies.");
        }
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
