import { usarCookies } from "~/composables/cookies"

export default defineNuxtRouteMiddleware((to, from) => {
    const { token } = usarCookies();
    console.log("logueado mid", token.value);
    
    if (token.value) {
        return navigateTo('/remisiones');
    }
})
