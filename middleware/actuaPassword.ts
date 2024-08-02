export default defineNuxtRouteMiddleware((to, from) => {
    const tokenPassword = useRoute().params.token;
    console.log("tokenPass", tokenPassword);
    
    const verificacion = Boolean;

    const verificarToken = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/verificarToken/${tokenPassword}`, {
                method: 'GET'
            });
            console.log("response: ", response);
            
            // if (!response.ok) {
            //     throw new Error('Error en la respuesta del servidor.');
            // }

            const resultado = await response.json();

            return resultado;
        } catch (error) {
            console.log("error en mid actuaPa: ", error);
        }
    }

    verificarToken().then(resultado => {
        console.log("success", resultado.success);
        verificacion = resultado.success;
    });

    if (tokenPassword !== '123') {
        
        return navigateTo('/');
    }
})
