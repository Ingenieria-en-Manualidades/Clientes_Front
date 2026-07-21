import { useToast } from "primevue/usetoast";
import type { HeaderWithFilters } from "../../interfaces/filters";
import type { RoleForm, RoleOptionsLists, RoleTable } from "../../interfaces/roles";
import { useUsersApi } from "./usersApi";

export const useDataRoles = () => {
  const toast = useToast();
  const { getListPermissions } = useUsersApi();

  const headers: HeaderWithFilters[] = [
    { label: "ID", options: null },
    { label: "Nombre", options: null },
  ];

  const attributes = ["id", "name"];

  const loadList = async (visible: boolean): Promise<RoleOptionsLists> => {
    const options: RoleOptionsLists = { permissions: [] };

    if (!visible) return options;

    const responsePermissions = await getListPermissions();

    if (responsePermissions.success) {
      options.permissions = responsePermissions.data;
    } else {
      toast.add({ severity: "error", summary: responsePermissions.title, detail: responsePermissions.message, life: 5000 });
    }

    return options;
  };

  const setFixDataRoles = (data: any[]): RoleTable[] => {
    return data.map((role) => {
      const permissions = role.permissions ?? [];

      return {
        id: role.id,
        name: role.name,
        permissions,
        permissions_count: role.permissions_count ?? permissions.length,
        permissions_label: permissions.length ? permissions.map((permission) => permission.name).join(", ") : "Sin permisos",
      };
    });
  };

  const setReviewFields = (role: RoleForm): boolean[] => {
    const errors = [false];

    if (!role.name?.trim()) errors[0] = true;

    if (errors.includes(true)) {
      toast.add({ severity: "warn", summary: "Campos faltantes.", detail: "Revisa los campos que faltan.", life: 5000 });
    }

    return errors;
  };

  return {
    headers,
    attributes,
    loadList,
    setFixDataRoles,
    setReviewFields,
  };
};
