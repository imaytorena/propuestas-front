// Utilidades de fecha y hora reutilizables (Svelte-agnósticas)
// Nota: mantener mensajes y nombres en español para facilitar mantenimiento.

export function toYMD(input: any): string {
  if (!input) return ''
  const d = new Date(input)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function toHHmm(input: any): string {
  if (!input) return ''
  const s = String(input)
  const m = s.match(/^(\d{1,2}):(\d{2})/)
  if (!m) return ''
  const hh = m[1].padStart(2, '0')
  const mm = m[2]
  return `${hh}:${mm}`
}

export function formatDateHuman(input: any, locale: string = 'es-MX'): string {
  if (!input) return 'Sin fecha'
  const d = new Date(input)
  if (isNaN(d.getTime())) return 'Fecha inválida'
  try {
    return d.toLocaleDateString(locale, { dateStyle: 'medium' } as any)
  } catch {
    return toYMD(d)
  }
}

export function todayYMD(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function groupByDate<T>(items: T[], pickDate: (t: T) => string | Date | null | undefined): [string, T[]][] {
  const acc: Record<string, T[]> = {}
  for (const it of items ?? []) {
    const raw = pickDate(it)
    const key = raw instanceof Date ? toYMD(raw) : toYMD(raw as any)
    if (!key) continue
    if (!acc[key]) acc[key] = []
    acc[key].push(it)
  }
  return Object.entries(acc).sort(([a], [b]) => a.localeCompare(b))
}

export function pickActDateRaw(a: any): any {
  return a?.fecha ?? a?.date ?? a?.fechaActividad ?? a?.activityDate ?? null
}

export function pickActTimeRaw(a: any): any {
  return a?.horario ?? a?.hora ?? a?.time ?? a?.horaActividad ?? a?.activityTime ?? ''
}

export function actStatus(a: any): { label: string; cls: string } {
  const ymd = toYMD(pickActDateRaw(a))
  if (!ymd) return { label: 'Sin fecha', cls: 'badge-ghost' }
  const today = todayYMD()
  if (ymd === today) return { label: 'Hoy', cls: 'badge-warning' }
  if (ymd > today) return { label: 'Próximamente', cls: 'badge-info' }
  return { label: 'Finalizada', cls: 'badge-ghost' }
}

export function sortActsByDate(arr: any[]): any[] {
  return (arr ?? []).slice().sort((a: any, b: any) => {
    const ad = toYMD(pickActDateRaw(a))
    const bd = toYMD(pickActDateRaw(b))
    if (!ad && !bd) return 0
    if (!ad) return 1
    if (!bd) return -1
    return ad.localeCompare(bd)
  })
}
