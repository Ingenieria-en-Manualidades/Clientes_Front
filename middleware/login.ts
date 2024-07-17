import { usarCookies } from "~/composables/cookies"

export default defineNuxtRouteMiddleware(async(to, from) => {
    const { token } = usarCookies();
    
    console.log("yoooken", token.value);
    if (!token.value) {
        
        return navigateTo('/');
    }
})
