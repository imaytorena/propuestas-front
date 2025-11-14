// Utilidades relacionadas con personas/usuarios/miembros
// Diseñadas para datos parcialmente inconsistentes provenientes del backend.

export function getPersonaNombre(m: any): string {
  const c = m?.cuenta ?? m
  const nombre = c?.nombre || ''
  const apellido = c?.apellido || ''
  const compuesto = [nombre, apellido].filter(Boolean).join(' ').trim()
  return compuesto || c?.identificador || c?.username || c?.correo || `Usuario ${c?.id ?? m?.cuentaId ?? ''}`
}

export function getPersonaCorreo(m: any): string {
  const c = m?.cuenta ?? m
  return c?.correo || ''
}

export function getInicial(texto?: string | null): string {
  if (!texto || typeof texto !== 'string') return 'U'
  const t = texto.trim()
  return t ? t.charAt(0).toUpperCase() : 'U'
}
