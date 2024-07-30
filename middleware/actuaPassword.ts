export default defineNuxtRouteMiddleware((to, from) => {
    const tokenPassword = useRoute().params.token;

    const verificarToken = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/verificarToken/${tokenPassword}`, {
                method: 'GET'
            });

            if (!(await response).ok) {
                throw new Error('Error en la respuesta del servidor.');
            }

            const resultado = (await response).json;

            return resultado;
        } catch (error) {
            console.log("error en mid actuaPa: ", error);
        }
    }

    verificarToken().then(success => {
        console.log("success", success);
    });

    if (tokenPassword !== '123') {
        
        return navigateTo('/');
    }
})
