import { useRuntimeConfig } from 'nuxt/app';
import { ApiPromise, UpdateArchivo, Archivo} from '../../interfaces/objetives';

export const useFilesApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  const updateFile = async (objArchivo: UpdateArchivo):Promise<ApiPromise<any>> => {
    try {
      const response = await fetch(`${url}api/deleteFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objArchivo)
      });

      const data = await response.json();

      if (response.ok) {
        const objFile = {
          archivo: objArchivo.archivo,
          cliente_endpoint_id: objArchivo.cliente_endpoint_id,
          tipo_formulario: objArchivo.tipo_formulario,
          tablero_sae_id: objArchivo.tablero_sae_id,
          year_file: objArchivo.year_file,
        };
        
        const responsive = await createFile(objFile);

        if (responsive.success) {
          return {success: responsive.success, data: responsive.data};
        } else {
          return { success: false, error: responsive.error || 'Error a la hora de insertar en "File"' };
        }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error("Error de catch en la eliminacion del archivo:", error);
      return { success: false, error: error }
    }
  }

  const createFile = async (objArchivo: Archivo): Promise<ApiPromise<any>> => {
      try {
        const formData = new FormData();
  
        formData.append('archivo', objArchivo.archivo);
        formData.append('cliente_endpoint_id', objArchivo.cliente_endpoint_id.toString());
        formData.append('tipo_formulario', objArchivo.tipo_formulario);
        formData.append('tablero_sae_id', objArchivo.tablero_sae_id.toString());
        formData.append('year_file', objArchivo.year_file);
  
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
        return { success: false, error: data.message }
      }
    }

  return {
    updateFile,
  }
}
