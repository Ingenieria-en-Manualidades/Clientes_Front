import { useRuntimeConfig } from "nuxt/app";
import type { ApiPromiseStandard } from "../../interfaces/objetives";
import type { RoleForm } from "../../interfaces/roles";

export const useRolesApi = () => {
  const config = useRuntimeConfig();
  const url = config.public.apiBackendCliente;
  const tokenBackend = config.public.apiKeyBackend;

  const getListRoles = async (): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getAdminRoles`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBackend}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: "", message: "", data: data.data };
      }

      if (data.error) console.error("Error a la hora de retornar los roles: ", data.error);
      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los roles: ", error);
      return { success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador." };
    }
  };

  const setCreateRole = async (role: RoleForm): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/createRole`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBackend}`,
        },
        body: JSON.stringify(role),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: data.title, message: data.message };
      }

      if (data.error) console.error("Error a la hora de crear el rol: ", data.error);
      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error("Error dentro del catch a la hora de crear el rol: ", error);
      return { success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador." };
    }
  };

  const setUpdateRole = async (roleId: number | string, role: RoleForm): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/updateRole/${roleId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBackend}`,
        },
        body: JSON.stringify(role),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: data.title, message: data.message };
      }

      if (data.error) console.error("Error a la hora de actualizar el rol: ", data.error);
      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error("Error dentro del catch a la hora de actualizar el rol: ", error);
      return { success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador." };
    }
  };

  const getDisabledRoles = async (): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/getDisabledAdminRoles`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBackend}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: "", message: "", data: data.data };
      }

      if (data.error) console.error("Error a la hora de retornar los roles inhabilitados: ", data.error);
      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error("Error dentro del catch a la hora de retornar los roles inhabilitados: ", error);
      return { success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador." };
    }
  };

  const setDisableRole = async (roleId: number | string): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/disableRole/${roleId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBackend}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: data.title, message: data.message };
      }

      if (data.error) console.error("Error a la hora de inhabilitar el rol: ", data.error);
      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error("Error dentro del catch a la hora de inhabilitar el rol: ", error);
      return { success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador." };
    }
  };

  const setRestoreRole = async (roleId: number | string): Promise<ApiPromiseStandard<any>> => {
    try {
      const response = await fetch(`${url}api/restoreRole/${roleId}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBackend}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, title: data.title, message: data.message };
      }

      if (data.error) console.error("Error a la hora de habilitar el rol: ", data.error);
      return { success: false, title: data.title, message: data.message };
    } catch (error) {
      console.error("Error dentro del catch a la hora de habilitar el rol: ", error);
      return { success: false, title: "Error desconocido.", message: "Por favor verificar la consola del navegador." };
    }
  };

  return {
    getListRoles,
    getDisabledRoles,
    setCreateRole,
    setUpdateRole,
    setDisableRole,
    setRestoreRole,
  };
};
