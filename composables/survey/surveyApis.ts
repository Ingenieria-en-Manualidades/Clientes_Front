import { useRuntimeConfig } from 'nuxt/app';
import type { ApiPromiseStandard } from '../../interfaces/objetives';

type PolicyStatus = {
  version: string;
  accepted: boolean;
};

type PolicyPayload = {
  version: string;
  format: 'markdown' | 'html';
  content: string;
};

type PolicyAccepted = {
  ok: boolean;
  version: string;
};

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
  };

  /**
   * Helper: consulta el estado y, si no está aceptada, trae la política.
   * Útil para flujos de “post-login”.
   * @returns {ApiPromiseStandard<{ status: PolicyStatus; policy?: PolicyPayload }>}
   */
  const checkPolicyAndFetch = async (): Promise<
    ApiPromiseStandard<{ status: PolicyStatus; policy?: PolicyPayload }>
  > => {
    const st = await getPolicyStatus();
    if (!st.success || !st.data) return st as any;

    if (!st.data.accepted) {
      const pol = await getPolicy();
      if (!pol.success || !pol.data) {
        return { success: false, title: pol.title, message: pol.message };
      }
      return { success: true, title: '', message: '', data: { status: st.data, policy: pol.data } };
    }

    return { success: true, title: '', message: '', data: { status: st.data } };
  };

  return {
    getPolicyStatus,
    getPolicy,
    acceptPolicy,
    checkPolicyAndFetch,
  };
};
