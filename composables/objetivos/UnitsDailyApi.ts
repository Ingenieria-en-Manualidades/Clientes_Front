import { useRuntimeConfig } from 'nuxt/app';
import type { UnitsDaily, ApiPromiseStandard } from "../../interfaces/objetives";

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

  const listUnidadesDiarias = async (meta_unidades_id: Number | null | undefined):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getListUnidadesDiarias/${meta_unidades_id}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de listar las unidades diarias: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de listar las unidades diarias: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const getUnidadesDiariasID = async (unidades_diaria_id: String | null | undefined):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getUnidadesDiariaID/${unidades_diaria_id}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: "", message: "", data: data.meta_unidades};
      } else {
        if (data.error) console.error("Error a la hora de llamar a las unidades diaria: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de llamar a las unidades diaria: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const updateUnidadesDiarias = async (objUnits: UnitsDaily, unidades_diarias_id: String | null):Promise<ApiPromiseStandard<any>> => {
      try {
        const response = await fetch(`${url}api/updateUnidadesDiarias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            valor: objUnits.valor,
            usuario: objUnits.usuario,
            unidades_diarias_id: unidades_diarias_id,
          })
        });
  
        const data = await response.json();
        
        if (response.ok) {
          return {success: true, title: data.title, message: data.message};
        } else {
          if (data.error) console.error("Error a la hora de actualizar las unidades diarias: ", data.error);
          return {success: false, title: data.title, message: data.message};
        }
      } catch (error) {
        console.error("Error dentro del catch a la hora de actualizar las unidades diarias: ", error);
        return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
      }
    }

  return {
    createUnidadesDiarias,
    listUnidadesDiarias,
    updateUnidadesDiarias,
    getUnidadesDiariasID
  }
}
