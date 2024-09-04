import { ref } from "vue";
import type { mensajeSencillo } from "~/interfaces/mensajes";
import type { Remision, RemisionPost, ApiPromise, PreviewRemision } from "~/interfaces/remisiones";

const urlApi = "https://imecplusdev.ienm.com.co:8443";

export const useRemisionesApi = () => {
  const token = "3nmfgfsds#22dsff343fr";

  /**
   * Trae la información de la remisión presionada por el usuario desde la API de 'Groot' y la retorna a la modal.
   * @param numRemision: Número de la remisión que presiono el usuario, que se utiliza para buscar en BD. 
   * @returns una promesa que contiene un objeto con estos atributos { success: booleano, resimion: Array (información de la remisión), error: string}. 
   */
  const listarPreviewRemision = async (numRemision: string | undefined): Promise<ApiPromise<PreviewRemision[]>> => {
    try {
      const response = await fetch(`${urlApi}/RemisionOnline/openPreViewRemision/${numRemision}`, {
        method: 'GET'
      });

      const previewRemision: PreviewRemision[] = await response.json();

      return { success: true, remisiones: previewRemision.data }
    } catch (error) {
      console.error("Error a la hora de realizar el listarPreviewRemision: ", error);
      return { success: false, error: error.message};
    }
  }

  /**
   * Trae todas las remisiones de un mismo cliente basandose en su id desde la API de 'Groot' y la retorna a la página.
   * @param idCliente: referencia y dato unico para identificar un cliente.
   * @returns una promesa que contiene un objeto con estos atributos { success: booleano, resimion: Array de remisiones del cliente, error: string}. 
   */
  const listarRemisionesPorId = async (idCliente: string | null): Promise<ApiPromise<Remision[]>>  => {
    console.log("idCliente listar: ", idCliente);
    
    try {
      //Llamamos al endpoint "ListarRemisionesAPI" devolviendonos la lista de remisiones en base a una ID.
      const response = await fetch(`${urlApi}/api/RemisionOnline/ListarRemisionesAPI/${idCliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });
      
      //Guardamos los resultados de la API en una variable con la interfaz de las remisiones 'Remision[]'.
      // La intefaz es necesaria ya que Vue es incapaz de identifcar los valores traidos de la API.
      const remisiones: Remision[] = await response.json();
      console.log("remisiones arreglo: ", remisiones.data);
      
      return { success: true, remisiones: remisiones.data};
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
  const agregarRemision = async (remision: RemisionPost, numRemision: string | undefined) => {
    try{
      const response = await fetch(`${urlApi}/api/RemisionOnline/saveGestionRemisionClienteAPI`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remision),
      });
      const data = await response.json();
      let mensaje = ref<mensajeSencillo>({ 
        status: 'success',
        tittle: `Remisión N° ${numRemision} ${remision.accion}`,
        detail: `${data.msg}.`,
      });
      
      if (data.status === 'error') {
        mensaje.value.status = data.status;
        mensaje.value.tittle = `Error con la remisión N° ${numRemision}`;
        mensaje.value.detail = `${data.msg}.`;
        return mensaje;
      }

      if (remision.accion !== 'Aprobado') {
        mensaje.value.status = 'info';
        mensaje.value.tittle = `Remisión N° ${numRemision} ${remision.accion}`;
        mensaje.value.detail = `${data.msg}.`;
        return mensaje;
      }

      return mensaje;
    }catch(error){
      console.error('Error a la hora de "agregarRemision": '+ error);
      return error;
    }
  }

  /**
   * Método que trae todas las remisiones relacionadas con el cliente, separa las remisiones tipo 'Pendiente' para retornar la cantidad de remisiones existentes en la BD.
   * @param idCliente :Numero que ayuda a identificar al cliente.
   * @returns retorna la cantidad de remisiones tipo 'Pendiente' del cliente especificado.
   */
  const getNumRemisionesPen = async (idCliente: string | null | undefined) => {
    try {
      //Llamamos al endpoint "ListarRemisionesAPI" devolviendonos la lista de remisiones en base a una ID.
      const response = await fetch(`${urlApi}/api/RemisionOnline/ListarRemisionesAPI/${idCliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      const remisiones: Remision[] = await response.json();
      console.log("remisiones json:", remisiones);
      
      const remisionesPendientes: Remision[] = remisiones.data.filter(
        (rem) => rem.estado === null
      );
      return remisionesPendientes.length;
    } catch (error) {
      console.error("Error a la hora de llamar al endpoint 'númeroRemisiones':", error.message);
      return "error getNumRemisionesPen";
    }
  }

  return {
    listarRemisionesPorId,
    agregarRemision,
    listarPreviewRemision,
    getNumRemisionesPen
  };
}
