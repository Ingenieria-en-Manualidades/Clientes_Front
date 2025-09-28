<template>
  <div
    class="flex justify-center p-24 min-h-screen bg-gradient-to-t from-blue-100 to-blue-400"
  >
    <div
      class="w-[30%] shadow-2xl rounded-2xl py-1 min-w-[300px] max-w-[380px] max-h-[350px] bg-white"
    >
      <div class="flex justify-center">
        <img
          src="/assets/img/IM INGENIERIA CENTRADO-slogan.png"
          alt="Logito IENM"
          class="w-[60%]"
        />
      </div>
      <div class="px-14">
        <form class="">
          <DinamicosDropDownList
            v-model="clientChoose"
            :label="'Seleccionar cliente'"
            :displayFlex="false"
            :options="options"
          />
          <button
            type="button"
            @click="login"
            :class="[
              'w-1/2 mx-auto',
              'flex items-center justify-center gap-2',
              'font-manrope-b text-white p-1 rounded-3xl mt-5',
              isLoading ? 'bg-slate-300' : 'bg-[#4789c8]',
            ]"
          >
            <span v-if="!isLoading">Continuar</span>
            <ProgressSpinner
              v-else
              style="width: 30px; height: 30px"
              strokeWidth="8"
              fill="transparent"
              animationDuration=".5s"
              aria-label="Custom ProgressSpinner"
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCookie } from "nuxt/app";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { loginApi } from "../composables/loginApi";
import ProgressSpinner from "primevue/progressspinner";
import type { OptionDropdown } from "../interfaces/componentesDinamicos";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

const clientChoose = ref();
const isLoading = ref(false);
const clientsIds = useCookie("clients");
const options = ref<OptionDropdown[]>([]);

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { getClientsByIds, chooseClient } = loginApi(); // Método para retornar clientes.

const listClients = async () => {
  const response = await getClientsByIds([clientsIds.value]);

  if (response.success) {
    for (const client of response.data) {
      const option: OptionDropdown = {
        label: client.nombre,
        value: client.cliente_endpoint_id,
      };
      options.value.push(option);
    }
  } else {
    toast.add({
      severity: "error",
      summary: response.title,
      detail: response.message,
      life: 5000,
    });
  }
};
listClients();

const login = async () => {
  isLoading.value = true;
  if (clientChoose.value) {
    const client = options.value.find((c) => c.value === clientChoose.value);

    const response = await chooseClient(clientChoose.value, client?.label);

    if (response.success) {
      const to = (route.query.redirect as string) || "/";
      await router.push(to);
    } else {
      toast.add({
        severity: "error",
        summary: response.title,
        detail: response.message,
        life: 5000,
      });
    }
  } else {
    toast.add({
      severity: "warn",
      summary: "Campo vacío.",
      detail: "Ningun cliente seleccionado.",
      life: 5000,
    });
  }
  isLoading.value = false;
};

definePageMeta({
  layout: false,
  middleware: "auth",
  requiresAuth: true,
});
</script>
