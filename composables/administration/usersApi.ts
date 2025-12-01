import { useRuntimeConfig } from 'nuxt/app';
import type { User } from "../../interfaces/users";
import type { ApiPromiseStandard } from "../../interfaces/objetives";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";

export const useUsersApi = () => {

  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  const tokenBackend = config.public.apiKeyBackend;

  /**
   * Method to obtain the list of permissions.
   * @returns arrays of permissions.
   */
  const getListPermissions = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getListPermissions`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        var permissions: Array<OptionDropdown> = [];

        data.data.forEach((element: { id: number; name: string; }) => {
          permissions.push({label: element.name, value: element.id});
        });

        return {success: true, title: "", message: "", data: permissions};
      } else {
        if (data.error) console.error("Error a la hora de retornar los permisos: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los permisos: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  const getListEmployees = async (client_id: number):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getEmployeesImec/${client_id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenBackend}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar los empleados: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los empleados: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  const setCreateUser = async (user: User):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createUser`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(user)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de crear el usuario: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de crear el usuario: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  const getListUsers = async () => {
    try {
      const response = await fetch(`${url}api/getUsers`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar los permisos: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los permisos: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  const setResetUser = async (user_id: string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/resetUser/${user_id}`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de resetear el usuario: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de resetear el usuario: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  return {
    getListPermissions,
    getListEmployees,
    setCreateUser,
    getListUsers,
    setResetUser,
  };
}
