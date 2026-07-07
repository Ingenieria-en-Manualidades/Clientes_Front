import { beforeEach, describe, expect, it, vi } from "vitest";
import { useClientsApi } from "../../../composables/administration/clientsApi";

const runtimeConfig = {
  public: {
    apiBackendCliente: "https://backend.test/",
    apiKeyBackend: "secret-token",
  },
};

vi.mock("nuxt/app", () => ({
  useRuntimeConfig: () => runtimeConfig,
}));

const jsonResponse = (ok: boolean, body: unknown) => ({
  ok,
  json: vi.fn().mockResolvedValue(body),
});

describe("useClientsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    global.fetch = vi.fn();
  });

  it("gets clients schema successfully", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      data: [{ id: 1, nombre: "Cliente A" }],
    }) as any);

    const result = await useClientsApi().getClientsSchema();

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/getClients", {
      method: "get",
    });
    expect(result).toEqual({
      success: true,
      title: "",
      message: "",
      data: [{ id: 1, nombre: "Cliente A" }],
    });
  });

  it("returns backend errors when clients schema request fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(false, {
      title: "Clientes no encontrados.",
      message: "Sin clientes existentes.",
      error: "not found",
    }) as any);

    const result = await useClientsApi().getClientsSchema();

    expect(result).toEqual({
      success: false,
      title: "Clientes no encontrados.",
      message: "Sin clientes existentes.",
    });
  });

  it("gets survey clients successfully", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      data: [{ clients_id: 10, name: "Survey A" }],
    }) as any);

    const result = await useClientsApi().getSurveyClients();

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/listClients", {
      method: "get",
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ clients_id: 10, name: "Survey A" }]);
  });

  it("gets users by client id", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      data: [{ id: 1, username: "ana" }],
    }) as any);

    const result = await useClientsApi().getUsersByClient(25);

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/getUsersByClient/25", {
      method: "get",
    });
    expect(result).toEqual({
      success: true,
      title: "",
      message: "",
      data: [{ id: 1, username: "ana" }],
    });
  });

  it("gets users by survey client id", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      data: [{ id: 2, username: "luis" }],
    }) as any);

    const result = await useClientsApi().getUsersBySurveyClient(30);

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/getUsersBySurveyClient/30", {
      method: "get",
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual([{ id: 2, username: "luis" }]);
  });

  it("creates clients with backend token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      title: "Exito.",
      message: "Cliente creado exitosamente.",
    }) as any);

    const payload = { nombre: "Cliente Nuevo", cliente_endpoint_id: 321 };
    const result = await useClientsApi().setCreateClient(payload);

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/createClient", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
      },
      body: JSON.stringify(payload),
    });
    expect(result).toEqual({
      success: true,
      title: "Exito.",
      message: "Cliente creado exitosamente.",
    });
  });

  it("syncs clients with backend token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      title: "Sincronizacion exitosa.",
      message: "Clientes sincronizados.",
    }) as any);

    const result = await useClientsApi().setSyncClients();

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/syncClients", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
      },
    });
    expect(result.success).toBe(true);
  });

  it("updates clients with backend token and payload", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      title: "Exito.",
      message: "Cliente actualizado exitosamente.",
    }) as any);

    const payload = { nombre: "Cliente Editado", cliente_endpoint_id: 100 };
    const result = await useClientsApi().setUpdateClient(1, payload);

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/updateClient/1", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
      },
      body: JSON.stringify(payload),
    });
    expect(result.success).toBe(true);
  });

  it("updates client status with backend token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      title: "Exito.",
      message: "Cliente deshabilitado exitosamente.",
    }) as any);

    const result = await useClientsApi().setStatusClient(1);

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/setStatusClient/1", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
      },
    });
    expect(result.success).toBe(true);
  });

  it("updates survey clients with backend token and payload", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(true, {
      title: "Exito.",
      message: "Cliente de encuestas actualizado exitosamente.",
    }) as any);

    const payload = {
      name: "Survey Editado",
      feed_value: 15000,
      cost_center: "CC",
      overtime: "01:00:00",
      city_id: 5,
    };
    const result = await useClientsApi().setUpdateSurveyClient(9, payload);

    expect(fetch).toHaveBeenCalledWith("https://backend.test/api/updateSurveyClient/9", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-token",
      },
      body: JSON.stringify(payload),
    });
    expect(result.success).toBe(true);
  });

  it("returns generic error when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const result = await useClientsApi().setSyncClients();

    expect(result).toEqual({
      success: false,
      title: "Error desconocido.",
      message: "Por favor verificar la consola del navegador.",
    });
  });
});
