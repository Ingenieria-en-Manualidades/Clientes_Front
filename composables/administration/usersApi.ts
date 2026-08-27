import { useRuntimeConfig } from 'nuxt/app';
import type { User } from "../../interfaces/users";
import type { ApiPromiseStandard } from "../../interfaces/objetives";
import type { OptionDropdown } from "../../interfaces/componentesDinamicos";
import { useAdministrationAuthHeaders } from './authHeaders';

export const useUsersApi = () => {

  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  const { headers } = useAdministrationAuthHeaders();

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
        headers: headers()
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
        headers: headers(),
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

  const setUpdateUser = async (user_id: string, user: User):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/updateUser/${user_id}`, {
        method: 'put',
        headers: headers(),
        body: JSON.stringify(user)
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de actualizar el usuario: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar el usuario: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  // Method to obtain the list of users.
  const getListUsers = async () => {
    try {
      const response = await fetch(`${url}api/getUsers`, {
        method: 'get',
        headers: headers()
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

  // Method to obtain the list of roles.
  const getListRoles = async () => {
    try {
      const response = await fetch(`${url}api/getRoles`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        var roles: Array<OptionDropdown> = [];

        data.data.forEach((element: { id: number; name: string; permissions?: { id: number; name: string }[] }) => {
          roles.push({label: element.name, value: element.id, permissions: element.permissions ?? []});
        });
        return {success: true, title: "", message: "", data: roles};
      } else {
        if (data.error) console.error("Error a la hora de retornar los roles: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los roles: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  const setResetUser = async (user_id: string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/resetUser/${user_id}`, {
        method: 'get',
        headers: headers()
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

  const getDataUserId = async (userId: string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getDataUserId/${userId}`, {
        method: 'get',
        headers: headers()
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar la información de usuario: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar la información de usuario: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  /**
   * Method to obtain the list of clients.
   * @returns arrays of clients.
   */
  const getClients = async ():Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getClients`, {
        method: 'get',
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: "", message: "", data: data.data};
      } else {
        if (data.error) console.error("Error a la hora de retornar los clientes: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los clientes: ", error);
      return {success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador."}
    }
  }
  

  /**
   * Method to enable/disable a user.
   * @param user_id User ID to enable/disable.
   * @returns Request status message.
   */
  const setEnableDisabledUser = async (user_id: string):Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/setStatusUser/${user_id}`, {
        method: 'put',
        headers: headers(),
      });

      const data = await response.json();
      
      if (response.ok) {
        return {success: true, title: data.title, message: data.message};
      } else {
        if (data.error) console.error("Error a la hora de actualizar el usuario: ", data.error);
        return {success: false, title: data.title, message: data.message};
      }
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar el usuario: ", error);
      return {success: false, title: "Error desconocido.", message: error.message}
    }
  }

  return {
    getListPermissions,
    getListEmployees,
    setCreateUser,
    getListUsers,
    setResetUser,
    getListRoles,
    getDataUserId,
    getClients,
    setUpdateUser,
    setEnableDisabledUser
  };
}
