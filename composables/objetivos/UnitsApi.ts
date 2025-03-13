import { useRuntimeConfig } from 'nuxt/app';
import { Units, ApiPromiseStandard } from "../../interfaces/objetives";

export const useUnitsApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const createMetaUnidades = async (objUnits: Units):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createMetaUnidades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objUnits)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de guardar las unidades metas: ",data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de agregar la unidades mensuales: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  return {
    createMetaUnidades
  }
}
