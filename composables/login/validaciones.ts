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
    const response = await fetch(`http://127.0.0.1:8000/api/verificarToken/${tokenPassword}`, {
      method: 'GET'
    });

    const resultado = await response.json();
    console.log("resultado verficar", resultado);
    if (!resultado.success) {

      if (resultado.codigo === 404) {
        return {
          status: false,
          tittle: resultado.message,
          detail: "El link con el cual entro es incorrecto."
        };
      }

      if (resultado.codigo === 403) {
        // const aviso = await fetch(`http://127.0.0.1:8000/api/borrarToken/${tokenPassword}`, {
        //   method: 'GET'
        // });

        // const data = await aviso.json();

        return {
          status: false,
          tittle: "expitado",
          detail: "Por favor repita el proceso de recuperar contraseña."
        };
      }

      if (resultado.codigo === 500) {
        return {
          status: false,
          tittle: resultado.message,
          detail: "Error del servidor a la hora de verificar el token."
        };
      }
    } else {
      return { status: true, id_username: resultado.id_username };
    }
  }

  return {
    validarEmail,
    verificarToken
  }
}
