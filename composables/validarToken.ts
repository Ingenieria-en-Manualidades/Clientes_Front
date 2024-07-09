export const useValidarToken = () => {
  const validarToken =async () => {
    const usuarioToken = localStorage.getItem('usuario-token');
    if (!usuarioToken) {
      throw new Error('Token no existente');
    }

    try {
      console.log("usuarioToken: "+ usuarioToken);
      
      const { data, error } = await useFetch('http://127.0.0.1:8000/api/logout', {
        headers: {
          Authorization: `Bearer ${usuarioToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      if (error.value) {
        throw new Error("Token inválido");
      }

      return data.value;
    } catch (error) {
      throw new Error("Error a la hora de validar el token");
    }
  };

  return {
    validarToken,
  };
};
