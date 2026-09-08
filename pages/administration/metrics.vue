<template>
  <div class="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-5">
    <title>Métricas</title>

    <section class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-azulIENM via-sky-700 to-slate-950 p-5 text-white shadow-xl sm:p-7">
      <div class="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amarilloIENM/20 blur-2xl" />
      <div class="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />

      <div class="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-3xl">
          <span class="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-sky-100 ring-1 ring-white/20">
            Centro de actividad
          </span>
          <h1 class="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Métricas de uso</h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-sky-100">
            Lectura rápida de usuarios, módulos, clientes y actividad reciente para entender qué se está usando y dónde hay baja adopción.
          </p>
        </div>

        <div class="flex flex-col gap-3 rounded-3xl bg-white/12 p-3 backdrop-blur sm:flex-row sm:items-center">
          <div class="rounded-2xl bg-white px-3 py-2 text-slate-700 shadow-sm">
            <label class="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Periodo</label>
            <select
              v-model="selectedDays"
              @change="loadMetrics"
              class="mt-1 min-w-40 bg-transparent text-sm font-bold text-slate-800 outline-none"
            >
              <option :value="7">Últimos 7 días</option>
              <option :value="30">Últimos 30 días</option>
              <option :value="90">Últimos 90 días</option>
            </select>
          </div>

          <button
            type="button"
            :disabled="isLoading"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-amarilloIENM px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            @click="loadMetrics"
          >
            <span :class="['inline-block h-2.5 w-2.5 rounded-full bg-slate-950', isLoading ? 'animate-ping' : '']" />
            {{ isLoading ? 'Actualizando' : 'Actualizar' }}
          </button>

          <NuxtLink
            to="/administration/monthly-metrics"
            class="inline-flex items-center justify-center rounded-2xl border border-white/30 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
          >
            Monthly Metrics
          </NuxtLink>
        </div>
      </div>
    </section>

    <div v-if="isLoading" class="mt-6 grid gap-4 lg:grid-cols-4">
      <div v-for="index in 8" :key="index" class="h-36 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-100" />
    </div>

    <template v-else>
      <section class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in primaryCards"
          :key="card.label"
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
        >
          <div :class="['absolute inset-x-0 top-0 h-1', card.accent]" />
          <div>
            <p class="text-[11px] font-black uppercase tracking-wide text-slate-400">{{ card.label }}</p>
            <p class="mt-2 break-words text-2xl font-black text-slate-900">{{ card.value }}</p>
          </div>
          <p class="mt-3 text-xs leading-5 text-slate-500">{{ card.description }}</p>
        </article>
      </section>

      <section class="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span class="text-xs font-black uppercase tracking-[0.2em] text-azulIENM">Actividad operativa</span>
            <h2 class="mt-2 text-xl font-black text-slate-950">Qué se está usando</h2>
            <p class="mt-1 max-w-2xl text-sm text-slate-500">Lectura de módulos, usuarios y adopción real durante el periodo seleccionado.</p>
          </div>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{{ selectedDays }} días</span>
        </div>

        <div class="mt-5">
          <div class="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm ring-1 ring-slate-100 sm:p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-black text-slate-950">Pulso del periodo</h2>
                <p class="mt-1 text-sm text-slate-500">Actividad distribuida por horarios y días.</p>
              </div>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">Tiempo</span>
            </div>

            <div class="mt-4 grid gap-3 lg:grid-cols-2">
              <MiniList title="Horarios de mayor uso" :items="metrics.peak_hours" labelKey="hour" valueKey="requests" suffix=":00" />
              <MiniList title="Frecuencia por día" :items="metrics.daily_usage" labelKey="date" valueKey="requests" />
            </div>
          </div>
        </div>
      </section>

      <section class="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-5">
        <div>
          <span class="text-xs font-black uppercase tracking-[0.2em] text-amber-500">Adopción y perfiles</span>
          <h2 class="mt-2 text-xl font-black text-slate-950">Dónde actuar</h2>
          <p class="mt-1 max-w-2xl text-sm text-slate-500">Módulos, roles y clientes que ayudan a decidir soporte, capacitación o seguimiento.</p>
        </div>

        <div class="mt-4 grid gap-4 xl:grid-cols-2">
          <GroupedMetricPanel title="Submódulos más usados" subtitle="Dónde se concentra la actividad realizada." :groups="groupedSubmodules" valueKey="requests" valueLabel="Actividades" tone="blue" />
          <GroupedMetricPanel title="Submódulos con menor actividad" subtitle="Señales tempranas de baja adopción." :groups="groupedLowUsageSubmodules" valueKey="percentage" valueLabel="Uso" suffixValue="%" tone="amber" />
          <MetricPanel title="Roles con mayor actividaddd" subtitle="Uso agrupado por perfil." :items="metrics.roles" labelKey="role" valueKey="requests" valueLabel="Actividad" tone="violet" />
          <MetricPanel title="Promedio de uso por cliente" subtitle="Promedio registrado por cliente." :items="metrics.clients" labelKey="client" valueKey="average_usage" valueLabel="Promedio" tone="cyan" />
        </div>
      </section>

      <section class="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-100/70 p-4 sm:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <span class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Observabilidad técnica</span>
            <h2 class="mt-2 text-lg font-black text-slate-950">Señales capturadas durante la actividad</h2>
            <p class="mt-1 max-w-2xl text-sm text-slate-500">
              Errores, lentitudes y acciones críticas salen del registro operativo de requests del periodo.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
            <article
              v-for="card in technicalCards"
              :key="card.label"
              class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200"
            >
              <p class="text-[11px] font-black uppercase tracking-wide text-slate-400">{{ card.label }}</p>
              <p class="mt-2 text-xl font-black text-slate-950">{{ card.value }}</p>
              <p class="mt-2 text-xs leading-5 text-slate-500">{{ card.description }}</p>
            </article>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMetricsApi } from '../../composables/administration/metricsApi';

