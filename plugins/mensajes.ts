import ToastService from 'primevue/toastservice';
import { defineNuxtPlugin } from '../node_modules/nuxt/dist/app/nuxt';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ToastService);
})