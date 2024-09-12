import { useRoute } from "vue-router";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useValidaciones } from "../composables/login/validaciones";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { verificarToken } = useValidaciones();
    const tokenPassword = useRoute().params.token;

    const resultado = await verificarToken(tokenPassword);

    if (!resultado?.status) {
        return navigateTo("/");
    }
})
