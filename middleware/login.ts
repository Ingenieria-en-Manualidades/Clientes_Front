import { usarCookies } from "~/composables/cookies"

export default defineNuxtRouteMiddleware(async(to, from) => {
    const { token } = usarCookies();

    if (!token.value) {
        return navigateTo('/');
    }
})
