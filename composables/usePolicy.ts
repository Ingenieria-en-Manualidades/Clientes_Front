// ~/composables/usePolicy.ts
import { useRuntimeConfig } from 'nuxt/app'

type PolicyStatusResp = { version: string; accepted: boolean }
type PolicyResp = { version: string; format: 'markdown' | 'html'; content: string }
type AcceptResp = { ok: boolean; version: string }

export const usePolicy = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBackendCliente // e.g. https://api.tu-backend/  (sin olvidar trailing slash)

  // Estado global (persistente en app)
  const accepted = useState<boolean | null>('policyAccepted', () => null)
  const version  = useState<string | null>('policyVersion',  () => null)
  const content  = useState<string>('policyContent',         () => '')

  const common: RequestInit = {
    // Si usas Sanctum por cookies:
    credentials: 'include',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json'
    }
  }

  // 1) Estado de aceptación
  const fetchStatus = async () => {
    const res = await fetch(`${base}api/policy/status`, { method: 'GET', ...common })
    if (!res.ok) {
      // Si 401, deja accepted en null para no bloquear
      accepted.value = accepted.value ?? null
      return
    }
    const data: PolicyStatusResp = await res.json()
    accepted.value = !!data.accepted
    version.value  = data.version ?? null
  }

  // 2) Contenido de la política
  const fetchPolicy = async () => {
    const res = await fetch(`${base}api/policy`, { method: 'GET', ...common })
    if (!res.ok) return
    const data: PolicyResp = await res.json()
    version.value = data.version ?? version.value
    content.value = data.content ?? ''
  }

  // 3) Registrar aceptación
  const accept = async () => {
    const res = await fetch(`${base}api/policy/accept`, { method: 'POST', ...common })
    if (!res.ok) throw new Error('No se pudo registrar la aceptación')
    const data: AcceptResp = await res.json()
    accepted.value = true
    version.value  = data.version ?? version.value
  }

  return { accepted, version, content, fetchStatus, fetchPolicy, accept }
}
