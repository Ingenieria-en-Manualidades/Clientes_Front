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

      const contentType = response.headers.get('content-type') ?? '';
      const data = contentType.includes('application/json') ? await response.json() : null;

      if (response.ok) {
        return { success: true, title: '', message: '', data: data?.data };
      }

      return {
        success: false,
        title: data?.title ?? 'Error al consultar metricas.',
        message: data?.message ?? `El servidor respondio con estado ${response.status}.`,
      };
    } catch (error) {
      console.error('Error al consultar las métricas: ', error);
      return { success: false, title: 'Error desconocido.', message: 'Por favor verificar la consola del navegador.' };
    }
  };

  const getMonthlyMetrics = async (from: string, to: string): Promise<ApiPromiseStandard<any>> => {
    try {
      const params = new URLSearchParams({ from, to });
      const response = await fetch(`${url}api/metrics/monthly?${params.toString()}`, {
        method: 'get',
        headers: headers(),
      });

      const contentType = response.headers.get('content-type') ?? '';
      const data = contentType.includes('application/json') ? await response.json() : null;

      if (response.ok) {
        return { success: true, title: '', message: '', data: data?.data };
      }

      return {
        success: false,
        title: data?.title ?? 'Error al consultar metricas mensuales.',
        message: data?.message ?? `El servidor respondio con estado ${response.status}.`,
      };
    } catch (error) {
      console.error('Error al consultar las métricas mensuales: ', error);
      return { success: false, title: 'Error desconocido.', message: 'Por favor verificar la consola del navegador.' };
    }
  };

  return { getMetricsDashboard, getMonthlyMetrics };
};
