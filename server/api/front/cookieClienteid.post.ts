// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
  // Se toma las variables que se envian desde un fetch.
  const { idCliente, nameClient } = await readBody(event);
  const forwardedProto = getHeader(event, 'x-forwarded-proto') || '';
  const isHttps = getRequestURL(event).protocol === 'https:' || forwardedProto.split(',')[0]?.trim() === 'https';
  const cookieOptions = {
      sameSite: isHttps ? 'none' : 'lax',
      secure: isHttps,
      path: '/',
  } as const;
  
  // Creamos la cookie con el método nuxt 'setCookie'.
  setCookie(event, 'idCliente', idCliente, {
      ...cookieOptions,
  });

  setCookie(event, 'nameClient', nameClient, {
    ...cookieOptions,
  });
  
  return true;
})
