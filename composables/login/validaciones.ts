export const useValidarEmail = () => {
  const validarEmail = (email: string) => {
    if (!email) {
      return {
        success: false,
        status: "error",
        tittle: "Correo vacío.",
        detail: "Por favor ingresar el correo.",
      };
    }
  
    // if (email.indexOf("@") === -1) {
    //   return {
    //     status: "warn",
    //     tittle: "Mala diligenciación.",
    //     detail: "El correo debe tener un '@' como minimo.",
    //   };
    // }
  
    return { success: true};
  };

  return {
    validarEmail
  }
}
