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
        if (data.error) console.error("Error a la hora de guardar las unidades metas: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de agregar las unidades mensuales: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const listMetaUnidades = async (cliente_endpoint_id: String | null | undefined):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getListUnidadesMeta/${cliente_endpoint_id}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de listar las unidades metas: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de listar las unidades mensuales: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const getMetaUnidades = async (meta_unidades_id: String | null | undefined):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getMetaUnidades/${meta_unidades_id}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (response.ok) {
        return {success: true, title: "", message: "", data: data.meta_unidades};
      } else {
        if (data.error) console.error("Error a la hora de llamar a la unidades meta: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de llamar a la unidades meta: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const updateMetaUnidades = async (objUnits: Units, meta_unidades_id: String | null):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/updateMetaUnidades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: objUnits.valor,
          usuario: objUnits.usuario,
          meta_unidades_id: meta_unidades_id,
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de actualizar las unidades metas: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar las unidades mensuales: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }
  //no usar
  // const getMetaUnidades = async (today: Date, clientID: Number):Promise<ApiPromiseStandard<any>> => {
  //   try {
  //     console.log("today: ", today);
  //     console.log("client: ", clientID);
      
  //     const response = await fetch(`${url}api/metaUnidadesExists`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         fecha_meta: today,
  //         cliente_endpoint_id: clientID,
  //       })
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       return {success: true, title: data.title, message: data.message, data: data.exists};
  //     } else {
  //       if (data.error) console.error("Error a la hora de consultar las metas unidades.", data.error);
  //       return {success: false, title: data.title, message: data.message};
  //     }
  //   } catch (error) {
  //     console.error("Error dentro del catch a la hora de agregar las unidades diarias: ", error);
  //     return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
  //   }
  // }

  return {
    getMetaUnidades,
    listMetaUnidades,
    updateMetaUnidades,
    createMetaUnidades,
  }
}
