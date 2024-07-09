import { defineNuxtPlugin } from '#app'
import { useCookies } from '@vueuse/integrations/useCookies'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('useCookies', useCookies)
})