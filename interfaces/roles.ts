import type { OptionDropdown } from "./componentesDinamicos";

export interface RoleForm {
  name: string;
  permissions: string[];
}

export interface RolePermission {
  id: number;
  name: string;
}

export interface RoleTable {
  id: number;
  name: string;
  permissions: RolePermission[];
  permissions_count: number;
  permissions_label: string;
}

export interface RoleOptionsLists {
  permissions: OptionDropdown[];
}
