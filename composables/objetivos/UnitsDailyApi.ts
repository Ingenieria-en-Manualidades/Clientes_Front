import { useRuntimeConfig } from 'nuxt/app';
import { UnitsDaily, ApiPromiseStandard } from "../../interfaces/objetives";

export const useUnitsDailyApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const createUnidadesDiarias = async (objUnitsD: UnitsDaily):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createUnidadesDiarias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objUnitsD)
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de guardar las unidades diarias: ",data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de agregar las unidades diarias: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }
  return {
    createUnidadesDiarias,
  }
}
