import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { verificarLogin } = useValidaciones();
   
       const resultado = await verificarLogin();
   
       if (!resultado) {
           return navigateTo("/login");
       }
})