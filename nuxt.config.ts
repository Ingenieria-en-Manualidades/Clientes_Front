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

  ignore: [
    'pages/improductividades/aprobadas.vue',
    'pages/improductividades/index.vue',
    'pages/improductividades/principal.vue',
    'pages/improductividades/rechazadas.vue',
    'pages/improductividades_2/aprobadas.vue',
    'pages/improductividades_2/index.vue',
    'pages/improductividades_2/rechazadas.vue',
    'composables/improductividades/datosImproductividades.ts',
    'composables/improductividades/improductividadesAPI.ts'
  ],

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