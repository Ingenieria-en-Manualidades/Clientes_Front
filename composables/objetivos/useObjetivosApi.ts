import { useCookie, useRuntimeConfig } from 'nuxt/app';
import { Objetives, Calidad, Accidente, ApiPromise } from '../../interfaces/objetives';

export const useObjetivosApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const createObjetives = async (objetivosData: Objetives): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/guardarObjetivos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  const createCalidad = async (objCalidad: Calidad): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/guardarCalidad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objCalidad),
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, data: data};
      } else {
        return { success: false, error: data.message || 'Error a la hora de insertar en "Calidad"' }
      }
    } catch (error) {
      console.error("Error de catch en la inserción 'Calidad': ", error);
      return { success: false, error: error }
    }
  }

  const createAccidente = async (objAccidente: Accidente): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/guardarAccidente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objAccidente),
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, data: data};
      } else {
        console.error("Error a la hora de ingresar Accidente: ", data.message);
        
        return { success: false, error: data.message || 'Error a la hora de insertar en "Accidente"' }
      }
    } catch (error) {
      console.error("Error de catch en la inserción 'Accidente': ", error);
      return { success: false, error: error }
    }
  }

  return {
    createObjetives,
    createCalidad,
    createAccidente
  };
};
