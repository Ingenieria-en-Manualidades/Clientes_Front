import { useValidaciones } from "../composables/login/validaciones";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip global middleware if specified
    if (to.meta.skipGlobalMiddleware) {
        return;
    }

    const { verificarLogin } = useValidaciones();

    // Attempt to verify login
    const resultado = await verificarLogin().catch(error => {
        console.error("Error verificando el login:", error);
        return false; // Handle errors gracefully
    });

    console.log('Resultado de verificación:', resultado);
    
    // Redirect logic based on authentication status
    if (!resultado && to.path !== "/") {
        return navigateTo("/"); // Redirect to login if not authenticated
    }

    if (resultado && to.path === "/") {
        return navigateTo("/remisiones"); // Redirect to authorized page if authenticated
    }
});
