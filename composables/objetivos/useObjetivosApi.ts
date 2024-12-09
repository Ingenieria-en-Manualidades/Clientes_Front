import { useCookie, useRuntimeConfig } from 'nuxt/app';
import { Meta, Calidad, Accidente, ApiPromise, Objetivos, Archivo } from '../../interfaces/objetives';

export const useObjetivosApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const createMeta = async (objetivosData: Meta): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/guardarMeta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objetivosData)
      });

      const data = await response.json();
      
      if (response.ok) {
        const resultado = await createTableroSae(data.meta_id, data.cliente_id);
        
        if (resultado.success) {
          return { success: resultado.success, data: resultado.data };
        } else {
          return { success: resultado.success, error: resultado.error };
        }
      } else {
        console.error('Error en la respuesta de la API:', data);
        return { success: false, error: data.message || 'Error en la creación de meta' };
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
        const objArchivo = {
          archivo: objCalidad.archivo,
          cliente_endpoint_id: objCalidad.cliente_endpoint_id,
          tipo_formulario: objCalidad.tipo_formulario,
          tablero_sae_id: data.tablero_sae_id,
        };

        const response = await createFile(objArchivo);

        if (response.success) {
          return {success: response.success, data: response.data};
        } else {
          return { success: false, error: response.error || 'Error a la hora de insertar en "File"' };
        }
      } else {
        return { success: false, error: data.message || 'Error a la hora de insertar en "Calidad"' };
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

  const createTableroSae = async (metaID: number, clienteID: number): Promise<ApiPromise<any>> => {
    try {
      const date = new Date();

      const response = await fetch(`${url}api/guardarTablero`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fecha: date,
          meta_id: metaID,
          cliente_id: clienteID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return {success: data.success, data: data.message};
      } else {
        return {success: false, error: data.message || "Error a la hora de crear el Tablero Sae"};
      }
    } catch (error) {
      console.error("Error en el catch a la hora de crear el Tablero Sae: ", error);
      return {success: false, error: "Error a la hora de crear el Tablero Sae"};
    }
  }

  const createObjetivos = async (objObjetivos: Objetivos): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/guardarObjetivos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objObjetivos),
      });

      const data = await response.json();

      if (response.ok) {
        return {success: data.success, data: data.message};
      } else {
        console.error("Error a la hora de ingresar la producción: ", data.message);
        return { success: false, error: data.message || 'Error a la hora de insertar en "Producción"' }
      }
    } catch (error) {
      console.error("Error de catch en la inserción 'Producción': ", error);
      return { success: false, error: data.messagge }
    }
  }

  const updateObjetivos = async (objObjetivos: Objetivos): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/actualizarObjetivos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objObjetivos),
      });

      const data = await response.json();

      if (response.ok) {
        return {success: data.success, data: data.message};
      } else {
        console.log("response: ", response);
        console.error("Error a la hora de actualizar la producción: ", data.message);
        return { success: false, error: data.message || 'Error a la hora de actualizar la "Producción"' }
      }
    } catch (error) {
      console.error("Error de catch en la inserción 'Objetivos': ", error);
      return { success: false, error: data.messagge }
    }
  }

  const createFile = async (objArchivo: Archivo): Promise<ApiPromise<any>> => {
    try {
      const formData = new FormData();

      formData.append('archivo', objArchivo.archivo);
      formData.append('cliente_endpoint_id', objArchivo.cliente_endpoint_id.toString());
      formData.append('tipo_formulario', objArchivo.tipo_formulario);
      formData.append('tablero_sae_id', objArchivo.tablero_sae_id.toString());

      const response = await fetch(`${url}api/guardarArchivo`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return {success: data.success, data: data};
      } else {
        console.log("error en la inserción 'File': ", data.message);
        return { success: false, error: data.messagge || 'Error a la hora de guardar el archivo' }
      }
    } catch (error) {
      console.error("Error de catch en la inserción 'File': ", error);
      return { success: false, error: data.messagge }
    }
  }

  const listarFiles = async (clienteID: number): Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/listarArchivos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({cliente_endpoint: clienteID}),
      });

      const data = await response.json();
      console.log("data archivos: ", data.archivos);
      

      if (response.ok) {
        return {success: data.success, data: data};
      } else {
        return {success: false, error: data.messagge || "Error a la hora de listar los archivos."};
      }
    } catch (error) {
      return {success: false, error: data.messagge || "Error en el catch a la hora de listar los archivos."};
    }
  }

  return {
    createMeta,
    createFile,
    listarFiles,
    createCalidad,
    createAccidente,
    createObjetivos,
    updateObjetivos
  };
};
