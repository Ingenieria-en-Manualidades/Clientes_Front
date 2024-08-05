import { useValidarEmail } from "~/composables/login/validaciones";

export default defineNuxtRouteMiddleware((to, from) => {
    const { verificarToken } = useValidarEmail();
    const tokenPassword = useRoute().params.token;

    const agregarVerificacion = async () => {
        const verificacion = await verificarToken(tokenPassword);

        if (!verificacion.success) {
            return navigateTo('/');
        }
    }

    agregarVerificacion();
})
