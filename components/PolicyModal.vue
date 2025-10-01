<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[1000]">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="onClose"></div>

      <!-- Card -->
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               w-[min(920px,95vw)] max-h-[85vh] bg-white rounded-2xl shadow-2xl
               flex flex-col"
      >
        <header class="px-5 pt-5 pb-3 border-b">
          <h2 class="text-xl font-semibold">Política de Tratamiento de Datos</h2>
          <p v-if="version" class="text-xs text-gray-500 mt-1">Versión: {{ version }}</p>
        </header>

        <section class="px-5 py-4 flex-1 overflow-auto">
          <!-- Si viene HTML, lo renderizamos; si no, lo mostramos como texto -->
          <div v-if="format === 'html'" class="prose max-w-none prose-sm" v-html="content"></div>
          <pre v-else class="whitespace-pre-wrap font-sans text-sm leading-6">{{ content }}</pre>
        </section>

        <footer class="px-5 py-4 border-t flex items-center justify-between gap-4">
          <label class="flex items-center gap-2 select-none">
            <input type="checkbox" v-model="checked" class="w-4 h-4" />
            <span>He leído y acepto la Política de Tratamiento de Datos.</span>
          </label>

          <div class="flex gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
              @click="onClose"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="px-4 py-2 rounded-full text-white transition-opacity"
              :class="checked ? 'bg-azulClaroIENM hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'"
              :disabled="!checked || loading"
              @click="onAccept"
            >
              {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  version?: string | null
  content?: string
  format?: 'markdown' | 'html'
}>(), {
  format: 'markdown'
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'accept'): void
}>()

const checked = ref(false)
const loading = ref(false)

watch(() => props.open, (o) => { if (o) { checked.value = false; loading.value = false } })

const onClose = () => emit('close')

const onAccept = async () => {
  if (!checked.value || loading.value) return
  loading.value = true
  try {
    emit('accept')
  } finally {
    loading.value = false
  }
}
</script>
