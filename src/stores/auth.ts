// src/stores/auth.ts
// Lightweight auth/session store for JWT-based login
import { writable } from 'svelte/store'

export type AuthUser = {
  id?: string | number
  name?: string
  email?: string
  avatarUrl?: string
  [k: string]: any
}

export type Session = {
  token: string
  user?: AuthUser | null
}

const LS_KEY = 'qci.auth.session'

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to parse stored session', e)
    return null
  }
}

function persist(session: Session | null) {
  try {
    if (!session) localStorage.removeItem(LS_KEY)
    else localStorage.setItem(LS_KEY, JSON.stringify(session))
  } catch (e) {
    console.warn('Failed to persist session', e)
  }
}

const initial = typeof window !== 'undefined' ? loadSession() : null

export const session = writable<Session | null>(initial)

session.subscribe((s) => {
  if (typeof window === 'undefined') return
  persist(s)
})

export function setSession(token: string, user?: AuthUser | null) {
  session.set({ token, user: user ?? null })
}

export function clearSession() {
  session.set(null)
}

export function getToken(): string | null {
  let t: string | null = null
  const unsub = session.subscribe((s) => (t = s?.token ?? null))
  unsub()
  return t
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
