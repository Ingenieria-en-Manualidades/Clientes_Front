export default defineEventHandler(async (event) => {
  let idCliente = getCookie(event, 'idCliente');
  let token = getCookie(event, 'token');
  let usuario = getCookie(event, 'usuario');

  return { 
    cookieCliente: idCliente,
    cookieToken: token,
    cookieUsuario: usuario
  }
});
