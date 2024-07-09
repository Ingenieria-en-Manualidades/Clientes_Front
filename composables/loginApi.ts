import axios from "axios";
import { usarCookies } from "~/composables/cookies";

const url = 'http://127.0.0.1:8000/api';
const { token, setToken, setIDCliente, borrarDatos } = usarCookies()

export const loginApi = () => {
  const login = async (userData: any) => {
    try {
      //llamando al endpoint y devolviendo el token.
      const response = await axios.post(
        `${url}/login`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      //Guardamos el token en un localStorage y la id del cliente de manera local.
      setToken(response.data.access_token);
      setIDCliente(response.data.clientes_endpoint_ids[0]);
      return {success: true};
    } catch (error) {
      //Creación un objeto mensaje de error desconocido.
      let mensaje = {
        success: false,
        status: 'error',
        tittle: 'Error desconocido',
        detail: 'Error desconocido, por favor intenta de nuevo más tarde'
      };
      //Verifica si el error se debe a una mal ingreso de los valores.
      if (error.response && error.response.status === 422) {
        //Cambia el titulo y el detalle del error.
        mensaje.tittle = 'Error de verificación';
        mensaje.detail = 'Usuario o contraseña mal ingresados';
        return mensaje;
      }
      //Verifica si el error se debe a que el usuario esta inactivo.
      if (error.response && error.response.status === 403) {
        mensaje.status = 'warn'
        mensaje.tittle = 'Usuario inactivo';
        mensaje.detail = `${error.response.data.message}.`;
        return mensaje;
      }
      //Si el error no se debe a ninguno de ellos se enviara el de tipo desconocido
      return mensaje;
    }
  };

  const logout = async () => {
    try {
      //Llamamos al token del usuario y verificamos su existencia.
      if (!token.value) {
        throw new Error('No se encontró el token de autenticación');
      }

      //Llamamos al endpoint "logout" dandole el token del usuario para borrar el token.
      const response = await axios.post(
        `${url}/logout`, 
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      //Borramos el token, el id del cliente, el nombre de usuario y retornamos mensaje exitoso del endpoint.
      borrarDatos();

      return {success: true, tittle: "Exito al cerrar sesión",mensaje: response.data};
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  return {
    login,
    logout,
  };
};