type TechnicalCard = {
  label: string;
  value: number;
  description: string;
};

type MetricGroup = {
  module: string;
  items: any[];
};

const parseMetricNumber = (value: unknown) => Number(String(value ?? 0).replace('%', '').replace(',', '.')) || 0;

const formatPercentage = (value: unknown) => `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(parseMetricNumber(value))}%`;

const formatMetricValue = (value: unknown, suffix = '') => {
  const isPercentage = suffix === '%' || (typeof value === 'string' && value.trim().endsWith('%'));

  if (isPercentage) {
    return formatPercentage(value);
  }

  return `${value ?? 0}${suffix}`;
};

const ProgressBar = defineComponent({
  props: {
    value: { type: Number, default: 0 },
  },
  setup(props) {
    const progressValue = () => Math.min(Math.max(parseMetricNumber(props.value), 0), 100);

    return () => h('div', { class: 'h-8 overflow-hidden rounded-lg bg-slate-100' }, [
      h('div', {
        class: 'flex h-full items-center justify-center rounded-lg bg-emerald-500 text-sm font-black text-white transition-all duration-500',
        style: {
          width: `${progressValue()}%`,
          minWidth: progressValue() > 0 ? '4rem' : '0',
        },
        title: formatPercentage(progressValue()),
      }, progressValue() > 0 ? formatPercentage(progressValue()) : ''),
    ]);
  },
});

const EmptyState = defineComponent({
  props: {
    text: { type: String, required: true },
  },
  setup(props) {
    return () => h('div', { class: 'mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-7 text-center' }, [
      h('div', { class: 'mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm' }, 'i'),
      h('p', { class: 'text-sm font-semibold text-slate-500' }, props.text),
    ]);
  },
});

