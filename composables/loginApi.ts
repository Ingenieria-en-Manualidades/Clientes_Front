import { useCookie, useRuntimeConfig } from "nuxt/app";
import { encryptData } from "./login/EncryptedData";
import { ApiPromiseStandard } from "../interfaces/objetives";

export const loginApi = () => {

  const config = useRuntimeConfig();

  const url = config.public.apiBackendCliente;
    /**
   * Verifica dentro de la BD si el usuario existe y si es el caso crea tres cookies (idCliente, token y nombredDeUsuario) para que la página funcione y duran lo que dure la sesión.
   * Metodo importado en el componente 'LoginForm'.
   * @param userData: Objeto con los atributos para verficar a un usuario {nombreDeUsuario: string, password: string}.
   * @returns En caso de todo ir bien retorna un 'true' y en caso contrario un objeto para mostrar un mensaje de fallo y que tipo de fallo.
   */
  const login = async (userData: any) => {
    const encryptedData = encryptData([userData['username'], userData['password']]);
    try {
      //llamando al endpoint que verificara al usuario y nos devolvera el token.
      const resultado = await fetch(`${url}api/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( {encrypted_data:encryptedData} )
      });
      
      if (!resultado.ok) {
        const response = await resultado.json();
        console.log("RESPONSE: ", response);
        return {
          success: false,
          status: 'error',
          tittle: `Error ${resultado.status}`,
          detail: response.message
        };
      }

      const response = await resultado.json();
      let permisos = [];

      for (const p of response.permissions) {
          permisos.push(p.name);
      }
      
      //Llamamos a una endpoint dentro del proyecto que nos ayudara a guardar el token,la id del cliente y el nombre del usuario como una cookie.
      const restCookies = await fetch('api/cookiesRemisiones', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.access_token,
          clients: response.clientes_endpoint_ids,
          usuario: userData.username,
          permissions: permisos
        })
      });
      
      // Verificamos si hay un error con las cookies
      if (!restCookies) {
        throw "Error a la hora de crear las cookies";
      }

      if (response.clientes_endpoint_ids.length > 1) {
        return {success: true, skipChooseClient: false};
      } else {
        return {success: true, skipChooseClient: true, clientID: response.clientes_endpoint_ids};
      }
    } catch (error) {
      console.error(error);
      throw "Error desconocido a la hora de iniciar";
    }
  };

  /**
   * Verifica aun la existencia del token como cookie y si es el caso lo borra en la BD y borra las tres cookies para luego retornar el resultado del procedimiento.
   * Método importado en el componente 'MenuItems'.
   * @returns Objeto con los siguientes atributos {success: boolean (comprobar el resultado), tittle y mensaje: string (mensaje que da el contexto de la situación)}
   */
  const logout = async () => {
    try {
      const token = useCookie("token");
      
      // Llamamos al token del usuario y verificamos su existencia.
      if (!token.value) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Llamamos al endpoint "logout" del 'Modulo-Cliente Backend' dandole el token del usuario para borrarlo en la BD.
      const resultado = await fetch(`${url}api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
          },
      });

      const response = await resultado.json();
      
      // Borramos todas las cookies(token, idCliente y usuario) y retornamos mensaje exitoso del endpoint.
      const resultCookie = await fetch('api/deleteCookiesRem', {
        method: 'DELETE',
      });

      // Verificamos que borramos bien las cookies.
      if (!resultCookie) {
        throw "Error a la hora de borrar las cookies";
      }

      return {success: true, status: 'success', tittle: "Exito al cerrar sesión", mensaje: response.message};
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      return {success: false, status: 'error', tittle: "Fallo al cerrar sesión", mensaje: 'Por favor verificar fallo.'};
    }
  };

  /**
   * Método que retorna los clientes en base a sus id' s (hecho para seleccion de clientes).
   * @param arrayIds Lista de id' s de clientes a consultar.
   * @returns retorna en caso de error titulo y mensaje del error y en caso de acierto los clientes.
   */
  const getClientsByIds = async (arrayIds: Number[]):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getClientsByIds/${arrayIds}`, {
        method: 'GET',
      });

      const result = await response.json();

      if (response.ok) {
        return {success: true, title: "", message: "", data: result.data};
      } else {
        if (result.error) console.error("Error al listar los clientes por ids: ", result.error);
        return {success: false, title: result.title, message: result.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de listar los clientes por ids: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor recargar la página."}
    }
  }

  const chooseClient = async (clientID: Number, nameClient: String | null | undefined) => {
    try {
      const response = await fetch('api/cookieClienteid', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idCliente: clientID,
          nameClient: nameClient,
        })
      });

      if (response.ok) {
        return {success: true, title: "", message: ""};
      } else {
        return {success: false, title: "Error al elegir el cliente.", message: "Por favor recargar la página."};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de elegir al cliente: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor recargar la página."}
    }
  }
  //NO USAR
  // const getClientsByUserId = async ():Promise<ApiPromiseStandard<any>> => {
  //   try {
  //     const response = await fetch(`${url}api/getClientsByUserId`, {
  //       method: 'GET',
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       return {success: true, title: "", message: "", data: result.data};
  //     } else {
  //       if (result.error) console.error("Error al listar los clientes por usuario: ", result.error);
  //       return {success: false, title: result.title, message: result.message};
  //     }
  //   } catch (error) {
  //     console.error("Error dentro del catch a la hora de listar los clientes por usuario: ", error);
  //     return {success: false, title: "Error desconocido.", message: "Por favor recargar la página."}
  //   }
  // }

  return {
    login,
    logout,
    chooseClient,
    getClientsByIds,
    // getClientsByUserId
  };
};