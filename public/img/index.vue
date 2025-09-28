<template>
  <div class="brand-page">
    <!-- HERO con degradado corporativo -->
    <section class="brand-hero">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-start justify-between gap-4 text-white">
          <div>
            <p class="text-sm/5 opacity-90">Bienvenido</p>
            <h2 class="text-2xl md:text-3xl font-semibold tracking-tight">
              <span class="opacity-90">Cliente:</span>
              <span class="ml-2 font-bold">{{ clientName || '—' }}</span>
            </h2>
          </div>

          <!-- Campana / Remisiones -->
          <button
            type="button"
            class="relative inline-flex items-center rounded-xl border border-white/30 px-3 py-2 hover:bg-white/10 transition"
            @click="goTo('/remisiones')"
            aria-label="Ir a remisiones pendientes"
          >
            <i class="pi pi-bell text-xl"></i>
            <span
              v-if="Number(nRemisiones || 0) > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 border-2 border-white"
            >
              {{ nRemisiones }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <!-- Tipos de operación -->
      <section>
        <h3 class="section-title">Tipos de operación</h3>

        <div v-if="pendingOps" class="text-sm text-gray-500 animate-pulse">
          Cargando tipos de operación…
        </div>

        <div v-else-if="opKeys.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <figure
            v-for="key in opKeys"
            :key="key"
            class="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow transition"
          >
            <img
              :src="imageForKey(key)"
              :alt="`Operación: ${labelForKey(key)}`"
              class="h-20 w-auto object-contain"
              loading="eager"
            />
            <figcaption class="mt-2 text-sm font-medium text-gray-700">
              {{ labelForKey(key) }}
            </figcaption>
          </figure>
        </div>

        <div v-else class="white-card text-sm text-gray-500">
          Sin tipos de operación asignados aún.
        </div>
      </section>

      <!-- Accesos rápidos (sin Reportes; Soporte oculto) -->
      <section>
        <h3 class="section-title">Accesos rápidos</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button type="button" class="card-btn" @click="goTo('/remisiones')">
            <i class="pi pi-send text-2xl text-brand-700"></i>
            <span>Remisiones</span>
          </button>
          <button type="button" class="card-btn" @click="goTo('/documentos')">
            <i class="pi pi-folder-open text-2xl text-brand-700"></i>
            <span>Documentos</span>
          </button>

          <!-- Soporte: oculto -->
          <button v-if="false" type="button" class="card-btn" @click="goTo('/soporte')">
            <i class="pi pi-life-select text-2xl text-brand-700"></i>
            <span>Soporte</span>
          </button>
        </div>
      </section>

      <!-- Resumen operativo (KPIs): oculto -->
      <section v-if="false">
        <h3 class="section-title">Resumen operativo</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="kpi-card"><h4 class="kpi-title">Remisiones pendientes</h4></div>
          <div class="kpi-card"><h4 class="kpi-title">Tickets abiertos</h4></div>
          <div class="kpi-card"><h4 class="kpi-title">Vencimientos próximos</h4></div>
          <div class="kpi-card"><h4 class="kpi-title">Cumplimiento / SLA</h4></div>
        </div>
      </section>

      <!-- Avisos y Documentos importantes: ocultos -->
      <section v-if="false"><h3 class="section-title">Avisos y novedades de servicio</h3><div class="white-card"></div></section>
      <section v-if="false"><h3 class="section-title">Documentos importantes</h3><div class="white-card"></div></section>

      <!-- QUIÉNES SOMOS (sin link externo) -->
      <section>
        <h3 class="section-title">Quiénes somos</h3>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="about-card">
            <h4 class="about-title">Propósito</h4>
            <p class="about-text"><!-- Pega aquí el propósito --></p>
          </div>

          <div class="about-card">
            <h4 class="about-title">Misión</h4>
            <p class="about-text"><!-- Pega aquí la misión --></p>
          </div>

          <div class="about-card">
            <h4 class="about-title">Visión</h4>
            <p class="about-text"><!-- Pega aquí la visión --></p>
          </div>

          <div class="about-card">
            <h4 class="about-title">Valores</h4>
            <ul class="mt-2 grid grid-cols-2 gap-2">
              <!-- Reemplaza o elimina -->
              <li class="chip">Integridad</li>
              <li class="chip">Servicio</li>
              <li class="chip">Agilidad</li>
              <li class="chip">Innovación</li>
            </ul>
          </div>

          <div class="about-card md:col-span-2">
            <h4 class="about-title">Certificaciones</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
              <!-- Reemplaza con tus logos y textos -->
              <div class="cert-card">
                <img src="assets/img/9001.png" alt="ICONTEC ISO 9001" class="cert-logo" />
                <p class="cert-label">ICONTEC · ISO 9001</p>
              </div>
              <!-- <div class="cert-card">
                <img src="assets/img/cert/iqnet.png" alt="IQNet" class="cert-logo" />
                <p class="cert-label">IQNet</p>
              </div> -->
              <div class="cert-card">
                <img src="assets/img/sello_no_discriminacion.png" alt="No Discriminación / Inclusión" class="cert-logo" />
                <p class="cert-label">No Discriminación</p>
              </div>
              <div class="cert-card">
                <img src="assets/img/resposabilidad_social.png" alt="Responsabilidad Social" class="cert-logo" />
                <p class="cert-label">Responsabilidad Social</p>
              </div>
            </div>

            <!-- Link externo oculto -->
            <div v-if="false" class="mt-4">
              <a
                href="https://ienmlogistica.ienm.com.co/?page_id=11"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 link"
              >
                Ver página “Quiénes somos”
                <i class="pi pi-external-link text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- LÍNEA ÉTICA (sin botón de abrir canal) -->
      <section class="mb-6">
        <h3 class="section-title">Línea Ética (Canal de Denuncias)</h3>
        <div class="flex flex-col md:flex-row items-center gap-6 white-card">
          <img
            src="assets/img/linea_etica.png"
            alt="Código QR - Línea Ética (Canal de Denuncias)"
            class="h-44 w-44 object-contain"
          />
          <div class="w-full">
            <p class="text-sm text-gray-700">
              <!-- Pega aquí una breve descripción / instrucciones del canal -->
            </p>
            <!-- Botón oculto -->
            <div v-if="false" class="mt-3">
              <a href="#" class="btn-primary" target="_blank" rel="noopener" aria-label="Abrir Canal de Línea Ética">
                Abrir Canal
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useHead } from '#imports'
import { useCookie } from 'nuxt/app'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'default', middleware: 'auth', requiresAuth: true })
useHead({ title: 'Inicio · Módulo de Clientes' })