const MiniList = defineComponent({
  props: {
    title: { type: String, required: true },
    items: { type: Array, default: () => [] },
    labelKey: { type: String, required: true },
    valueKey: { type: String, required: true },
    suffix: { type: String, default: '' },
  },
  setup(props) {
    return () => h('section', { class: 'metrics-scroll-card metrics-scroll-card-compact relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 ring-1 ring-slate-100' }, [
      h('div', { class: 'border-b border-slate-200 bg-white px-3 py-2.5' }, [
        h('h3', { class: 'text-[11px] font-black uppercase tracking-wide text-slate-500' }, props.title),
      ]),
      props.items.length === 0
        ? h('p', { class: 'px-3 py-4 text-sm text-slate-500' }, 'Sin datos registrados.')
          : h('div', { class: 'metrics-scroll h-36 divide-y divide-slate-200 overflow-y-scroll pr-3' }, props.items.map((item: any) => h('div', { class: 'flex items-center justify-between gap-3 px-3 py-2.5 transition hover:bg-sky-50/60' }, [
            h('span', { class: 'truncate text-xs font-semibold text-slate-700' }, `${item[props.labelKey]}${props.suffix}`),
            h('span', { class: 'rounded-full bg-azulIENM px-2.5 py-1 text-xs font-black text-white' }, item[props.valueKey] ?? 0),
          ]))),
    ]);
  },
});

const MetricPanel = defineComponent({
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    items: { type: Array, default: () => [] },
    labelKey: { type: String, required: true },
    valueKey: { type: String, required: true },
    valueLabel: { type: String, required: true },
    suffix: { type: String, default: '' },
    suffixValue: { type: String, default: '' },
    tone: { type: String, default: 'blue' },
  },
  setup(props) {
    const toneClasses: Record<string, string> = {
      blue: 'from-sky-500 to-azulIENM',
      amber: 'from-amber-400 to-rojoIENM',
      green: 'from-emerald-400 to-teal-600',
      slate: 'from-slate-400 to-slate-700',
      violet: 'from-violet-400 to-indigo-700',
      cyan: 'from-cyan-400 to-sky-700',
    };

    return () => h('section', { class: 'metrics-scroll-card relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100' }, [
      h('div', { class: `h-1.5 bg-gradient-to-r ${toneClasses[props.tone] ?? toneClasses.blue}` }),
      h('div', { class: 'p-4 sm:p-5' }, [
        h('div', { class: 'flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between' }, [
          h('div', [
            h('h2', { class: 'text-base font-black text-slate-900' }, props.title),
            h('p', { class: 'mt-1 text-sm text-slate-500' }, props.subtitle),
          ]),
          h('span', { class: 'mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 sm:mt-0' }, props.valueLabel),
        ]),
        props.items.length === 0
          ? h(EmptyState, { text: 'Sin datos registrados para este periodo.' })
          : h('div', { class: 'metrics-scroll mt-4 h-72 space-y-2.5 overflow-y-scroll pr-4' }, props.items.map((item: any, index: number) => {
              const rawValue = item[props.valueKey] ?? 0;
              const numericValue = parseMetricNumber(rawValue);
              const maxValue = Math.max(...props.items.map((entry: any) => parseMetricNumber(entry[props.valueKey])), 1);
              const barValue = props.suffixValue === '%' ? numericValue : (numericValue / maxValue) * 100;

              return h('article', { class: 'rounded-xl border border-slate-100 p-3 transition hover:-translate-y-0.5 hover:border-sky-100 hover:bg-sky-50/40' }, [
                h('div', { class: 'flex items-start justify-between gap-4' }, [
                  h('div', { class: 'min-w-0' }, [
                    h('p', { class: 'truncate text-sm font-bold text-slate-800' }, `${index + 1}. ${item[props.labelKey]}${props.suffix}`),
                    h('p', { class: 'mt-1 text-xs text-slate-400' }, props.valueLabel),
                  ]),
                  h('p', { class: 'text-right text-base font-black text-slate-900' }, formatMetricValue(rawValue, props.suffixValue)),
                ]),
                h('div', { class: 'mt-3' }, [h(ProgressBar, { value: barValue })]),
              ]);
            })),
      ]),
    ]);
  },
});

