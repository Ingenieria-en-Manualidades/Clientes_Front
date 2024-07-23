export default defineEventHandler(async (event) => {
    const { token, idCliente, usuario } = await readBody(event);
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

    return true;
})
