export default defineEventHandler(async (event) => {
  const cookieOptions = { path: '/' } as const;

  deleteCookie(event, "token", cookieOptions);
  deleteCookie(event, "numRem", cookieOptions);
  deleteCookie(event, 'usuario', cookieOptions);
  deleteCookie(event, 'clients', cookieOptions);
  deleteCookie(event, "idCliente", cookieOptions);
  deleteCookie(event, 'nameClient', cookieOptions);
  deleteCookie(event, "permissions", cookieOptions);
  return true;
})
