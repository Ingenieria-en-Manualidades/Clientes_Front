import { useCookie, useRuntimeConfig } from 'nuxt/app'
import { useState } from 'nuxt/app';

type PolicyStatus = { version: string; accepted: boolean }
type PolicyPayload = { version: string; format: 'markdown' | 'html'; content: string }

export const usePolicy = () => {
  const config = useRuntimeConfig()
  const base = config.public.apiBackendCliente // ej: http://127.0.0.1:8000/
  const token = useCookie<string | null>('token')

  // estado compartido en la app
  const accepted = useState<boolean | null>('policyAccepted', () => null)
  const version  = useState<string | null>('policyVersion',  () => null)
  const content  = useState<string>('policyContent',         () => '')

  // headers con Bearer si hay token
  const authHeaders = () => ({
    'Accept': 'application/json',
    ...(token.value ? { 'Authorization': `Bearer ${token.value}` } : {}),
  })

  /** 1) Estado de aceptación */
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${base}api/policy/status`, { method: 'GET', headers: authHeaders() })
      const data: any = await res.json().catch(() => ({}))
      if (!res.ok) {
        accepted.value = null
        return { success: false, title: 'No autenticado', message: data?.message ?? 'Sin sesión' }
      }
      const parsed: PolicyStatus = { version: data.version, accepted: !!data.accepted }
      accepted.value = parsed.accepted
      version.value  = parsed.version
      return { success: true, title: '', message: '', data: parsed }
    } catch (e) {
      return { success: false, title: 'Error', message: 'Fallo al consultar estado de política' }
    }
  }

  /** 2) Contenido de la política */
  const fetchPolicy = async () => {
    try {
      const res = await fetch(`${base}api/policy`, { method: 'GET', headers: authHeaders() })
      const data: any = await res.json().catch(() => ({}))
      if (!res.ok) {
        return { success: false, title: 'Error', message: data?.message ?? 'No fue posible obtener la política' }
      }
      version.value = data.version ?? version.value
      content.value = data.content ?? ''
      return { success: true, title: '', message: '', data: data as PolicyPayload }
    } catch {
      return { success: false, title: 'Error', message: 'Fallo al obtener la política' }
    }
  }

  /** 3) Registrar aceptación */
  const accept = async () => {
    try {
      const res = await fetch(`${base}api/policy/accept`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: '{}' // body vacío, por si tu backend espera JSON
      })
      const data: any = await res.json().catch(() => ({}))
      if (!res.ok) {
        return { success: false, title: 'Error', message: data?.message ?? 'No se pudo registrar la aceptación' }
      }
      accepted.value = true
      version.value  = data.version ?? version.value
      return { success: true, title: '', message: '' }
    } catch {
      return { success: false, title: 'Error', message: 'Fallo al registrar aceptación' }
    }
  }

  return { accepted, version, content, fetchStatus, fetchPolicy, accept }
}
