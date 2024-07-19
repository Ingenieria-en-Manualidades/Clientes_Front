import { ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'

export function usarCookies() {
  const cookies = useCookies()
  const token = ref(cookies.get('token') || null)
  const idCliente = ref(cookies.get('idCliente') || '');
  const usuario = ref(cookies.get('usuario') || '')

  const setToken = (nuevoToken: string) => {
    token.value = nuevoToken
    cookies.set('token', nuevoToken, {path: '/', maxAge: 60 * 60 * 24 * 7 }) // Cookie expira en una semana
  }

  const setUsuario = (nuevoUsuario: string) => {
    usuario.value = nuevoUsuario
    cookies.set('usuario', nuevoUsuario, { path: '/remisiones', maxAge: 60 * 60 * 24 * 7 }) // Cookie expira en una semana
  }

  const setIDCliente = (nuevoID: string) => {
    idCliente.value = nuevoID
    cookies.set('idCliente', nuevoID, { path: '/', maxAge: 60 * 60 * 24 * 7 }) // Cookie expira en una semana
  }

  const borrarDatos = () => {
    token.value = ''
    usuario.value = ''
    idCliente.value = ''
    cookies.remove('token')
    cookies.remove('usuario')
    cookies.remove('idCliente')
  }

  return {
    token,
    usuario,
    idCliente,
    setToken,
    setUsuario,
    setIDCliente,
    borrarDatos
  }
}