const toast = useToast();
const { getMetricsDashboard } = useMetricsApi();
const selectedDays = ref(30);
const isLoading = ref(false);
const metrics = ref<any>({
  summary: {},
  modules: [],
  submodules: [],
  most_active_users: [],
  last_activity_by_user: [],
  user_module_usage: [],
  roles: [],
  clients: [],
  peak_hours: [],
  daily_usage: [],
  low_usage_modules: [],
  low_usage_submodules: [],
  technical_details: {
    errors: [],
    slow_requests: [],
    critical_actions: [],
  },
});

const GroupedMetricPanel = defineComponent({
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    groups: { type: Array as () => MetricGroup[], required: true },
    valueKey: { type: String, required: true },
    valueLabel: { type: String, required: true },
    suffixValue: { type: String, default: '' },
    tone: { type: String, default: 'blue' },
  },
  setup(props) {
    const toneClasses: Record<string, string> = {
      blue: 'from-azulIENM to-sky-500',
      amber: 'from-amber-400 to-orange-500',
      violet: 'from-violet-500 to-indigo-700',
      cyan: 'from-cyan-400 to-sky-700',
    };

    return () => h('section', { class: 'metrics-scroll-card relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100' }, [
      h('div', { class: `h-1.5 bg-gradient-to-r ${toneClasses[props.tone] ?? toneClasses.blue}` }),
      h('div', { class: 'p-4 sm:p-5' }, [
        h('div', { class: 'flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between' }, [
          h('div', [
            h('h2', { class: 'text-base font-black text-slate-900' }, props.title),
            h('p', { class: 'mt-1 text-sm text-slate-500' }, props.subtitle),
          ]),
          h('span', { class: 'mt-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 sm:mt-0' }, props.valueLabel),
        ]),
        props.groups.length === 0
          ? h(EmptyState, { text: 'Sin datos registrados para este periodo.' })
          : h('div', { class: 'metrics-scroll mt-4 h-72 space-y-3 overflow-y-scroll pr-4' }, props.groups.map((group) => h('section', { class: 'rounded-2xl border border-slate-100 bg-slate-50/70 p-3' }, [
              h('h3', { class: 'text-xs font-black uppercase tracking-wide text-slate-500' }, group.module),
              h('div', { class: 'mt-2 space-y-2' }, group.items.map((item: any, index: number) => {
                const rawValue = item[props.valueKey] ?? 0;
                const numericValue = parseMetricNumber(rawValue);
                const maxValue = Math.max(...group.items.map((entry: any) => parseMetricNumber(entry[props.valueKey])), 1);
                const barValue = props.suffixValue === '%' ? numericValue : (numericValue / maxValue) * 100;

                return h('article', { class: 'rounded-xl bg-white p-3 ring-1 ring-slate-100 transition hover:bg-sky-50/60' }, [
                  h('div', { class: 'flex items-start justify-between gap-4' }, [
                    h('div', { class: 'min-w-0' }, [
                      h('p', { class: 'truncate text-sm font-bold text-slate-800' }, `${index + 1}. ${item.submodule}`),
                      h('p', { class: 'mt-1 text-xs text-slate-400' }, props.valueLabel),
                    ]),
                    h('p', { class: 'text-right text-base font-black text-slate-900' }, formatMetricValue(rawValue, props.suffixValue)),
                  ]),
                  h('div', { class: 'mt-3' }, [h(ProgressBar, { value: barValue })]),
                ]);
              })),
            ]))),
      ]),
    ]);
  },
});

