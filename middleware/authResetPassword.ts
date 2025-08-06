import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { verificarLogin } = useValidaciones();
    const resultado = await verificarLogin();

    if (resultado.success) {
        if (!resultado.data.success) {
            return navigateTo("/login");
        }
        // Get the current date with zero hours.
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Convert reset_password to Date to correctly compare only the date.
        const resetPasswordDate = new Date(resultado.data.reset_password + "T00:00:00");

        if (resetPasswordDate > today) {
            return navigateTo("/chooseClients");
        }
    } else {
        return navigateTo("/login");
    }
})
