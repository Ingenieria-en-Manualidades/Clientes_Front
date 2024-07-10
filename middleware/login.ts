import { usarCookies } from "~/composables/cookies"

export default defineNuxtRouteMiddleware(async(to, from) => {
    const { token } = usarCookies();
    console.log("token");
    console.log(token);
    console.log(token.value);
    
    if (!token.value) {
        return navigateTo('/');
    }
})
