import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {

    if (to.meta.skipGlobalMiddleware) {
        return;
    }

    const { verificarLogin } = useValidaciones();

    const resultado = await verificarLogin();
    
// Si no está autenticado, redirigir a la página de login si no estamos ya allí.
if (!resultado && to.path !== "/") {
    return navigateTo("/");
}

// Si está autenticado y está intentando acceder a la página de login, redirigir a una ruta autorizada.
if (resultado && to.path === "/") {
    return navigateTo("/dashboard"); // Cambia a la ruta que quieras redirigir después del login.
}
});