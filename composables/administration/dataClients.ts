import type { ClientSchemaTable, SurveyClientTable } from "../../interfaces/clients";
import type { HeaderWithFilters } from "../../interfaces/filters";

export const useDataClients = () => {

  const clientsSchemaHeaders: HeaderWithFilters[] = [
    {label: "ID", options: null},
    {label: "Nombre", options: null},
    {label: "ID Endpoint", options: null},
    {label: "Estado", options: null},
  ];

  const clientsSchemaAttributes = [
    "id",
    "nombre",
    "endpoint_id",
    "status",
  ];

  const surveyClientsHeaders: HeaderWithFilters[] = [
    {label: "Cliente ID", options: null},
    {label: "Nombre", options: null},
    {label: "Feed Value", options: null},
    {label: "Centro de Costo", options: null},
    {label: "Overtime", options: null},
    {label: "Ciudad ID", options: null},
  ];

  const surveyClientsAttributes = [
    "cliente_id",
    "name",
    "feed_value",
    "cost_center",
    "overtime",
    "city_id",
  ];

  const setFixClientsSchema = (data: any[]): ClientSchemaTable[] => {
    return data.map((element) => ({
      id: element.id ?? null,
      nombre: element.nombre ?? element.name ?? null,
      endpoint_id: element.cliente_endpoint_id ?? null,
      activo: element.activo ?? null,
      deleted_at: element.deleted_at ?? null,
      status: element.deleted_at ? "Deshabilitado" : element.activo === "n" ? "Inactivo" : "Activo",
    }));
  }

  const setFixSurveyClients = (data: any[]): SurveyClientTable[] => {
    return data.map((element) => ({
      cliente_id: element.cliente_id ?? element.clients_id ?? null,
      name: element.name ?? element.nombre ?? null,
      feed_value: element.feed_value ?? null,
      cost_center: element.cost_center ?? null,
      overtime: element.overtime ?? null,
      city_id: element.city_id ?? null,
    }));
  }

  return {
    clientsSchemaHeaders,
    clientsSchemaAttributes,
    surveyClientsHeaders,
    surveyClientsAttributes,
    setFixClientsSchema,
    setFixSurveyClients,
  };
}
