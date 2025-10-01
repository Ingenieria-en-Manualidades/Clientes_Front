<template>
  <PolicyModal
    :open="open"
    :version="version ?? ''"
    :content="content ?? ''"
    :format="'markdown'"
    @close="handleClose"
    @accept="handleAccept"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PolicyModal from '../components/PolicyModal.vue'
import { usePolicy } from '../composables/usePolicy'

/**
 * Props:
 * - blockApp: si es true, no hace nada al cerrar (obliga a aceptar).
 * - autoCheck: si es true, ejecuta la validación al montar.
 */
const props = withDefaults(defineProps<{
  blockApp?: boolean
  autoCheck?: boolean
}>(), {
  blockApp: true,
  autoCheck: true
})

// ← del composable: EXACTAMENTE estos refs y métodos
const { accepted, version, content, fetchStatus, fetchPolicy, accept } = usePolicy()

const open = ref(false)

const run = async () => {
  try {
    // 1) consultar estado
    await fetchStatus()
    // 2) si no ha aceptado, traer contenido y abrir modal
    if (!accepted.value) {
      await fetchPolicy()
      open.value = true
    }
  } catch (e) {
    // 401 o errores de red: no bloqueamos la navegación aquí
    console.error('PolicyGate: error verificando política', e)
  }
}

onMounted(async () => {
  if (props.autoCheck) await run()
})

const handleClose = () => {
  if (props.blockApp) return // obliga a aceptar
  open.value = false
}

const handleAccept = async () => {
  try {
    await accept()   // guarda aceptación en backend; accepted.value = true
    open.value = false
  } catch (e) {
    console.error('PolicyGate: error guardando aceptación', e)
    // aquí puedes disparar tu toast estándar
  }
}
</script>
