import axios from "axios";
import type { mensajeSencillo } from "~/interfaces/mensajes";
import type { Remision, RemisionPost, ApiPromise } from "~/interfaces/remisiones";

const urlApi = "https://imecplusdev.ienm.com.co:8443/api";

export const useRemisionesApi = () => {
  const token = "3nmfgfsds#22dsff343fr";

  //Método que declaramos va a retornar una promesa con la estructura de la interfaz de remisiones.
  const listarRemisionesPorId = async (idCliente: string | null | undefined): Promise<ApiPromise<Remision[]>>  => {
    try {
      //Llamamos al endpoint "ListarRemisionesAPI" devolviendonos la lista de remisiones en base a una ID.
      const response = await fetch(`${urlApi}/RemisionOnline/ListarRemisionesAPI/${idCliente}`, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
        },
      });

      /**
       * Guardamos los resultados de la API en una variable con la interfaz de las remisiones 'Remision[]'.
       * La intefaz es necesaria ya que Vue es incapaz de identifcar los valores traidos de la API.
       */
      const remisiones: Remision[] = await response.json();
      return { success: true, remisiones: remisiones.data};
    } catch (error) {
      console.error("Error a la hora de llamar al endpoint 'ListarRemisiones':", error.message);
      return { success: false, error: error.message };
    }
  }

  const agregarRemision = async (remision: RemisionPost, numRemision: string | undefined) => {
    try{
      const response = await fetch(`${urlApi}/RemisionOnline/saveGestionRemisionClienteAPI`, {
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

  return {
    listarRemisionesPorId,
    agregarRemision,
  };
}
