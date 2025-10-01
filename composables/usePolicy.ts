
import { ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app';


export type PolicyPayload = {
    version: string
    format: 'markdown' | 'html'
    content: string
}

export const usePolicy = () => {


    const config = useRuntimeConfig();
    const url = config.public.apiBackendCliente;


    const accepted = ref<boolean | null>(null)
    const version = ref<string | null>(null)
    const content = ref<string>('')

    const fetchStatus = async () => {
        const { data, error } = await useFetch('/api/policy/status', { method: 'GET' })
        if (error.value) throw error.value
        accepted.value = data.value?.accepted ?? false
        version.value = data.value?.version ?? null
    }

    const fetchPolicy = async () => {
        const { data, error } = await useFetch<PolicyPayload>('/api/policy', { method: 'GET' })
        if (error.value) throw error.value
        version.value = data.value?.version ?? null
        content.value = data.value?.content ?? ''
        return { version: version.value, content: content.value }
    }

    const accept = async () => {
        const { data, error } = await useFetch('/api/policy/accept', { method: 'POST' })
        if (error.value) throw error.value
        accepted.value = true
        return data.value
    }

    return { accepted, version, content, fetchStatus, fetchPolicy, accept }
}
