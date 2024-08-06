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

  const verificarToken = async (tokenPassword: string | string[]) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/verificarToken/${tokenPassword}`, {
        method: 'GET'
      });

      const resultado = await response.json();

      return resultado;
    } catch (error) {
        console.error("Error a la hora de verificar el token: ", error);
    }
  }

  return {
    validarEmail,
    verificarToken
  }
}
