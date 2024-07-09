<template>
  <div class="divUser" @click="toggle">
    <span class="mr-5 font-manrope-b">{{ usuario }}</span>
    <i
      class="pi pi-user text-azulIENM text-[1.5rem]"
      style="font-size: 2rem"
    ></i>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true">
      <template #item="{ item, props }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else-if="item.type"
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
          @click="cerrarSesion"
        >
          <span :class="item.icon" />
          <span class="ml-2 font-manrope-b">{{ item.label }}</span>
        </a>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span class="ml-2 font-manrope-b">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { loginApi } from "~/composables/loginApi";

const toast = useToast();
const router = useRouter();
const { logout } = loginApi();

//Crea la raferecia para el menu
const menu = ref();
//Crea un arreglo que contiene los items con su respectivo logo y nombre
const items = ref([
  {
    label: "Actualizar",
    icon: "pi pi-refresh",
    route: "/dashboard",
  },
  {
    label: "Salir",
    icon: "pi pi-sign-out",
    type: "salir",
  },
]);

//Función que me ayuda abrir el menu con un click
const toggle = (event) => {
  menu.value.toggle(event);
};

//Función que ayuda a conseguir el nombre de usuario pasasdo al componente.
const props = defineProps({
  usuario: String,
});

//Función de cerrar sesión para borrar token del usuario y retornar al login.
const cerrarSesion = async () => {
  //llamamos al método logout que realiza el borrado del token.
  const response = await logout();
  //Envia al usuario al token
  if (response.success) {
    await router.push("/");
  }

  // toast.add({
  //   severity: response.success,
  //   summary: response.tittle,
  //   detail: response.mensaje,
  //   life: 3000,
  // });
};
</script>

<style></style>
