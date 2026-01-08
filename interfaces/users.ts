import type { OptionDropdown } from "../interfaces/componentesDinamicos";

export interface User {
    userType: string | null;
    employee_id: string | null;
    fullname: string | null;
    username: string | null;
    cellphone: string;
    email: string;
    password: string | null;
    password_confirmation: string | null;
    clients: string[] | null;
    rol: number | null;
    permissions: string[] | null;
    creator_user: string | null;
}

export interface optionsDropDownLists {
    clients: OptionDropdown[] | null;
    permissions: OptionDropdown[] | null;
    roles: OptionDropdown[] | null;
}

export interface optionsDropDownListsUserType {
    charges: OptionDropdown[] | null;
    employees: any[] | null;
}

export interface UserTable {
    id: string | null;
    num_document: string | null;
    fullname: string | null;
    username: string | null;
    user_type: string | null;
}