import { useCookie, useRuntimeConfig } from 'nuxt/app';
import { Objetives } from '../../interfaces/objetives';
import { ApiPromise } from '../../interfaces/objetives';

export const useObjetivosApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  //const token = config.public.tokenRemisiones;

  const createObjetives = async (objetivosData: Objetives): Promise<ApiPromise<any>> => {
    try {
      const token = useCookie("token");
      const response = await fetch(`http://localhost:8000/api/guardarObjetivos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(objetivosData)
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data: data };
      } else {
        console.error('Error en la respuesta de la API:', data);
        return { success: false, error: data.message || 'Error en la creación de objetivos' };
      }
    } catch (error) {
      console.error("Error al realizar la creación de objetivos:", error);
      return { success: false, error: error };
    }
  };

  return {
    createObjetives,
  };
};
