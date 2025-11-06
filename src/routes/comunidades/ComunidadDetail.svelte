<script lang="ts">
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'
  import Map from '../../lib/components/Map.svelte'
  import { toPolygonFeatureFromAny } from '../../utils/geo'

  let comunidadId: string = ''
  let loading = $state(true)
  let error: string | null = $state(null)
  let comunidad: any = $state(null)

  // Usuario actual y membresía
  let me: any = $state(null)
  let joining = $state(false)
  let joinError: string | null = $state(null)
  let isMember = $state(false)

  // Propuestas relacionadas
  let propuestas: any[] = $state([])
  let loadingPropuestas = $state(false)
  let propuestasError: string | null = $state(null)

  // GeoJSON features para el mapa (formato "antiguo" [[[lng,lat],...]])
  let features: any[] = $state([])

  // Convierte la comunidad a una lista de GeoJSON Features para Map.svelte (formato legacy)
  function comunidadToFeatures(c: any): any[] {
    if (!c) return []
    // Si ya viene como Feature(s), intenta usarlo
    if (Array.isArray(c?.features)) {
      return c.features
    }
    const feature = toPolygonFeatureFromAny(c, {
      id: c?.id ?? c?._id ?? '',
      nombre: c?.nombre ?? 'Comunidad',
      municipio: c?.municipio?.nombre ?? c?.municipio ?? ''
    })
    return feature ? [feature] : []
  }

  function getPolygonPointCount(fs: any[]): number {
    if (!Array.isArray(fs) || fs.length === 0) return 0
    const f = fs[0]
    const coords = f?.geometry?.type === 'Polygon' ? f.geometry.coordinates?.[0] : null
    return Array.isArray(coords) ? Math.max(0, coords.length - 1) : 0
  }

  function sameId(a: any, b: any): boolean {
    const ax = a?.id ?? a?._id ?? a
    const bx = b?.id ?? b?._id ?? b
    return String(ax ?? '') === String(bx ?? '')
  }

  async function loadMe() {
    try {
      const { data } = await api.get('/usuarios/me')
      me = (data as any)?.data ?? data
    } catch {
      me = null
    }
  }

  function computeMembership() {
    try {
      const members = (comunidad?.miembros ?? comunidad?.members ?? comunidad?.usuarios ?? []) as any[]
      if (Array.isArray(members) && me) {
        isMember = members.some(m => sameId(m?.id ?? m?.usuarioId ?? m?.cuentaId ?? m?.userId, me?.id))
      } else {
        isMember = false
      }
    } catch {
      isMember = false
    }
  }

  async function joinCommunity() {
    if (!comunidadId) return
    joining = true
    joinError = null
    try {
      // Intento 1: endpoint join directo
      try {
        await api.post(`/comunidades/${comunidadId}/join`, {})
      } catch (e) {
        // Intento 2: crear miembro
        await api.post(`/comunidades/${comunidadId}/miembros`, {})
      }
      // Refrescar comunidad para actualizar miembros
      await loadComunidad()
    } catch (e: any) {
      joinError = e?.message ?? 'No se pudo unir a la comunidad'
    } finally {
      joining = false
    }
  }

  async function loadPropuestasRelacionadas() {
    if (!comunidadId) return
    loadingPropuestas = true
    propuestasError = null
    try {
      // Preferir endpoint directo bajo comunidad
      let list: any[] = []
      try {
        const { data: d1 }: any = await api.get(`/comunidades/${comunidadId}/propuestas`)
        list = (d1?.data ?? d1 ?? []) as any[]
      } catch {
        const { data: d2 }: any = await api.get(`/propuestas?comunidadId=${encodeURIComponent(comunidadId)}&limit=100`)
        list = (d2?.data ?? d2 ?? []) as any[]
      }
      propuestas = list
    } catch (e: any) {
      propuestasError = e?.message ?? 'Error cargando propuestas relacionadas'
    } finally {
      loadingPropuestas = false
    }
  }

  async function loadComunidad() {
    if (!comunidadId) return
    loading = true
    error = null
    try {
      const { data } = await api.get(`/comunidades/${comunidadId}`)
      // Desempaqueta payloads tipo { data: comunidad } o usa plano
      comunidad = (data as any)?.data ?? data
      features = comunidadToFeatures(comunidad)
      computeMembership()
      // Cargar propuestas relacionadas en paralelo (no bloquear)
      loadPropuestasRelacionadas()
    } catch (e: any) {
      error = e?.message ?? 'Error cargando comunidad'
    } finally {
      loading = false
    }
  }

  // Mantener comunidadId sincronizado con la ruta y recargar al cambiar
  $effect(() => {
    const id = $route.params.comunidadId
    if (id !== comunidadId) {
      comunidadId = id
      loadMe()
      loadComunidad()
    }
  })

  // Reconstruye features cuando cambie la comunidad (por si llega tarde)
  $effect(() => {
    features = comunidadToFeatures(comunidad)
    computeMembership()
  })
</script>

