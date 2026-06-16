export interface ClientSchemaTable {
    id: number | string | null;
    nombre: string | null;
    endpoint_id: number | string | null;
    activo: string | null;
    deleted_at: string | null;
    status: string | null;
}

export interface ClientSchemaForm {
    nombre: string | null;
    cliente_endpoint_id: number | string | null;
}

export interface SurveyClientTable {
    cliente_id: number | string | null;
    name: string | null;
    feed_value: number | string | null;
    cost_center: string | null;
    overtime: string | null;
    city_id: number | string | null;
}

export interface SurveyClientForm {
    name: string | null;
    feed_value: number | string | null;
    cost_center: string | null;
    overtime: string | null;
    city_id: number | string | null;
}

export interface ClientUserTable {
    id: number | string | null;
    username: string | null;
    fullname: string | null;
    email: string | null;
    cellphone: string | null;
    status: string | null;
}
