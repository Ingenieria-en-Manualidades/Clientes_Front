import { defineNuxtRouteMiddleware, navigateTo, useCookie } from "nuxt/app";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const token = useCookie("token");
    
    if (!token.value) {
        return navigateTo('/');
    }
})
