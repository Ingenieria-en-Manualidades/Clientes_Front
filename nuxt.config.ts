import {defineNuxtConfig} from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  plugins: [
    '~/plugins/vueuse.ts'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    'nuxt-primevue'
  ],

  primevue: {
    options: {
      unstyled: true
    },
    importPT: { as: 'Aura', from: '~/presets/aura' }
  },
  nitro: {
    preset: 'node-server', // <<<< AÑADIR ESTO
  },

  runtimeConfig: {
    //URL del backend del modulo clientes
    public: {
      apiBackendCliente: process.env.GLOBAL_URL_SERVER,
      apiGroot: process.env.GLOBAL_URL_SERVER_GROOT,
      tokenRemisiones: process.env.KEY_REFERRALS_URL_SERVER,
      cookieOptions: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  compatibilityDate: '2024-09-28',
});