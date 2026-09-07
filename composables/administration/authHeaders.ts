import { useCookie } from 'nuxt/app';

export const useAdministrationAuthHeaders = () => {
  const token = useCookie('token');
  const clientId = useCookie('idCliente');

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token.value}`,
    'X-Cliente-Id': String(clientId.value ?? ''),
  });

  return { headers };
};
