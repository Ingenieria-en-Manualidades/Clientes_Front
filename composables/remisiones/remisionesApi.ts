import { useRuntimeConfig } from "nuxt/app";
import type { mensajeSencillo } from "../../interfaces/mensajes";
import type { Remision, RemisionPost, ApiPromise, PreviewRemision } from "../../interfaces/remisiones";

export const useRemisionesApi = () => {
  
  const config = useRuntimeConfig();
  const url = config.public.apiGroot;
  const token = config.public.tokenRemisiones;
  
  /**
   * Trae la información de la remisión presionada por el usuario desde la API de 'Groot' y la retorna a la modal.
   * @param numRemision: Número de la remisión que presiono el usuario, que se utiliza para buscar en BD. 
   * @returns una promesa que contiene un objeto con estos atributos { success: booleano, resimion: Array (información de la remisión), error: string}. 
   */
  const listarPreviewRemision = async (numRemision: string | undefined): Promise<ApiPromise<PreviewRemision[]>> => {
    try {
      const response = await fetch(`${url}/RemisionOnline/openPreViewRemision/${numRemision}`, {
        method: 'GET'
      });

      const previewRemision = await response.json();
      const data: PreviewRemision[] = previewRemision.data;

      return { success: true, data: data }
    } catch (error) {
      console.error("Error a la hora de realizar el listarPreviewRemision: ", error);
      return { success: false, error: error};
    }
  }

  /**
   * Trae todas las remisiones de un mismo cliente basandose en su id desde la API de 'Groot' y la retorna a la página.
   * @param idCliente: referencia y dato unico para identificar un cliente.
   * @returns una promesa que contiene un objeto con estos atributos { success: booleano, resimion: Array de remisiones del cliente, error: string}. 
   */
  const listarRemisionesPorId = async (idCliente: string | null | undefined): Promise<ApiPromise<Remision[]>>  => {
    
    try {
      //Llamamos al endpoint "ListarRemisionesAPI" devolviendonos la lista de remisiones en base a una ID.
      const response = await fetch(`${url}/api/RemisionOnline/ListarRemisionesAPI/${idCliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
      
      //Guardamos los resultados de la API en una variable con la interfaz de las remisiones 'Remision[]'.
      // La intefaz es necesaria ya que Vue es incapaz de identifcar los valores traidos de la API.
      const remisiones = await response.json();
      const data: Remision[] = remisiones.data;
      
      return { success: true, data: data};
    } catch (error) {
      console.error("Error a la hora de llamar al endpoint 'ListarRemisiones':", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Realiza un 'POST' que realiza el método de 'Groot' para hacer una inserción en la tabla 'remision_conciliacionxcliente' con la remisión presionada por el usuario.
   * @param remision :Objeto que contiene toda la información para registrar una remisión.
   * @param numRemision :Número de la remisión para usarlo en el mensaje a la hora de guardar.
   * @returns retorna un objeto tipo 'mensaje sencillo' con la información necesaria para enviar un aviso.
   */
  const agregarRemision = async (remision: RemisionPost, numRemision: string | undefined): Promise<mensajeSencillo> => {
    try{
      const response = await fetch(`${url}/api/RemisionOnline/saveGestionRemisionClienteAPI`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
        body: JSON.stringify(remision),
      });
      const data = await response.json();
      
      let mensaje: mensajeSencillo = {
        status: 'success',
        tittle: `Remisión N° ${numRemision} ${remision.accion}`,
        detail: `${data.msg}.`,
      }
      
      if (data.status === 'error') {
        mensaje.status = data.status;
        mensaje.tittle = `Error con la remisión N° ${numRemision}`;
        return mensaje;
      }

      if (remision.accion !== 'Aprobado') {
        mensaje.status = 'info';
        return mensaje;
      }

      return mensaje;
    }catch(error){
      console.error('Error a la hora de "agregarRemision": '+ error);
      return { status: 'error', tittle: 'Error al gestionar', detail: 'Por favor revisar el error.' };
    }
  }

  /**
   * Método que trae todas las remisiones relacionadas con el cliente, separa las remisiones tipo 'Pendiente' para retornar la cantidad de remisiones existentes en la BD.
   * @param idCliente :Numero que ayuda a identificar al cliente.
   * @returns retorna la cantidad de remisiones tipo 'Pendiente' del cliente especificado.
   */
  const getNumRemisionesPen = async (cliente: string | null | undefined ) => {
    try {
      //Llamamos al endpoint "ListarRemisionesAPI" devolviendonos la lista de remisiones en base a una ID.
      const response = await fetch(`${url}/api/RemisionOnline/ListarRemisionesAPI/${cliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      const remisiones = await response.json();
      const data: Remision[] = remisiones.data;
      console.log("remisiones data:", data);
      
      const remisionesPendientes: Remision[] = data.filter(
        (rem) => rem.estado === null
      );
      
      return remisionesPendientes.length.toString();
    } catch (error) {
      console.error("Error a la hora de llamar al endpoint 'númeroRemisiones':", error.message);
    }
  }

  return {
    listarRemisionesPorId,
    agregarRemision,
    listarPreviewRemision,
    getNumRemisionesPen
  };
}
