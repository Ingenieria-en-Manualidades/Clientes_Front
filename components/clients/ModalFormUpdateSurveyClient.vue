<template>
  <button
    type="button"
    class="bg-azulClaroIENM px-3 py-1 rounded hover:bg-azulIENM"
    @click="openModal"
  >
    <i class="pi pi-pencil text-white"></i>
  </button>

  <Dialog
    v-model:visible="visible"
    modal
    header="Actualizar cliente surveys"
    class="dialog"
  >
    <form>
      <fieldset class="sm:flex gap-3">
        <DinamicosInputText
          v-model="client.name"
          :label="'Nombre'"
          :displayFlex="false"
          :warning="errors.name ? 'Este campo es obligatorio.' : ''"
        />
        <DinamicosInputNumber
          v-model="client.feed_value"
          :label="'Feed Value'"
          :displayFlex="false"
        />
      </fieldset>
      <fieldset class="sm:flex gap-3">
        <DinamicosInputText
          v-model="client.cost_center"
          :label="'Centro de costo'"
          :displayFlex="false"
        />
        <DinamicosInputText
          v-model="client.overtime"
          :label="'Overtime (HH:MM:SS)'"
          :displayFlex="false"
        />
      </fieldset>
      <fieldset class="sm:flex gap-3">
        <DinamicosInputNumber
          v-model="client.city_id"
          :label="'Ciudad ID'"
          :displayFlex="false"
        />
      </fieldset>

      <button
        type="button"
        @click="update"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 rounded-2xl text-white py-3 shadow-lg active:scale-[0.99] transition disabled:cursor-not-allowed bg-gradient-to-r from-verdeIENM to-verdeOscIENM hover:opacity-95 mt-3"
      >
        <span v-if="!isLoading">Enviar</span>
        <ProgressSpinner
          v-else
          style="width: 25px; height: 25px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Cargando"
        />
      </button>
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import type { SurveyClientForm } from "../../interfaces/clients";
import { useClientsApi } from "../../composables/administration/clientsApi";

const props = defineProps({
  id: { type: [Number, String], required: true },
  name: { type: String, required: true },
  feedValue: { type: [Number, String], required: false, default: null },
  costCenter: { type: String, required: false, default: null },
  overtime: { type: [Number, String], required: false, default: null },
  cityId: { type: [Number, String], required: false, default: null },
});

const emits = defineEmits(["list"]);
const toast = useToast();
const { setUpdateSurveyClient } = useClientsApi();
const visible = ref(false);
const isLoading = ref(false);
const client = ref<SurveyClientForm>({
  name: null,
  feed_value: null,
  cost_center: null,
  overtime: null,
  city_id: null,
});
const errors = ref({
  name: false,
});

const openModal = () => {
  client.value = {
    name: props.name,
    feed_value: props.feedValue,
    cost_center: props.costCenter,
    overtime: props.overtime,
    city_id: props.cityId,
  };
  errors.value.name = false;
  visible.value = true;
};

const reviewFields = () => {
  errors.value.name = !client.value.name;

  if (errors.value.name) {
    toast.add({severity: "warn", summary: "Campos faltantes.", detail: "Revisa los campos que faltan.", life: 5000});
    return false;
  }

  return true;
};

const update = async () => {
  if (isLoading.value || !reviewFields()) return;

  isLoading.value = true;
  const response = await setUpdateSurveyClient(props.id, client.value);
  toast.add({severity: response.success ? "success" : "error", summary: response.title, detail: response.message, life: 5000});

  if (response.success) {
    visible.value = false;
    emits("list");
  }

  isLoading.value = false;
};
</script>

<style>
.dialog {
  width: 30rem;
  max-width: 95vw;
}
</style>
