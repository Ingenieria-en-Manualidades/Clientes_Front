import { useCookies } from '@vueuse/integrations/useCookies';
import { defineNuxtPlugin } from '../node_modules/nuxt/dist/app/nuxt';

export default defineNuxtPlugin((nuxtApp) => {
  // Create a cookies instance
  const cookies = useCookies();

  // Provide the cookies instance globally
  nuxtApp.provide('cookies', cookies);
});
