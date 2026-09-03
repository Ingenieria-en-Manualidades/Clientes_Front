<template>
  <div class="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-5">
    <title>Monthly Metrics</title>

    <section class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
      <div class="flex flex-col gap-5 p-5 sm:p-6">
        <div class="border-l-4 border-azulIENM pl-4 sm:pl-5">
          <span class="text-xs font-black uppercase tracking-[0.22em] text-azulIENM">Administración</span>
          <h1 class="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">Monthly Metrics</h1>
        </div>

        <div class="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-3 shadow-inner">
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(190px,1fr)_minmax(190px,1fr)_auto_auto] lg:items-end">
            <label class="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
              <span class="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Desde</span>
              <Calendar
                v-model="selectedFromDate"
                date-format="dd/mm/yy"
                :manual-input="false"
                :show-on-focus="false"
                show-icon
                show-button-bar
                class="mt-1 w-full"
                input-class="w-full cursor-default bg-transparent text-sm font-bold text-slate-800 outline-none"
                @date-select="loadMonthlyMetrics"
              />
            </label>

            <label class="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
              <span class="block text-[11px] font-bold uppercase tracking-wide text-slate-400">Hasta</span>
              <Calendar
                v-model="selectedToDate"
                date-format="dd/mm/yy"
                :manual-input="false"
                :show-on-focus="false"
                show-icon
                show-button-bar
                class="mt-1 w-full"
                input-class="w-full cursor-default bg-transparent text-sm font-bold text-slate-800 outline-none"
                @date-select="loadMonthlyMetrics"
              />
            </label>

            <button type="button" class="min-h-[54px] rounded-2xl bg-azulIENM px-5 py-3 text-sm font-black text-white shadow-sm transition hover:brightness-95 disabled:opacity-60 sm:col-span-1" :disabled="isLoading" @click="loadMonthlyMetrics">
              {{ isLoading ? 'Actualizando' : 'Actualizar' }}
            </button>

            <button type="button" class="min-h-[54px] rounded-2xl bg-amarilloIENM px-5 py-3 text-sm font-black text-slate-950 shadow-sm transition hover:brightness-95 disabled:opacity-60 sm:col-span-1" :disabled="rows.length === 0" @click="downloadExcel">
              Descargar Excel
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p class="text-xs font-black uppercase tracking-wide text-slate-400">Actividades del periodo</p>
        <p class="mt-3 text-3xl font-black text-slate-950">{{ totalAccesses }}</p>
        <p class="mt-2 text-xs font-bold text-slate-400">{{ selectedCutoffLabel }}</p>
      </article>
      <article class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p class="text-xs font-black uppercase tracking-wide text-slate-400">Clientes activos</p>
        <p class="mt-3 text-3xl font-black text-slate-950">{{ summary.clients_count }}</p>
        <p class="mt-2 truncate text-xs font-bold text-slate-400">Top: {{ summary.top_client ?? 'Sin datos' }}</p>
      </article>
      <article class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p class="text-xs font-black uppercase tracking-wide text-slate-400">Módulos usados</p>
        <p class="mt-3 text-3xl font-black text-slate-950">{{ summary.modules_count }}</p>
        <p class="mt-2 truncate text-xs font-bold text-slate-400">Top: {{ summary.top_module ?? 'Sin datos' }}</p>
      </article>
      <article class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p class="text-xs font-black uppercase tracking-wide text-slate-400">Usuarios activos</p>
        <p class="mt-3 text-3xl font-black text-slate-950">{{ summary.users_count }}</p>
        <p class="mt-2 text-xs font-bold text-slate-400">Con actividad en el rango</p>
      </article>
    </section>

    <section class="mt-5 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label class="rounded-2xl border border-slate-200 px-4 py-3">
          <span class="block text-[11px] font-black uppercase tracking-wide text-slate-400">Cliente</span>
          <select v-model="selectedClient" class="mt-2 w-full bg-transparent text-sm font-bold text-slate-800 outline-none">
            <option value="">Todos</option>
            <option v-for="client in clientOptions" :key="client" :value="client">{{ client }}</option>
          </select>
        </label>

        <label class="rounded-2xl border border-slate-200 px-4 py-3">
          <span class="block text-[11px] font-black uppercase tracking-wide text-slate-400">Módulo</span>
          <select v-model="selectedModule" class="mt-2 w-full bg-transparent text-sm font-bold text-slate-800 outline-none">
            <option value="">Todos</option>
            <option v-for="module in moduleOptions" :key="module" :value="module">{{ module }}</option>
          </select>
        </label>

        <label class="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2 xl:col-span-2">
          <span class="block text-[11px] font-black uppercase tracking-wide text-slate-400">Buscar</span>
          <input v-model="search" type="search" placeholder="Usuario, cliente o módulo" class="mt-2 w-full bg-transparent text-sm font-bold text-slate-800 outline-none" />
        </label>
      </div>
    </section>

    <section class="mt-5 overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
      <div class="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-black text-slate-950">Uso por cliente y módulo</h2>
          <p class="mt-1 text-sm text-slate-500">Expande un cliente para ver módulos; expande un módulo para auditar usuarios.</p>
        </div>
        <button type="button" class="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-600" @click="collapseAll">
          Contraer todo
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-sm font-semibold text-slate-500">Cargando métricas del periodo...</div>
      <div v-else-if="filteredClients.length === 0" class="p-8 text-center text-sm font-semibold text-slate-500">Sin datos registrados para este filtro.</div>

      <div v-else class="divide-y divide-slate-100">
        <article v-for="client in filteredClients" :key="client.client" class="bg-white">
          <button type="button" class="flex w-full flex-col gap-3 px-5 py-4 text-left transition hover:bg-sky-50/60 sm:flex-row sm:items-center sm:justify-between" @click="toggleClient(client.client)">
            <div class="min-w-0">
              <p class="truncate text-base font-black text-slate-950">{{ expandedClients.has(client.client) ? '▾' : '▸' }} {{ client.client }}</p>
              <p class="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                {{ client.modules_count }} módulos · {{ client.users_count }} usuarios con actividad
              </p>
            </div>
            <div class="flex items-center gap-5 text-right">
              <div>
                <p class="text-xs font-black uppercase text-slate-400">Actividades</p>
                <p class="text-lg font-black text-slate-950">{{ client.accesses }}</p>
              </div>
              <div>
                <p class="text-xs font-black uppercase text-slate-400">Uso</p>
                <p class="text-lg font-black text-azulIENM">{{ client.percentage }}%</p>
              </div>
            </div>
          </button>

          <div v-if="expandedClients.has(client.client)" class="overflow-x-auto bg-slate-50/70 px-5 pb-5">
            <table class="min-w-full text-left text-sm">
              <thead class="text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-4 py-3">Módulo</th>
                  <th class="px-4 py-3 text-right">Usuarios activos</th>
                  <th class="px-4 py-3 text-right">Actividades</th>
                  <th class="px-4 py-3 text-right">Uso cliente</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 rounded-2xl bg-white">
                <template v-for="module in client.modules" :key="`${client.client}-${module.module}`">
                  <tr class="cursor-pointer hover:bg-sky-50" @click="toggleModule(client.client, module.module)">
                    <td class="px-4 py-3 font-black text-slate-800">{{ expandedModules.has(moduleKey(client.client, module.module)) ? '▾' : '▸' }} {{ module.module }}</td>
                    <td class="px-4 py-3 text-right font-bold text-slate-600">{{ module.users_count }}</td>
                    <td class="px-4 py-3 text-right font-black text-slate-950">{{ module.accesses }}</td>
                    <td class="px-4 py-3 text-right font-bold text-azulIENM">{{ module.percentage }}%</td>
                  </tr>
                  <tr v-if="expandedModules.has(moduleKey(client.client, module.module))">
                    <td colspan="4" class="bg-white px-4 pb-4">
                      <div class="overflow-x-auto rounded-2xl border border-slate-100">
                        <table class="min-w-full text-left text-xs">
                          <thead class="bg-slate-100 font-black uppercase tracking-wide text-slate-500">
                            <tr>
                              <th class="px-4 py-3">Usuario</th>
                              <th class="px-4 py-3 text-right">Actividades</th>
                              <th class="px-4 py-3 text-right">Uso módulo</th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-slate-100">
                            <tr v-for="user in module.users" :key="`${client.client}-${module.module}-${user.user}`">
                              <td class="px-4 py-3 font-bold text-slate-700">{{ user.user }}</td>
                              <td class="px-4 py-3 text-right font-black text-slate-950">{{ user.accesses }}</td>
                              <td class="px-4 py-3 text-right font-bold text-azulIENM">{{ user.percentage }}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue/usetoast';
