export default defineEventHandler(async (event) => {
  deleteCookie(event, "token");
  deleteCookie(event, "numRem");
  deleteCookie(event, 'usuario');
  deleteCookie(event, 'clients');
  deleteCookie(event, "idCliente");
  deleteCookie(event, 'nameClient');
  deleteCookie(event, "permissions");
  return true;
})
