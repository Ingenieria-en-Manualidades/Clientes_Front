// Endpoint importado en el composable 'loginApi'.
export default defineEventHandler(async (event) => {
    
  // Se toma las variables que se envian desde un fetch.
  const { idCliente, nameClient } = await readBody(event);
  
  // Creamos la cookie con el método nuxt 'setCookie'.
  setCookie(event, 'idCliente', idCliente, {
      sameSite: 'none',
      secure: true,
      path: '/',
  });

  setCookie(event, 'nameClient', nameClient, {
    sameSite: 'none',
    secure: true,
    path: '/',
  });
  
  return true;
})
