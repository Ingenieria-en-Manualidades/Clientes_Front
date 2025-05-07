<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="'Selección de clientes.'"
    :style="{ width: '25rem' }"
  >
    <div class="border border-black rounded py-5 px-9">
      <DinamicosDropDownList
        v-model="clientChoose"
        :label="'Seleccionar cliente'"
        :displayFlex="false"
        :options="options"
      />
      <button
        type="button"
        class="w-full font-manrope-b text-center bg-[#4789c8] text-white py-2 px-3 rounded mt-3"
      >
        Iniciar sesión
      </button>
      {{ clientChoose }}
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useCookie } from "nuxt/app";
import { useToast } from "primevue/usetoast";
import { loginApi } from "../composables/loginApi";
import type { OptionDropdown } from "../interfaces/componentesDinamicos";

const props = defineProps({
  visibleProp: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:visibleProp", value: boolean): void;
}>();

const clientChoose = ref();
const clientsIds = useCookie("clients");
const visible = ref(props.visibleProp);
const options = ref<OptionDropdown[]>([]);

const toast = useToast();
const { getClientsByIds } = loginApi(); // Método para retornar clientes.

const listClients = async () => {
  console.log("clientes cookies: ", clientsIds.value);

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

watch(
  () => props.visibleProp,
  (newVal) => {
    visible.value = newVal;
    if (visible.value) {
      listClients();
    }
  }
);

watch(visible, (newVal) => {
  emit("update:visibleProp", newVal);
});
</script>
