export default defineNuxtPlugin(() => {
  if (process.server) return

  // Evita inyectarlo 2 veces
  if (document.getElementById("tawkto-script")) return

  ;(window as any).Tawk_API = (window as any).Tawk_API || {}
  ;(window as any).Tawk_LoadStart = new Date()

  const s1 = document.createElement("script")
  s1.id = "tawkto-script"
  s1.async = true
  s1.src = "https://embed.tawk.to/6924841527ad1319611fc94c/1jara7stu"
  s1.charset = "UTF-8"
  s1.setAttribute("crossorigin", "*")

  document.head.appendChild(s1)
})