const primaryCards = computed(() => [
  {
    label: 'Usuarios activos',
    value: metrics.value.summary?.active_users ?? 0,
    accent: 'bg-sky-500',
    description: 'Usuarios con actividad registrada en el periodo.',
  },
  {
    label: 'Clientes activos',
    value: metrics.value.summary?.active_clients ?? 0,
    accent: 'bg-emerald-500',
    description: 'Clientes con actividad operativa registrada.',
  },
  {
    label: 'Actividades por submódulo',
    value: metrics.value.summary?.total_requests ?? 0,
    accent: 'bg-amber-400',
    description: 'Actividades totales asociadas al uso funcional.',
  },
  {
    label: 'Submódulo más usado',
    value: metrics.value.submodules?.[0]?.label ?? 'Sin datos',
    accent: 'bg-cyan-500',
    description: 'Submódulo con mayor cantidad de actividades.',
  },
]);

const groupSubmodulesByModule = (items: any[] = []): MetricGroup[] => {
  const groups = new Map<string, any[]>();

  items.forEach((item) => {
    if (!item?.module || !item?.submodule) return;
    if (!groups.has(item.module)) groups.set(item.module, []);
    groups.get(item.module)?.push(item);
  });

  return Array.from(groups.entries()).map(([module, groupItems]) => ({
    module,
    items: groupItems,
  }));
};

const groupedSubmodules = computed(() => groupSubmodulesByModule(metrics.value.submodules));
const groupedLowUsageSubmodules = computed(() => groupSubmodulesByModule(metrics.value.low_usage_submodules));

const technicalCards = computed<TechnicalCard[]>(() => [
  {
    label: 'Errores por módulo',
    value: metrics.value.summary?.total_errors ?? 0,
    description: 'Respuestas HTTP fallidas detectadas durante la actividad.',
  },
  {
    label: 'Requests lentos',
    value: metrics.value.summary?.slow_requests ?? 0,
    description: 'Requests que superaron el umbral operativo definido.',
  },
]);

const loadMetrics = async () => {
  isLoading.value = true;
  const result = await getMetricsDashboard(selectedDays.value);

  if (result.success) {
    metrics.value = result.data;
  } else {
    toast.add({ severity: 'error', summary: result.title, detail: result.message, life: 5000 });
  }

  isLoading.value = false;
};

loadMetrics();

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  requiresAuth: true,
});
</script>

<style scoped>
.metrics-scroll {
  position: relative;
  scrollbar-color: rgba(0, 124, 187, 0.45) transparent;
  scrollbar-width: thin;
  scrollbar-gutter: stable;
}

.metrics-scroll:hover,
.metrics-scroll-card:hover .metrics-scroll {
  scrollbar-color: #007cbb #e2e8f0;
}

.metrics-scroll::-webkit-scrollbar {
  width: 8px;
}

.metrics-scroll::-webkit-scrollbar-track {
  background: rgba(226, 232, 240, 0.45);
  border-radius: 999px;
}

.metrics-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 124, 187, 0.45);
  border-radius: 999px;
}

.metrics-scroll-card::after {
  content: '';
  pointer-events: none;
  position: absolute;
  right: 0.75rem;
  top: 5.25rem;
  bottom: 1.5rem;
  width: 4px;
  border-radius: 999px;
  background: linear-gradient(to bottom, rgba(0, 124, 187, 0.16), rgba(0, 124, 187, 0.75), rgba(0, 124, 187, 0.16));
  opacity: 0;
  transition: opacity 180ms ease;
  z-index: 10;
}

.metrics-scroll-card-compact::after {
  top: 3.5rem;
  bottom: 1rem;
}

.metrics-scroll-card:hover::after {
  opacity: 1;
}

.metrics-scroll:hover::-webkit-scrollbar-track,
.metrics-scroll-card:hover .metrics-scroll::-webkit-scrollbar-track {
  background: #e2e8f0;
}

.metrics-scroll:hover::-webkit-scrollbar-thumb,
.metrics-scroll-card:hover .metrics-scroll::-webkit-scrollbar-thumb {
  background: #007cbb;
}

</style>
