import { useRuntimeConfig } from 'nuxt/app';
import type { ClientSchemaForm, SurveyClientForm } from "../../interfaces/clients";
import type { ApiPromiseStandard } from "../../interfaces/objetives";

export const useClientsApi = () => {

  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  const tokenBackend = config.public.apiKeyBackend;

  const getClientsSchema = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getClients`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar los clientes: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los clientes: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const getSurveyClients = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/listClients`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title ?? "", message: data.message ?? "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar los clientes de encuestas: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los clientes de encuestas: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const getUsersByClient = async (client_id: number | string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getUsersByClient/${client_id}`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar usuarios por cliente: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar usuarios por cliente: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const getUsersBySurveyClient = async (client_id: number | string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getUsersBySurveyClient/${client_id}`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar usuarios por cliente de encuestas: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar usuarios por cliente de encuestas: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const setCreateClient = async (client: ClientSchemaForm):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createClient`, {
        method: 'post',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBackend}`
        },
        body: JSON.stringify(client)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de crear el cliente: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de crear el cliente: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const setSyncClients = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/syncClients`, {
        method: 'post',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBackend}`
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de sincronizar los clientes: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de sincronizar los clientes: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const setUpdateClient = async (client_id: number | string, client: ClientSchemaForm):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/updateClient/${client_id}`, {
        method: 'put',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBackend}`
        },
        body: JSON.stringify(client)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de actualizar el cliente: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar el cliente: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const setStatusClient = async (client_id: number | string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/setStatusClient/${client_id}`, {
        method: 'put',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBackend}`
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de actualizar el estado del cliente: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar el estado del cliente: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  const setUpdateSurveyClient = async (client_id: number | string, client: SurveyClientForm):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/updateSurveyClient/${client_id}`, {
        method: 'put',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBackend}`
        },
        body: JSON.stringify(client)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de actualizar el cliente de encuestas: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar el cliente de encuestas: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  return {
    getClientsSchema,
    getSurveyClients,
    getUsersByClient,
    getUsersBySurveyClient,
    setCreateClient,
    setSyncClients,
    setUpdateClient,
    setStatusClient,
    setUpdateSurveyClient,
  };
}