<section aria-labelledby="comunidad-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
  {#if loading}
    <article class="card bg-base-100 shadow-sm">
      <div class="card-body animate-pulse">
        <div class="h-6 w-2/3 rounded bg-base-200"></div>
        <div class="mt-3 h-4 w-full rounded bg-base-200"></div>
        <div class="mt-1 h-4 w-5/6 rounded bg-base-200"></div>
        <div class="mt-6 h-9 w-32 rounded bg-base-200"></div>
      </div>
    </article>
  {:else if error}
    <div role="alert" class="alert alert-error">
      <span>{error}</span>
      <div class="ml-auto">
        <button class="btn btn-sm" onclick={loadComunidad}>Reintentar</button>
      </div>
    </div>
  {:else if !comunidad}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Comunidad no encontrada.</p>
      <a class="btn" href="/comunidades" onclick={goto}>Volver a la lista</a>
    </div>
  {:else}
    <header class="mb-3 flex items-center justify-between gap-3">
      <h1 id="comunidad-heading" class="text-2xl font-semibold tracking-tight">
        {comunidad.nombre ?? `Comunidad ${comunidadId}`}
      </h1>
      <nav class="flex items-center gap-2">
        <a class="btn btn-ghost btn-sm" href="/comunidades" onclick={goto}>Volver</a>
      </nav>
    </header>

    <!-- Meta: creador y acción de unirse -->
    <div class="mb-4 flex flex-wrap items-center gap-3 text-sm text-base-content/70">
      {#if comunidad.creador || comunidad.usuario || comunidad.owner || comunidad.cuenta}
        {@const creador = comunidad.creador ?? comunidad.usuario ?? comunidad.owner ?? comunidad.cuenta}
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span>Creador: <span class="font-medium text-base-content">{creador.nombre ?? creador.identificador ?? creador.username ?? creador.email ?? 'Usuario'}</span></span>
        </div>
      {/if}

      {#if me && !isMember && !(comunidad.creador && (comunidad.creador.id === me?.id))}
        <button class="btn btn-sm btn-primary text-white" onclick={joinCommunity} disabled={joining} aria-label="Unirme a esta comunidad">
          {joining ? 'Uniendo…' : 'Unirme a esta comunidad'}
        </button>
      {:else if me && isMember}
        <span class="badge badge-success badge-outline">Miembro</span>
      {/if}
    </div>
    {#if joinError}
      <div role="alert" class="alert alert-error mb-4" aria-live="polite"><span>{joinError}</span></div>
    {/if}

    <article class="prose max-w-none space-y-3">
      {#if comunidad.descripcion}
        <p>{comunidad.descripcion}</p>
      {:else}
        <p class="text-base-content/70">Sin descripción.</p>
      {/if}

      <div class="not-prose mt-4 grid grid-cols-1 gap-3">
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body py-4">
            <div class="text-sm text-base-content/70">Categoría</div>
            <div class="mt-1 flex items-center gap-2">
              {#if comunidad.categoria || comunidad.tipo || (comunidad.categorias && comunidad.categorias.length)}
                <span class="inline-block h-3 w-3 rounded-full bg-primary"></span>
                <span class="font-medium">
                  {typeof (comunidad.categoria ?? comunidad.tipo ?? comunidad.categorias?.[0]) === 'string'
                    ? (comunidad.categoria ?? comunidad.tipo ?? comunidad.categorias?.[0])
                    : (comunidad.categoria?.nombre ?? comunidad.tipo?.nombre ?? comunidad.categorias?.[0]?.nombre)}
                </span>
              {:else}
                <span class="text-base-content/60">Sin categoría</span>
              {/if}
            </div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body py-4">
            <div class="text-sm text-base-content/70">Zona (polígono)</div>
            {#if Array.isArray(features) && features.length}
              <div class="mt-1 text-sm">
                {getPolygonPointCount(features)} puntos
              </div>
              <div class="mt-2">
                <div class="w-full h-full rounded-lg border border-base-300 overflow-hidden">
                  <Map colonias={features} onColoniaClick={() => {}} />
                </div>
              </div>
            {:else}
              <div class="mt-1 text-sm text-base-content/60">Sin definir</div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Propuestas relacionadas -->
      <div class="not-prose mt-6">
        <h2 class="text-xl font-semibold mb-3">Propuestas relacionadas</h2>
        {#if loadingPropuestas}
          <div class="text-sm text-base-content/60">Cargando propuestas…</div>
        {:else if propuestasError}
          <div role="alert" class="alert alert-error"><span>{propuestasError}</span></div>
        {:else if !propuestas || propuestas.length === 0}
          <div class="text-sm text-base-content/60">No hay propuestas en esta comunidad todavía.</div>
        {:else}
          <ul class="space-y-3">
            {#each propuestas as p}
              {@const pid = p?.id ?? p?._id}
              <li class="card bg-base-100 border border-base-300">
                <div class="card-body py-3">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <a href={`/propuestas/${pid}`} onclick={goto} class="link link-primary font-medium break-all">{p?.titulo ?? p?.title ?? `Propuesta ${pid}`}</a>
                      {#if p?.actividades}
                        {@const acts = Array.isArray(p.actividades) ? p.actividades : Object.values(p.actividades ?? {})}
                        {#if acts && acts.length}
                          <ul class="mt-2 space-y-1 text-sm text-base-content/80">
                            {#each acts as a}
                              <li class="flex items-center gap-2">
                                <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                <span class="break-all">{a?.nombre ?? a?.title ?? 'Actividad'}{#if a?.fecha} — {new Date(a.fecha).toLocaleDateString('es-MX')}{/if}{#if a?.horario} {a.horario}{/if}</span>
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      {/if}
                    </div>
                    <a href={`/propuestas/${pid}`} onclick={goto} class="btn btn-sm">Ver</a>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </article>
  {/if}
</section>
