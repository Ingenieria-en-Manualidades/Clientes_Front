import { useRuntimeConfig } from 'nuxt/app';
import type { Units, ApiPromiseStandard, Area } from "../../interfaces/objetives";

export const useUnitsApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  const urlGroot = config.public.apiGroot;

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

  const listMetaUnidades = async (cliente_endpoint_id: Number | null | undefined, areasGroot: Area[]):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getListUnidadesMeta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          arraysAreas: areasGroot,
          cliente_endpoint_id: cliente_endpoint_id,
        })
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

  const getMetaUnidades = async (meta_unidades_id: Number | null | undefined):Promise<ApiPromiseStandard<any>> => {
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor: objUnits.valor,
          usuario: objUnits.usuario,
          meta_unidades_id: meta_unidades_id,
          motivo_actualizacion: objUnits.motivo_actualizacion,
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

  const getAreasImec = async (clienteID: String | null | undefined):Promise<ApiPromiseStandard<Area[]>> => {
    try {
      const response = await fetch(`${urlGroot}/api/area/listarCliente/${clienteID}`, {
        method: 'GET',
      });

      const data: Area[] = await response.json();

      if (response.ok) {
        return {success: true, title:"", message: "", data: data};
      } else {
        console.error("Error dentro de la api al traer las areas.");
        return {success: false, title:"Error al cargar las areas.", message: "Por favor recargar la página.",};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de traer las areas: ", error);
      return {success: false, title:"Error al cargar las areas.", message: "Por favor recargar la página.",};
    }
  }
  
  //El método hace que las fechas dadas por el usuario esten con el formato correcto para filtrar.
  const getFechas = (fecha1: Date, fecha2: Date | null) => {
    const fechas: String[] = [];

    if (fecha1.getMonth() + 1 > 0 && fecha1.getMonth() + 1 < 10) {
      fechas.push(`${fecha1.getFullYear()}-0${fecha1.getMonth() + 1}`);
    }else{
      fechas.push(`${fecha1.getFullYear()}-${fecha1.getMonth() + 1}`);
    }

    if (fecha2 !== null) {
      if (fecha2.getMonth() + 1 > 0 && fecha2.getMonth() + 1 < 10) {
        fechas.push(`${fecha2.getFullYear()}-0${fecha2.getMonth() + 1}`);
      }else{
        fechas.push(`${fecha2.getFullYear()}-${fecha2.getMonth() + 1}`);
      }
    }

    return fechas;
  }

  return {
    getFechas,
    getAreasImec,
    getMetaUnidades,
    listMetaUnidades,
    updateMetaUnidades,
    createMetaUnidades,
  }
}