const router = useRouter()

/** Cookies */
const idCliente = useCookie('idCliente')
const clientName = useCookie('nameClient')
const nRemisiones = useCookie('numRem', { sameSite: 'none', secure: true })

/** Mapa operación -> imagen (rutas en /public/img/ops/) */
const OP_IMAGES: Record<string, string> = {
  aeropuertos: 'assets/img/IM AEROPUERTOS.png',
  manufactura: 'assets/img/IM MANUFACTURA.png',
  maquila: 'assets/img/IM MANUFACTURA.png',
  zona_franca: 'assets/img/IM ZONA FRANCA.png',
  logistica: 'assets/img/IM LOGISTICA.png',
  soluciones: 'assets/img/IM SOLUCIONES.png',
  default: 'assets/img/IM INGENIERIA HORIZONTAL.png'
}

/** Normaliza: “Zona Franca” -> “zona_franca” */
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')

/** Etiqueta bonita */
const pretty = (key: string) =>
  key === 'zona_franca' ? 'Zona Franca' : key.replace(/_/g, ' ').replace(/(^|\s)\S/g, t => t.toUpperCase())

/** Fetch de operaciones */
const pendingOps = ref(true)
const opsRaw = ref<string[]>([])

/** Claves únicas normalizadas (ej: "zona_franca") */
const opKeys = computed(() => {
  const set = new Set<string>()
  for (const raw of opsRaw.value) set.add(normalize(raw))
  return Array.from(set)
})

const imageForKey = (key: string) => OP_IMAGES[key] || OP_IMAGES.default
const labelForKey = (key: string) => pretty(key)

onMounted(async () => {
  try {
    const id = Number(idCliente.value)
    // Debe devolver array de strings: ["Aeropuertos", "Logística", ...]
    opsRaw.value = await $fetch<string[]>(`/api/clients/${id}/operations`)
  } catch (e) {
    console.error('No se pudieron obtener las operaciones del cliente', e)
    opsRaw.value = []
  } finally {
    pendingOps.value = false
  }
})

/** Navegación */
const goTo = (path: string) => router.push(path)
</script>

<style scoped>
/* ======= Variables de marca (Manual IM) ======= */
:root {
  /* Azules corporativos */
  --azul-300c: #1268b3;  /* Pantone 300C  → R18 G104 B179 */
  --azul-7461c: #157fc3; /* Pantone 7461C → R21 G127 B195 */
  /* Amarillos (acento) */
  --amarillo-143c: #fcb316; /* R252 G179 B22 */
  --amarillo-c: #ffda00;    /* R255 G218 B0 */
}

/* ======= Layout & Brand ======= */
.brand-page { @apply bg-gray-50; }
.brand-hero {
  background: linear-gradient(90deg, var(--azul-7461c), var(--azul-300c));
}

/* Título de sección con subrayado amarillo (acento ≤10%) */
.section-title {
  @apply text-lg font-semibold text-gray-800 mb-4;
  position: relative;
}
.section-title::after {
  content: "";
  display: block;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, var(--amarillo-143c), var(--amarillo-c));
  margin-top: 6px;
}

/* Tarjetas base */
.white-card { @apply rounded-2xl border border-gray-100 bg-white p-6 shadow-sm; }
.card-btn { @apply flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-sm hover:shadow transition; }
.kpi-card { @apply rounded-2xl border border-gray-100 bg-white p-5 shadow-sm; }
.kpi-title { @apply text-sm font-semibold text-gray-600; }

/* Quiénes somos */
.about-card { @apply rounded-2xl border border-gray-100 bg-white p-5 shadow-sm; }
.about-title { @apply text-base font-semibold text-gray-700; }
.about-text { @apply mt-2 text-gray-700 leading-relaxed; }
.chip { @apply inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-50; }

/* Certificaciones */
.cert-card { @apply flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4; }
.cert-logo { @apply h-12 w-auto object-contain; }
.cert-label { @apply text-xs text-gray-600; }

/* Enlaces primarios (si se usan) */
.link { color: var(--azul-300c); }
.link:hover { color: var(--azul-7461c); }

/* Botón primario (no se muestra en esta versión) */
.btn-primary {
  background: var(--azul-300c);
  @apply inline-flex items-center gap-2 rounded-xl px-4 py-2 text-white hover:opacity-90 transition;
}

/* Helper */
.text-brand-700 { color: var(--azul-300c); }
</style>
