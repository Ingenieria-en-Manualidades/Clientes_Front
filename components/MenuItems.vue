<template>
  <div class="divUser" @click="toggle">
    <span class="mr-5 font-manrope-b">{{ usuario }}</span>
    <i
      class="pi pi-user text-azulIENM mt-[8%] text-[1.5rem] lg:text-[2rem] lg:mt-0"
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
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast"; //Importamos variable para utilizar los mensajes 'Toast' de primevue
import { loginApi } from "~/composables/loginApi";

const toast = useToast();
const router = useRouter(); //Variable que utilizaremos para viajar entre rutas
const { logout } = loginApi();

const menu = ref(); //Crea la variable ref para el menu
// Crea un arreglo que contiene los items con su respectivo logo y nombre
const items = ref([
  {
    label: "Salir",
    icon: "pi pi-sign-out",
    type: "salir",
  },
]);

// Función que ayuda abrir el menu con un click
const toggle = (event: any) => {
  menu.value.toggle(event);
};

// Función que ayuda a conseguir el nombre de usuario entregado al componente.
const props = defineProps({
  usuario: String,
});

//Función de cerrar sesión para borrar token del usuario y las cookies para retornar al login.
const cerrarSesion = async () => {
  // llamamos al método logout que realiza el borrado del token en la base de datos y como cookie .
  const response = await logout();

  // Revisamos si el cerrar sesión funciono.
  if (response.success) {
    await router.push("/");
  } else {
    toast.add({
      severity: response.status,
      summary: response.tittle,
      detail: response.mensaje,
      life: 3000,
    });
  }
};
</script>
