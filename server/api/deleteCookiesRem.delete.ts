export default defineEventHandler(async (event) => {
  deleteCookie(event, "token");
  deleteCookie(event, "idCliente");
  deleteCookie(event, 'usuario');
  deleteCookie(event, "numRem");
  return true;
})
