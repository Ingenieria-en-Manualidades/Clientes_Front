import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { verificarLogin } = useValidaciones();
    const resultado = await verificarLogin();
    // Obtener solo la parte de fecha de today (sin hora)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (resultado.success) {
        if (!resultado.data.success) {
            return navigateTo("/login");
        }
        // Convertir reset_password a Date para comparar correctamente solo la fecha
        const resetPasswordDate = new Date(resultado.data.reset_password + "T00:00:00");

        if (resetPasswordDate <= today) {
            return navigateTo("/resetPasswordExpiration");
        }
    } else {
        return navigateTo("/login");
    }
})
