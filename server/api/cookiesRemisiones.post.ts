// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
    // Se toma las variables que se envian desde un fetch.
    const { token, clients, usuario, permissions } = await readBody(event);
    
    // Creamos las cookies con el método nuxt 'setCookie'.
    setCookie(event, 'token', token, {
        sameSite: 'none',
        secure: true
    });
    setCookie(event, 'clients', clients, {
        sameSite: 'none',
        secure: true
    });
    setCookie(event, 'usuario', usuario, {
        sameSite: 'none',
        secure: true
    });
    setCookie(event, 'permissions', permissions, {
        sameSite: 'none',
        secure: true
    });

    return true;
})
