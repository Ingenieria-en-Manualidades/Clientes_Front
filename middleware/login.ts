import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async(to, from) => {
    const response = await fetch("/api/getCookies", {
        method: "GET",
      });
    
    const json = await response.json();
    
    if (!json.cookieToken) {
        return navigateTo('/');
    }
})
