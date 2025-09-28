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

  <div class="flex rounded-3xl flex-col w-full h-full bg-white overflow-y-auto">
    <!-- Header -->
    <header class="flex items-center justify-center w-full p-4">
      <img
        src="/assets/img/svg/favicon3.png"
        alt="Logo IENM"
        class="max-h-24 w-auto object-contain"
      />
    </header>

    <main class="pb-16">
      <!-- Bienvenida -->
      <section class="max-w-6xl mx-auto px-4">
        <p class="text-sm/5 opacity-90">Bienvenido</p>
        <h2
          class="text-2xl md:text-3xl font-semibold tracking-tight text-azulIENM"
        >
          <span class="opacity-90">Cliente:</span>
          <span class="ml-2 font-bold">{{ clientName || "—" }}</span>
        </h2>
      </section>

      <!-- Propósito IM / Propósito Juntos -->
      <section class="max-w-6xl mx-auto px-4 mt-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 class="text-azulIENM text-xl font-bold">Propósito IM</h3>
          <div class="w-16 h-[3px] bg-amarilloIENM mt-1"></div>
          <p class="mt-3 text-slate-700">
            Potencializar las capacidades humanas con trabajos que aporten al
            desarrollo de la sociedad.
          </p>
        </div>

        <div>
          <h3 class="text-azulIENM text-xl font-bold">Propósito Juntos</h3>
          <div class="w-16 h-[3px] bg-amarilloIENM mt-1"></div>
          <p class="mt-3 text-slate-700">
            Contribuir al progreso de los colaboradores para que lleven
            bienestar a sus familias.
          </p>
        </div>
      </section>

      <!-- Misión / Visión -->
      <section class="max-w-6xl mx-auto px-4 mt-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 class="text-azulIENM text-xl font-bold">Misión</h3>
          <div class="w-16 h-[3px] bg-amarilloIENM mt-1"></div>
          <p class="mt-3 text-slate-700">
            Dar vida a soluciones ingeniosas y sostenibles para hacer más
            eficiente la cadena logística y productiva, desarrollando economía
            circular, que genere impactos positivos a empresas, trabajadores,
            comunidad y su entorno.
          </p>
        </div>

        <div>
          <h3 class="text-azulIENM text-xl font-bold">Visión</h3>
          <div class="w-16 h-[3px] bg-amarilloIENM mt-1"></div>
          <p class="mt-3 text-slate-700">
            Ser la empresa líder en el desarrollo de soluciones circulares de
            impacto sostenible dentro del ecosistema logístico y productivo en
            el continente americano.
          </p>
        </div>
      </section>

      <!-- Valores -->
      <section class="max-w-6xl mx-auto px-4 mt-12 text-center">
        <h3 class="text-azulIENM text-2xl font-bold">Valores</h3>
        <div class="w-32 h-[3px] bg-amarilloIENM mt-2 mx-auto"></div>

        <div class="mt-6 flex items-center justify-center">
          <!-- Reemplaza la ruta por tu imagen de valores -->
          <img
            src="/assets/img/valores.png"
            alt="Valores IENM: Conexión, Eficiencia, Innovación, Trabajo Colaborativo, Crecimiento Sostenible, Sentido de Comunidad"
            class="max-w-[720px] w-full object-contain"
          />
        </div>
      </section>

      <!-- Certificaciones -->
      <section class="max-w-6xl mx-auto px-4 mt-12 flex justify-between">
        <div class="flex-1 p-2">
          <h3 class="text-azulIENM text-2xl font-bold text-center">
            Certificaciones
          </h3>
          <div class="w-90 h-[3px] bg-amarilloIENM mt-2 mx-auto"></div>
          <div class="items-center">
            <div class="cert-card">
              <img
                src="/assets/img/LOGOS-IM.png"
                alt="ICONTEC ISO 9001"
                class="cert-logo"
              />
            </div>
          </div>
        </div>

        <div class="flex-1 p-2">
          <h3 class="text-azulIENM text-2xl font-bold text-center">
            Asociados
          </h3>
          <div class="w-90 h-[3px] bg-amarilloIENM mt-2 mx-auto"></div>

          <div class="items-center">
            <div class="cert-card">
              <img
                src="/assets/img/logoAcrip.png"
                alt="Asociados"
                class="cert-logo"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Franja de contacto + Línea Ética -->
      <section
        class="mt-16 py-10 text-white bg-gradient-to-br from-azulIENM to-azulClaroIENM pattern"
      >
        <div
          class="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <!-- Atención Comercial -->
          <div>
            <h4 class="font-bold text-lg text-azulIENM">Atención Comercial</h4>
            <div class="w-16 h-[3px] bg-amarilloIENM mt-1 mb-3"></div>
            <p class="mt-2 text-azulIENM">
              +57 318 571 7376<br />+57 316 522 0479
            </p>
            <p class="mt-2 text-azulIENM">
              asesor.comercial@ienm.com.co<br />jefe.ventas@ienm.com.co
            </p>
          </div>

          <!-- Empleados y Aspirantes -->
          <div>
            <h4 class="font-bold text-lg text-azulIENM">
              Atención Empleados y Aspirantes
            </h4>
            <div class="w-16 h-[3px] bg-amarilloIENM mt-1 mb-3"></div>
            <p class="mt-2 text-azulIENM">
              Bogotá/Barranquilla: +57 310 786 4609<br />Cali/Medellín: +57 311
              383 6919
            </p>
            <p class="mt-2 text-azulIENM">seleccion@ienm.com.co</p>
          </div>

          <!-- Sedes -->
          <div>
            <h4 class="font-bold text-lg text-azulIENM">
              Cali y Bogotá, Colombia
            </h4>
            <div class="w-16 h-[3px] bg-amarilloIENM mt-1 mb-3"></div>
            <p class="text-azulIENM">
              Cali – Transversal 29 #16-57<br />+57 (2) 485 7371
            </p>
            <p class="mt-2 text-azulIENM">
              Bogotá – Calle 86 #22-13<br />+57 (1) 645 5795
            </p>
            <p class="mt-2 text-azulIENM">
              Atención Proveedores: +57 311 383 6925<br />proveedores@ienm.com.co
            </p>
          </div>

          <!-- Línea Ética / QR -->
          <div class="text-center lg:text-left">
            <h4 class="font-bold text-lg text-azulIENM">
              Línea Ética (Canal de Denuncias)
            </h4>
            <div
              class="w-16 h-[3px] bg-amarilloIENM mt-1 mb-4 mx-auto lg:mx-0"
            ></div>
            <img
              src="/assets/img/linea_etica.png"
              alt="QR Línea Ética"
              class="mx-auto lg:mx-0 w-48 h-48 object-contain bg-white rounded-md p-2 shadow-md"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* patrón sutil sobre el gradiente azul (como textura) */
.pattern {
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.06) 1px,
    transparent 1px
  );
  background-size: 22px 22px;
}

/* utilidades para tarjetas de certificaciones */
.cert-card {
  @apply flex items-center justify-center;
}
.cert-logo {
  @apply max-h-24 w-auto object-contain;
}
</style>

<script lang="ts" setup>
import { useCookie } from "nuxt/app";
import { definePageMeta } from "../node_modules/nuxt/dist/pages/runtime/composables";

// Configuración de la página
definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
});

const nRemisiones = useCookie("numRem", { sameSite: "none", secure: true });
const idCliente = useCookie("idCliente");
const clientName = useCookie("nameClient");
</script>
