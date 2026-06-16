// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
  // Se toma las variables que se envian desde un fetch.
  const { idCliente, nameClient } = await readBody(event);
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
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
