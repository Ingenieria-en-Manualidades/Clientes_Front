import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.meta.skipGlobalMiddleware) {
        return;
    }

    const { verificarLogin } = useValidaciones();

    const resultado = await verificarLogin();

    if (resultado.success) {
        if (resultado.data.success) {
            return navigateTo("/");
        }
    } else {
        console.error(resultado);
    }
})