import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";

export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("token");
    
    if (token.value) {
        return navigateTo('/remisiones');
    }
})
