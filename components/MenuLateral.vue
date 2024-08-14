<template>
  <div class="slideBar">
    <Tabs>
      <TabList>
        <Tab v-for="modulo in modulos" :key="modulo.nombre">
          <router-link v-slot="{ href, navigate }" :to="modulo.ruta" custom>
            <a
              v-ripple
              :href="href"
              @click="navigate"
              class="flex justify-start py-2 pl-4 hover:bg-verdeIENM rounded-lg"
            >
              <i v-if="modulo.icono" :class="modulo.icono"
                ><span class="ml-2 font-manrope-r text-base">{{
                  modulo.nombre
                }}</span></i
              >
              <!-- <img
                v-else
                src="../assets/img/remision.png"
                :alt="`icono del modulo ${modulo.nombre}`"
                width="20px"
              />
              <span v-if="modulo.img">{{ modulo.nombre }}</span> -->
            </a>
          </router-link>
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
const modulos = ref([
  {
    icono: "pi pi-home",
    nombre: "Modulo 1",
    ruta: "/modulo1",
  },
  {
    // img: "remision.png",
    icono: "pi pi-home",
    nombre: "Remisiones",
    ruta: "/remisiones",
  },
  {
    icono: "pi pi-home",
    nombre: "Modulo 3",
  },
]);

const botonjaja = document.getElementById("botonjaja");

botonjaja?.addEventListener("click", (event) => {
  alert("hola");
});
</script>

<style>
.slideBar {
  width: 23%;
  height: 440px;
  background-color: #fbdc00;
  border-radius: 8px;
  margin-right: 1%;
  padding: 40px 12px 0px 12px;
  transform: translate(-100%);
  transition: 0.5s;
}

.slideBar:hover {
  transform: translate(0);
}
</style>
