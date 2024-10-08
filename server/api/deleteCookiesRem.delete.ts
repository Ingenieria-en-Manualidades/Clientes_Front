export default defineEventHandler(async (event) => {
  deleteCookie(event, "token");
  deleteCookie(event, "numRem");
  deleteCookie(event, 'usuario');
  deleteCookie(event, "idCliente");
  deleteCookie(event, "permissions");
  return true;
})
