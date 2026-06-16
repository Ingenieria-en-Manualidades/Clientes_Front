// @vitest-environment jsdom
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ModalClientUsers from "../../../components/clients/ModalClientUsers.vue";

const getUsersByClient = vi.fn();
const getUsersBySurveyClient = vi.fn();
const toastAdd = vi.fn();

vi.mock("../../../composables/administration/clientsApi", () => ({
  useClientsApi: () => ({
    getUsersByClient,
    getUsersBySurveyClient,
  }),
}));

vi.mock("primevue/usetoast", () => ({
  useToast: () => ({
    add: toastAdd,
  }),
}));

const mountModal = (props = {}) => mount(ModalClientUsers, {
  props: {
    clientId: 10,
    clientName: "Cliente A",
    ...props,
  },
  global: {
    stubs: {
      Dialog: {
        props: ["visible", "header"],
        template: "<section><h2>{{ header }}</h2><slot /></section>",
      },
      ProgressSpinner: true,
    },
  },
});

describe("ModalClientUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads and renders users from clients source", async () => {
    getUsersByClient.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: 1,
          username: "ana",
          fullname: "Ana Gomez",
          email: "ana@example.com",
          cellphone: "3001234567",
          activo: "s",
          deleted_at: null,
        },
        {
          id: 2,
          username: "luis",
          contact_fullname: "Luis Contacto",
          email: null,
          cellphone: null,
          activo: "n",
          deleted_at: null,
        },
        {
          id: 3,
          username: "maria",
          fullname: null,
          email: null,
          cellphone: null,
          activo: "s",
          deleted_at: "2026-05-01",
        },
      ],
    });

    const wrapper = mountModal();
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(getUsersByClient).toHaveBeenCalledWith(10);
    expect(getUsersBySurveyClient).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Usuarios asociados - Cliente A");
    expect(wrapper.text()).toContain("ana");
    expect(wrapper.text()).toContain("Ana Gomez");
    expect(wrapper.text()).toContain("Activo");
    expect(wrapper.text()).toContain("Luis Contacto");
    expect(wrapper.text()).toContain("Inactivo");
    expect(wrapper.text()).toContain("Eliminado");
  });

  it("loads users from surveys source when source prop is surveys", async () => {
    getUsersBySurveyClient.mockResolvedValueOnce({
      success: true,
      data: [{ id: 4, username: "survey.user", activo: "s", deleted_at: null }],
    });

    const wrapper = mountModal({ clientId: 99, source: "surveys" });
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(getUsersBySurveyClient).toHaveBeenCalledWith(99);
    expect(getUsersByClient).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("survey.user");
  });

  it("shows backend empty message when users are not found", async () => {
    getUsersByClient.mockResolvedValueOnce({
      success: false,
      title: "Usuarios no encontrados.",
      message: "Este cliente no tiene usuarios asociados.",
    });

    const wrapper = mountModal();
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Este cliente no tiene usuarios asociados.");
    expect(toastAdd).not.toHaveBeenCalled();
  });

  it("shows toast and fallback message for unexpected errors", async () => {
    getUsersByClient.mockResolvedValueOnce({
      success: false,
      title: "Error con el servidor.",
      message: "Por favor recargar la pagina.",
    });

    const wrapper = mountModal();
    await wrapper.get("button").trigger("click");
    await flushPromises();

    expect(toastAdd).toHaveBeenCalledWith({
      severity: "error",
      summary: "Error con el servidor.",
      detail: "Por favor recargar la pagina.",
      life: 5000,
    });
    expect(wrapper.text()).toContain("No fue posible cargar los usuarios asociados.");
  });
});