import { useMetricsApi } from '../../composables/administration/metricsApi';

type MonthlyMetricRow = {
  user_id: number | null;
  user: string;
  user_name: string;
  document_number: string | null;
  client: string;
  module: string;
  submodule: string;
  action: string;
  method: string;
  route: string;
  accesses: number;
  percentage: number;
};

type MonthlyUser = {
  user_id: number | null;
  user: string;
  user_name: string;
  accesses: number;
  percentage: number;
};

type MonthlyModule = {
  module: string;
  users_count: number;
  accesses: number;
  percentage: number;
  users: MonthlyUser[];
};

type MonthlyClient = {
  client: string;
  users_count: number;
  modules_count: number;
  accesses: number;
  percentage: number;
  modules: MonthlyModule[];
};

type MonthlySummary = {
  clients_count: number;
  modules_count: number;
  users_count: number;
  top_client: string | null;
  top_module: string | null;
};

const emptySummary = (): MonthlySummary => ({
  clients_count: 0,
  modules_count: 0,
  users_count: 0,
  top_client: null,
  top_module: null,
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const getMonthStart = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const formatDateValue = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const moduleKey = (client: string, module: string) => `${client}::${module}`;

const toast = useToast();
const { getMonthlyMetrics } = useMetricsApi();
const selectedFromDate = ref(getMonthStart(new Date()));
const selectedToDate = ref(new Date());
const search = ref('');
const selectedClient = ref('');
const selectedModule = ref('');
const isLoading = ref(false);
const rows = ref<MonthlyMetricRow[]>([]);
const clients = ref<MonthlyClient[]>([]);
const summary = ref<MonthlySummary>(emptySummary());
const totalAccesses = ref(0);
const expandedClients = ref(new Set<string>());
const expandedModules = ref(new Set<string>());

const selectedFrom = computed(() => formatDateValue(selectedFromDate.value));
const selectedTo = computed(() => formatDateValue(selectedToDate.value));

const selectedCutoffLabel = computed(() => {
  return `${formatDate(selectedFromDate.value)} - ${formatDate(selectedToDate.value)}`;
});

const clientOptions = computed(() => clients.value.map((client) => client.client));

const moduleOptions = computed(() => {
  return [...new Set(clients.value.flatMap((client) => client.modules.map((module) => module.module)))].sort();
});

const filteredRows = computed(() => {
  const term = search.value.trim().toLowerCase();

  return rows.value.filter((row) => {
    const matchesSearch = !term
      || row.user.toLowerCase().includes(term)
      || row.user_name.toLowerCase().includes(term)
      || row.client.toLowerCase().includes(term)
      || row.module.toLowerCase().includes(term)
      || row.submodule.toLowerCase().includes(term)
      || row.action.toLowerCase().includes(term)
      || row.route.toLowerCase().includes(term);
    const matchesClient = !selectedClient.value || row.client === selectedClient.value;
    const matchesModule = !selectedModule.value || row.module === selectedModule.value;

    return matchesSearch && matchesClient && matchesModule;
  });
});

const filteredClients = computed(() => {
  const term = search.value.trim().toLowerCase();
  const visibleClients = clients.value
    .filter((client) => !selectedClient.value || client.client === selectedClient.value)
    .map((client) => {
      const modules = client.modules
        .filter((module) => !selectedModule.value || module.module === selectedModule.value)
        .map((module) => {
          const users = term
            ? module.users.filter((user) => user.user.toLowerCase().includes(term) || user.user_name.toLowerCase().includes(term) || module.module.toLowerCase().includes(term) || client.client.toLowerCase().includes(term))
            : module.users;

          return { ...module, users };
        })
        .filter((module) => module.users.length > 0 || module.module.toLowerCase().includes(term) || client.client.toLowerCase().includes(term));

      return {
        ...client,
        modules,
        modules_count: modules.length,
        users_count: new Set(modules.flatMap((module) => module.users.map((user) => user.user_id))).size || client.users_count,
      };
    })
    .filter((client) => client.modules.length > 0);

  return visibleClients;
});

const toggleClient = (client: string) => {
  const next = new Set(expandedClients.value);
  next.has(client) ? next.delete(client) : next.add(client);
  expandedClients.value = next;
};

const toggleModule = (client: string, module: string) => {
  const key = moduleKey(client, module);
  const next = new Set(expandedModules.value);
  next.has(key) ? next.delete(key) : next.add(key);
  expandedModules.value = next;
};

const collapseAll = () => {
  expandedClients.value = new Set();
  expandedModules.value = new Set();
};

const loadMonthlyMetrics = async () => {
  if (selectedFromDate.value > selectedToDate.value) {
    rows.value = [];
    clients.value = [];
    summary.value = emptySummary();
    totalAccesses.value = 0;
    toast.add({ severity: 'warn', summary: 'Rango invalido', detail: 'La fecha desde no puede ser mayor que la fecha hasta.', life: 4000 });
    return;
  }

  isLoading.value = true;
  const result = await getMonthlyMetrics(selectedFrom.value, selectedTo.value);

  if (result.success) {
    rows.value = result.data?.rows ?? [];
    clients.value = result.data?.clients ?? [];
    summary.value = result.data?.summary ?? emptySummary();
    totalAccesses.value = result.data?.total_accesses ?? 0;
    collapseAll();
  } else {
    rows.value = [];
    clients.value = [];
    summary.value = emptySummary();
    totalAccesses.value = 0;
    toast.add({ severity: 'error', summary: result.title, detail: result.message, life: 5000 });
  }

  isLoading.value = false;
};

const downloadExcel = async () => {
  const XLSX = await import('xlsx');
  const workbook = XLSX.utils.book_new();
  const detailRows = rows.value.map((row) => ({
    Usuario: row.user,
    'Nombre de usuario': row.user_name,
    Desde: formatDate(selectedFromDate.value),
    Hasta: formatDate(selectedToDate.value),
    'Id de usuario': row.user_id,
    Cliente: row.client,
    Modulo: row.module,
    Submodulo: row.submodule,
    'Uso periodo (%)': row.percentage,
  }));

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(detailRows), 'Detalle');
  XLSX.writeFile(workbook, `monthly-metrics-${selectedFrom.value}-${selectedTo.value}.xlsx`);
};

loadMonthlyMetrics();

definePageMeta({
  layout: 'default',
  middleware: 'auth',
  requiresAuth: true,
});
</script>
