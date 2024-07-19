import { usarCookies } from "~/composables/cookies"

export default defineNuxtRouteMiddleware(async(to, from) => {
    const token = useCookie("token");
    
    console.log("login mid", token);
    
    if (!token) {
        return navigateTo('/');
    }
})
