// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
    // Se toma las variables que se envian desde un fetch.
    const { token, idCliente, usuario, permissions } = await readBody(event);
    
    // Creamos las cookies con el método nuxt 'setCookie'.
    setCookie(event, 'token', token, {
        sameSite: 'none',
        secure: true
    });
    setCookie(event, 'idCliente', idCliente, {
        sameSite: 'none',
        secure: true
    });
    setCookie(event, 'usuario', usuario, {
        sameSite: 'none',
        secure: true
    });
    // const permissions = ['view_objetivos_diarios','view_objetivos_mensuales','view_objetivos','view_accidentes', 'view_remisiones', 'view_improductividades']

    setCookie(event, 'permissions', permissions, {
        sameSite: 'none',
        secure: true
    });

    return true;
})
