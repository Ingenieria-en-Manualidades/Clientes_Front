import { useRuntimeConfig } from 'nuxt/app';
import type { ApiPromiseStandard } from "../../interfaces/objetives";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

export const useSurveyApis = () => {
  
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  /**
   * Method to obtain the list of charges.
   * @returns arrays of charges.
   */
  const getListCharges = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/listCharges`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        const charges: Array<OptionDropdown> = [];

        data.data.forEach((element: { charge_id: number; description: string; }) => {
          charges.push({label: element.description, value: element.charge_id});
        });

        return {success: true, title: "", message: "", data: charges};
      } else {
        if (data.error) console.error("Error a la hora de retornar los cargos: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los cargos: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  /**
   * Method to obtain the list of clients.
   * @returns arrays of clients.
   */
  const getListClients = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/listClients`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        const clients: Array<OptionDropdown> = [];

        data.data.forEach((element: { clients_id: number; name: string; }) => {
          clients.push({label: element.name, value: element.clients_id});
        });

        return {success: true, title: "", message: "", data: clients};
      } else {
        if (data.error) console.error("Error a la hora de retornar los clientes: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los clientes: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  return {
    getListCharges,
    getListClients
  }
}
