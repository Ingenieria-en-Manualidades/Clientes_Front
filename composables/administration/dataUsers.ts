import { useToast } from "primevue/usetoast";
import type { User, UserTable } from "../../interfaces/users";
import type { HeaderWithFilters } from "../../interfaces/filters";
import { useSurveyApis } from "../../composables/survey/surveyApis";
import { useUsersApi } from "../../composables/administration/usersApi";
import type { optionsDropDownLists, optionsDropDownListsUserType } from "../../interfaces/users";

export const useDataUsers = () => {
  const toast = useToast();
  const { getListClients } = useSurveyApis();
  const { getListPermissions, getListEmployees } = useUsersApi();

  // Carga las listas que importan 
  const loadList = async (visible: Boolean): Promise<optionsDropDownLists> => {
    let options: optionsDropDownLists = {clients: [], permissions: []};

    // If the dialogue is closed, clear everything
    if (!visible) {
      return options;
    }

    const [responseClients, responsePermissions] = await Promise.all([getListClients(), getListPermissions()]);

    if (responseClients.success) {
      options.clients = responseClients.data
      if (options.clients) options.clients.unshift({label: "TODAS", value: 0});
    } else {
      toast.add({ severity: "error", summary: responseClients.title, detail: responseClients.message, life: 5000 })
    }

    if (responsePermissions.success) options.permissions = responsePermissions.data
    else toast.add({ severity: "error", summary: responsePermissions.title, detail: responsePermissions.message, life: 5000 })
    
    return options;
  };

  // Load the lists that matter when changing the user type.
  const loadListByType = async (visible: Boolean, userType: string, client_id: number): Promise<optionsDropDownListsUserType> => {
    let options: optionsDropDownListsUserType = {charges: [], employees: []};

    // If the dialogue is closed, clear everything
    if (!visible) {
      return options;
    }

    // Cuando es EMPLEADO
    if (userType === "employee") {
      const responseEmployees = await getListEmployees(client_id);

      if (responseEmployees.success) {
        options.employees = responseEmployees.data;
      } else {
        options.employees = [];
        toast.add({severity: "error",summary: responseEmployees.title,detail: responseEmployees.message,life: 5000,});
      }
    } else {
      options.employees = [];
    }
    
    return options;
  };

  // Create the username based on the full name.
  const createUsername = (fullname: string) => {
    if (typeof fullname !== 'string') return '';

    // Quitar espacios extra
    const limpio = fullname.trim().replace(/\s+/g, ' ');
    const partes = limpio.split(' ');

    // Mínimo: 1 nombre + 2 apellidos
    if (partes.length < 3) return '';

    const segundoApellido = partes[partes.length - 1];
    const primerApellido  = partes[partes.length - 2];
    const nombres         = partes.slice(0, partes.length - 2);

    const primerNombre  = nombres[0];
    const segundoNombre = nombres[1] || null;

    const letraPrimerNombre = primerNombre.charAt(0);
    // If there is no middle name, use the first letter of the second surname.
    const letraSegundo = segundoNombre
      ? segundoNombre.charAt(0)
      : segundoApellido.charAt(0);

    let username = letraPrimerNombre + letraSegundo + primerApellido;

    username = username
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
      .replace(/ñ/gi, 'n')                              // ñ -> n
      .replace(/[^a-z0-9]/gi, '')                       // solo letras y números
      .toUpperCase();                                   // MAYÚSCULAS

    return username;
  }

  const setReviewFields = (user: User) => {
    const errors: boolean[] = [false,false,false,false,false,false,false,false];

    if (!user.fullname) errors[0] = true;
    if (!user.username) errors[1] = true;
    if (!user.cellphone) errors[2] = true;
    if (!user.email) errors[3] = true;
    if (!user.password) errors[4] = true;
    if (!user.password_confirmation) errors[5] = true;
    if (user.clients) errors[6] = user.clients.length === 0 ? true : false;
    else errors[6] = true;
    if (user.permissions) errors[7] = user.permissions.length === 0 ? true : false;
    else errors[7] = true;

    if (user.userType === "employee") {
      if (!user.employee_id) errors[8] = true;
    } else {
    }

    if (errors.includes(true)) {
      toast.add({severity: "warn",summary: "Campos Faltantes.", detail: "Revisa los campos que faltan.", life: 5000});
    }

    return errors;
  }

  const headers: HeaderWithFilters[] = [
    {label: "ID", options: null},
    {label: "nro documento", options: null},
    {label: "Nombre", options: null},
    {label: "Usuario", options: null},
    {label: "tipo de usuario", options: {atribute: 'user_type', labels: ['Empleado', 'Cliente']}}
  ];

  const attributes = [
    "id",
    "num_document",
    "fullname",
    "username",
    "user_type",
  ];

  const setFixDataUsers = (data: any[]): UserTable[] => {
    const users: UserTable[] = [];

    data.forEach((element) => {
      const user: UserTable = {
        id: element.id,
        num_document: element.num_document,
        fullname: null,
        username: element.name,
        user_type: null,
      }

      if (element.empleado_id !== null) {
        user.user_type = "Empleado";
        user.fullname = element.fullname;
      } else {
        user.user_type = "Cliente";
        user.fullname = element.fullname_client;
      }
      users.push(user);
    })

    return users;
  }

  return {
    loadList,
    loadListByType,
    createUsername,
    setReviewFields,
    headers,
    attributes,
    setFixDataUsers,
  };
}