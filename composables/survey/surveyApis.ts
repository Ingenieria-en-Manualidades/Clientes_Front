import { useRuntimeConfig } from 'nuxt/app';
import type { ApiPromiseStandard } from "../../interfaces/objetives";
import type { Survey, AnswerSurvey } from "../../interfaces/survey";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

export const usePolicy = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;

  /**
   * Obtiene el estado de aceptación de la política para el usuario autenticado.
   * @returns {ApiPromiseStandard<PolicyStatus>}
   */
  const getPolicyStatus = async (): Promise<ApiPromiseStandard<PolicyStatus>> => {
    try {
      const response = await fetch(`${url}api/policy/status`, { method: 'get' });
      const data = await response.json();

      if (response.ok) {
        const parsed: PolicyStatus = {
          version: data.version,
          accepted: !!data.accepted,
        };
        return { success: true, title: '', message: '', data: parsed };
      } else {
        if (data?.error) console.error('Error al obtener estado de política: ', data.error);
        return { success: false, title: data?.title, message: data?.message };
      }
    } catch (error) {
      console.error('Catch: error al obtener estado de política: ', error);
      return { success: false, title: 'Error desconocido.', message: 'Por favor verificar la consola del navegador.' };
    }
  };

  /**
   * Obtiene el contenido de la política (markdown o html) y su versión.
   * @returns {ApiPromiseStandard<PolicyPayload>}
   */
  const getPolicy = async (): Promise<ApiPromiseStandard<PolicyPayload>> => {
    try {
      const response = await fetch(`${url}api/policy`, { method: 'get' });
      const data = await response.json();

      if (response.ok) {
        const parsed: PolicyPayload = {
          version: data.version,
          format: data.format,
          content: data.content,
        };
        return { success: true, title: '', message: '', data: parsed };
      } else {
        if (data?.error) console.error('Error al obtener política: ', data.error);
        return { success: false, title: data?.title, message: data?.message };
      }
    } catch (error) {
      console.error('Catch: error al obtener política: ', error);
      return { success: false, title: 'Error desconocido.', message: 'Por favor verificar la consola del navegador.' };
    }
  };

  /**
   * Registra la aceptación de la política para el usuario autenticado.
   * @returns {ApiPromiseStandard<PolicyAccepted>}
   */
  const acceptPolicy = async (): Promise<ApiPromiseStandard<PolicyAccepted>> => {
    try {
      const response = await fetch(`${url}api/policy/accept`, { method: 'post' });
      const data = await response.json();

      if (response.ok) {
        const parsed: PolicyAccepted = {
          ok: !!data.ok,
          version: data.version,
        };
        return { success: true, title: '', message: '', data: parsed };
      } else {
        if (data?.error) console.error('Error al aceptar política: ', data.error);
        return { success: false, title: data?.title, message: data?.message };
      }
    } catch (error) {
      console.error('Catch: error al aceptar política: ', error);
      return { success: false, title: 'Error desconocido.', message: 'Por favor verificar la consola del navegador.' };
    }
  }

  const getInfoUser = async (username: string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getInformationUser/${username}`, {
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

  const setSaveSurvey = async (survey: Survey, answer: AnswerSurvey[]):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/saveSurvey`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          start_time: survey.start_time,
          fullname: survey.fullname,
          charge_id: survey.charge_id,
          clients_id: survey.clients_id,
          username: survey.username,
          answers: answer,
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de enviar la encuesta: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de enviar la encuesta: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }

  return {
    getListCharges,
    getListClients,
    setSaveSurvey,
    getInfoUser
  }
}
