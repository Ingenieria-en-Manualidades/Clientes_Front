// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
    // Se toma las variables que se envian desde un fetch.
    const { token, idCliente, usuario } = await readBody(event);

    // Creamos las cookies con el método nuxt 'setCookie'.
    setCookie(event, 'token', token, {
        sameSite: 'none',
        httpOnly: true,
        secure: true
    });
    setCookie(event, 'idCliente', idCliente, {
        sameSite: 'none',
        httpOnly: true,
        secure: true
    });
    setCookie(event, 'usuario', usuario, {
        sameSite: 'none',
        httpOnly: true,
        secure: true
    });

    return true;
})
