import toast from '../lib/toast'
import { isAuthenticated } from '../stores/auth'
import page from 'page'

/**
 * Muestra un toast con enlace a login preservando el returnTo actual
 */
function showLoginToast(returnTo?: string) {
  const rt = encodeURIComponent(returnTo ?? (location.pathname + location.search))
  toast.push(`<strong>No hay usuario autenticado</strong><br>
    <a class="link" href="/auth/login?returnTo=${rt}">Iniciar sesión/Registrarse</a>`)
}

/**
 * Guardia para clicks que requieren autenticación.
 * - Si no hay sesión: previene la acción y muestra un toast con enlace a login.
 * - Si hay sesión: retorna true y deja continuar (no previene nada).
 *
 * Útil para botones o anchors. Devuelve `true` si puede continuar, `false` si se bloqueó.
 */
export function requireAuthClick(e?: Event, targetHref?: string): boolean {
  const authed = isAuthenticated()
  if (authed) return true
  try {
    e?.preventDefault?.()
    e?.stopPropagation?.()
  } catch {}
  const href = targetHref ?? (e?.currentTarget as HTMLAnchorElement | null)?.getAttribute?.('href') ?? undefined
  // El returnTo será la URL actual; el destino (href) es meramente contextual
  showLoginToast(location.pathname + location.search)
  return false
}

/**
 * Navegación protegida: si no hay sesión, muestra toast de login; si la hay, navega vía page.js
 */
export function guardedGoto(href: string, e?: MouseEvent) {
  if (!requireAuthClick(e as any, href)) return
  // Navegación SPA
  page.show(href)
}
