export const useValidarEmail = () => {
  const validarEmail = (email: string | undefined) => {
    if (!email) {
      return {
        status: "error",
        tittle: "Correo vacío.",
        detail: "Por favor ingresar el correo.",
      };
    }
  
    if (email.indexOf("@") === -1) {
      return {
        status: "error",
        tittle: "Mala diligenciación.",
        detail: "El correo debe tener un '@' como minimo.",
      };
    }
  
    return {
      status: "success",
      tittle: "Proceso completo",
      detail: "Correo enviado correctamente.",
    };
  };

  return {
    validarEmail
  }
}
