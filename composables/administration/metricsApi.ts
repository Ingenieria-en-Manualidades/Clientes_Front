import { useRuntimeConfig } from 'nuxt/app';
import type { ApiPromiseStandard } from '../../interfaces/objetives';
import { useAdministrationAuthHeaders } from './authHeaders';

export const useMetricsApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  const { headers } = useAdministrationAuthHeaders();

  const getMetricsDashboard = async (days = 30): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/metrics/dashboard?days=${days}`, {
        method: 'get',
        headers: headers(),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: '', message: '', data: data.data };
      }

      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error('Error al consultar las métricas: ', error);
      return { success: false, title: 'Error desconocido.', message: 'Por favor verificar la consola del navegador.' };
    }
  };

  return { getMetricsDashboard };
};
