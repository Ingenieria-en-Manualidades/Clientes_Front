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

const props = withDefaults(defineProps<{
  blockApp?: boolean
  autoCheck?: boolean
}>(), {
  blockApp: true,
  autoCheck: true
})

const { accepted, version, content, fetchStatus, fetchPolicy, accept } = usePolicy()

const open = ref(false)

const ensurePolicy = async () => {
  try {
    await fetchStatus()
    if (!accepted.value) {
      await fetchPolicy()
      open.value = true
    }
  } catch (e) {
    // 401 u otros: no bloqueamos navegación
    console.error('PolicyGate: error verificando política', e)
  }
}

onMounted(async () => {
  if (props.autoCheck) await ensurePolicy()
})

const handleClose = () => {
  if (props.blockApp) return // obligar a aceptar
  open.value = false
}

const handleAccept = async () => {
  try {
    await accept()
    open.value = false
  } catch (e) {
    console.error('PolicyGate: error guardando aceptación', e)
  }
}
</script>
