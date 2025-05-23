<!-- <template>
  <title>Bienvenido a IENM</title>
  <div class="flex justify-center items-center mt-20">
    <div class="border-2 rounded-lg shadow w-[70%] md:w-[65%] lg:inline-flex">
      <div class="w-1/2 bg-cover pt-4 pb-4">
        <img
          src="/assets/img/im-policromia-vert.png"
          alt="IENM Logo"
          class="ml-[50%] hidden lg:m-0 lg:block"
        />
        <img
          src="/assets/img/ienmLogito.png"
          alt="Logito IENM"
          class="ml-[50%] md:ml-[60%] w-[100%] md:w-[65%] lg:hidden"
        />
      </div>
      <div
        class="bg-gradient-to-r from-azulIENM to-azulClaroIENM lg:w-1/2 p-[3%] rounded lg:rounded-r-lg"
      >
        <p
          class="w-full text-center font-manrope-r text-3xl mb-[7%] mt-[2%] lg:text-5xl md:text-4xl text-white"
        >
          Bienvenido
        </p>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

//Método para que no tenga la plantilla HTML por defecto
definePageMeta({
  layout: false,
  middleware: "usuario-no-verificado",
});
</script> -->

<template>
  <title>Bienvenido al Módulo de Clientes</title>
  <div class="flex flex-col items-center mt-20">
    <!-- Contenedor Principal -->
    <div
      class="border-2 rounded-lg shadow-lg w-[90%] md:w-[80%] lg:w-[70%] bg-white overflow-hidden"
    >
      <!-- Sección de Encabezado -->
      <div class="flex flex-col md:flex-row">
        <div
          class="w-full md:w-1/2 bg-cover flex items-center justify-center bg-gradient-to-r from-azulIENM to-azulClaroIENM"
        >
          <img
            src="/assets/img/im-policromia-vert.png"
            alt="IENM Logo"
            class="w-[60%] hidden md:block"
          />
          <img
            src="/assets/img/ienmLogito.png"
            alt="IENM Logito"
            class="w-[50%] md:hidden"
          />
        </div>
        <div class="w-full md:w-1/2 p-8">
          <h1
            class="text-center font-manrope-r text-3xl lg:text-4xl text-gray-800"
          >
            Bienvenido al Módulo de Clientes
          </h1>
          <p class="text-center text-gray-600 mt-4 text-lg">
            Transformamos desafíos en triunfos y creamos juntos un futuro
            circular.
          </p>
        </div>
      </div>

      <!-- Sección "Sobre Nosotros" -->
      <div class="p-8">
        <h2 class="text-2xl lg:text-3xl font-semibold text-azulIENM">
          Sobre Nosotros
        </h2>
        <p class="text-gray-700 mt-4 text-justify leading-relaxed">
          Con más de 30 años de experiencia, somos líderes en la mejora de la
          eficiencia de las cadenas de suministro. Nuestra misión es ofrecer
          soluciones personalizadas que aborden de manera integral los desafíos
          en manufactura, logística, gestión de recursos humanos y
          comercialización de bienes y servicios.
        </p>
        <p class="text-gray-700 mt-4 text-justify leading-relaxed">
          Especializados en la administración de procesos, garantizamos un
          funcionamiento óptimo en cada fase. Transformamos cada desafío en una
          oportunidad estratégica, impulsando no solo el crecimiento
          empresarial, sino también el bienestar y desarrollo de los
          trabajadores.
        </p>
      </div>

      <!-- Sección "Metodología de Trabajo" -->
      <div class="p-8 bg-gray-100">
        <h2 class="text-2xl lg:text-3xl font-semibold text-azulIENM">
          Nuestra Metodología de Trabajo
        </h2>
        <p class="text-gray-700 mt-4 text-justify leading-relaxed">
          Implementamos los principios del Lean Manufacturing para garantizar
          eficiencia, calidad y procesos optimizados en cada proyecto. Como
          defensores de la economía circular, promovemos un ecosistema
          sostenible que fomenta el intercambio de valores, productos y
          servicios, contribuyendo al desarrollo de un futuro más verde.
        </p>
        <p class="text-gray-700 mt-4 text-justify leading-relaxed">
          Nuestro compromiso con la excelencia está respaldado por la
          certificación ISO 9001:2015, lo que asegura altos estándares en cada
          una de nuestras iniciativas.
        </p>
      </div>

      <!-- Call to Action -->
      <div
        class="p-8 text-center bg-gradient-to-r from-azulIENM to-azulClaroIENM text-white"
      >
        <h3 class="text-xl lg:text-2xl font-bold">
          Trabajemos juntos para construir un futuro sostenible.
        </h3>
        <p class="mt-2">
          Confíe en nuestra experiencia y enfoque innovador para llevar su
          negocio al siguiente nivel.
        </p>
        <button
          class="mt-4 bg-white text-azulIENM px-6 py-2 rounded-full shadow hover:bg-gray-100"
        >
          Explorar Servicios
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

// Configuración de la página
definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});
</script>

<style scoped>
/* Personalización de colores */
.text-azulIENM {
  color: #0056b3; /* Ejemplo de azul corporativo */
}
.bg-azulIENM {
  background-color: #0056b3;
}
.bg-azulClaroIENM {
  background-color: #0096ff; /* Azul más claro */
}
</style>
