import { describe, expect, it } from "vitest";
import { useDataClients } from "../../../composables/administration/dataClients";

describe("useDataClients", () => {
  it("defines headers and attributes for clients schema table", () => {
    const { clientsSchemaHeaders, clientsSchemaAttributes } = useDataClients();

    expect(clientsSchemaHeaders).toEqual([
      { label: "ID", options: null },
      { label: "Nombre", options: null },
      { label: "ID Endpoint", options: null },
      { label: "Estado", options: null },
    ]);
    expect(clientsSchemaAttributes).toEqual(["id", "nombre", "endpoint_id", "status"]);
  });

  it("defines headers and attributes for survey clients table", () => {
    const { surveyClientsHeaders, surveyClientsAttributes } = useDataClients();

    expect(surveyClientsHeaders).toEqual([
      { label: "Cliente ID", options: null },
      { label: "Nombre", options: null },
      { label: "Feed Value", options: null },
      { label: "Centro de Costo", options: null },
      { label: "Overtime", options: null },
      { label: "Ciudad ID", options: null },
    ]);
    expect(surveyClientsAttributes).toEqual([
      "cliente_id",
      "name",
      "feed_value",
      "cost_center",
      "overtime",
      "city_id",
    ]);
  });

  it("normalizes clients from backend schema fields", () => {
    const { setFixClientsSchema } = useDataClients();

    expect(setFixClientsSchema([
      { id: 1, nombre: "Cliente A", cliente_endpoint_id: 100 },
      { id: 2, name: "Cliente B", cliente_endpoint_id: 200, deleted_at: "2026-06-04 10:00:00" },
      {},
    ])).toEqual([
      { id: 1, nombre: "Cliente A", endpoint_id: 100, activo: null, deleted_at: null, status: "Activo" },
      { id: 2, nombre: "Cliente B", endpoint_id: 200, activo: null, deleted_at: "2026-06-04 10:00:00", status: "Deshabilitado" },
      { id: null, nombre: null, endpoint_id: null, activo: null, deleted_at: null, status: "Activo" },
    ]);
  });

  it("normalizes survey clients from backend schema fields", () => {
    const { setFixSurveyClients } = useDataClients();

    expect(setFixSurveyClients([
      {
        clients_id: 10,
        name: "Survey A",
        feed_value: 12000,
        cost_center: "CC10",
        overtime: "01:00:00",
        city_id: 5,
      },
      {
        cliente_id: 20,
        name: "Survey B",
      },
      {},
    ])).toEqual([
      {
        cliente_id: 10,
        name: "Survey A",
        feed_value: 12000,
        cost_center: "CC10",
        overtime: "01:00:00",
        city_id: 5,
      },
      {
        cliente_id: 20,
        name: "Survey B",
        feed_value: null,
        cost_center: null,
        overtime: null,
        city_id: null,
      },
      {
        cliente_id: null,
        name: null,
        feed_value: null,
        cost_center: null,
        overtime: null,
        city_id: null,
      },
    ]);
  });
});
