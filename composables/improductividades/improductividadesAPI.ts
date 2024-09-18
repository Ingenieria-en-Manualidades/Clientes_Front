import { useRuntimeConfig } from "nuxt/app";
import type { ApiPromise } from "../../interfaces/remisiones";
import type { Improductividad } from "../../interfaces/improductividades";

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
  
  return {
    listarImproductividades
  }
}
