// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
    // Se toma las variables que se envian desde un fetch.
    const { token, clients, usuario, permissions } = await readBody(event);
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
    } as const;
    
    // Creamos las cookies con el método nuxt 'setCookie'.
    setCookie(event, 'token', token, {
        ...cookieOptions,
        maxAge: 10800,
    });
    setCookie(event, 'clients', clients, {
        ...cookieOptions,
    });
    setCookie(event, 'usuario', usuario, {
        ...cookieOptions,
    });
    setCookie(event, 'permissions', permissions, {
        ...cookieOptions,
    });

    return true;
})
