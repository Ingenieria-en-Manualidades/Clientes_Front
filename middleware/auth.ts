import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { verificarLogin } = useValidaciones();
    const clientID = useCookie("idCliente");
    const clientName = useCookie("nameClient");
    const resultado = await verificarLogin();

    if (resultado.success && to.meta.requiresAuth) {
        if (!resultado.data.success) {
            return navigateTo("/login");
        }

        // Verify that the user has a client selected.
        if (!clientID.value || !clientName.value) {
            return navigateTo("/chooseClients");
        }
    } else {
        return navigateTo("/login");
    }
})