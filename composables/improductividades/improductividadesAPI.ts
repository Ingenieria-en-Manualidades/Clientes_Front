import { useRuntimeConfig } from "nuxt/app";
import type { ApiPromise } from "../../interfaces/remisiones";
import type { Improductividad } from "../../interfaces/improductividades";
import type { postImproductividad } from "../../interfaces/improductividades";
import type { mensajeSencillo } from "../../interfaces/mensajes";

export const useImproductividadesAPI = () => {

  const config = useRuntimeConfig();
  const url = config.public.apiGroot;
  const token = config.public.tokenRemisiones;

  const listarImproductividades = async (idCliente: string | null | undefined): Promise<ApiPromise<Improductividad[]>> => {
    try {
      const response = await fetch(`${url}/api/MaquilaOnline/getListImprodAPI/${idCliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        }
      });

      const valueJSON = await response.json();
      const improductividades: Improductividad[] = valueJSON.data;

      return { success: true, data: improductividades }
    } catch (error) {
      console.error("Error a la hora de realizar el listarImproductividades");
      return { success: false, error: error }
    }
  }
  
  const agregarImproductividad = async (improductividad: postImproductividad): Promise<mensajeSencillo> => {
    try {
      const response = await fetch(`${url}/api/MaquilaOnlineController/saveGestionImprodAPI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(improductividad),
      });

      const resultado = await response.json();
      
      if (resultado.status === 'error') {
        console.error("resultado improductividades: ", resultado);
        return { status: resultado.status, tittle: 'Fallo en el gestionar', detail: resultado.msg };
      }
      
      return { status: resultado.status, tittle: 'Guardado', detail: resultado.msg };
    } catch (error) {
      console.error("Error a la hora de agregar improductividad: ", error);
      return { status: 'error', tittle: 'Error al gestionar', detail: 'Por favor revisar el error.' };
    }
  }

  return {
    listarImproductividades,
    agregarImproductividad
  }
}
