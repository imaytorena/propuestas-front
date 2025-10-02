<script lang="ts">
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'
  import Map from '../../lib/components/Map.svelte'

  type LatLng = { lat: number; lng: number }

  let comunidadId: string = ''
  let loading = $state(true)
  let error: string | null = $state(null)
  let comunidad: any = $state(null)

  // GeoJSON features para el mapa (mismo formato que Inicio)
  let features: any[] = $state([])

  // Normaliza un polígono que puede venir como array de arrays/objetos a LatLng[]
  function normalizePolygon(c: any): LatLng[] {
    const apiPoly = c?.poligono ?? c?.polygon ?? c?.area
    if (!Array.isArray(apiPoly)) return []
    const norm: LatLng[] = []
    for (const p of apiPoly) {
      if (p && typeof p.lat === 'number' && typeof p.lng === 'number') {
        norm.push({ lat: p.lat, lng: p.lng })
      } else if (Array.isArray(p) && p.length >= 2) {
        const a0 = Number(p[0])
        const a1 = Number(p[1])
        const looksLatLng = a0 >= -90 && a0 <= 90 && a1 >= -180 && a1 <= 180
        if (Number.isFinite(a0) && Number.isFinite(a1)) {
          norm.push(looksLatLng ? { lat: a0, lng: a1 } : { lat: a1, lng: a0 })
        }
      }
    }
    return norm
  }

  // Convierte la comunidad a una lista de GeoJSON Features para Map.svelte
  function comunidadToFeatures(c: any): any[] {
    if (!c) return []
    // Si ya viene como { features: [...] } úsalo tal cual
    if (Array.isArray(c?.features)) {
      return c.features
    }
    const pts = normalizePolygon(c)
    if (pts.length < 3) return []
    // GeoJSON usa [lng, lat]
    const ring: [number, number][] = pts.map((p) => [p.lng, p.lat])
    // Cerrar el anillo si es necesario
    const first = ring[0]
    const last = ring[ring.length - 1]
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push([first[0], first[1]])
    }
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ring]
      },
      properties: {
        id: c.id ?? c._id ?? '',
        nombre: c.nombre ?? 'Comunidad',
        municipio: c.municipio?.nombre ?? c.municipio ?? ''
      }
    }
    return [feature]
  }

  function getPolygonPointCount(fs: any[]): number {
    if (!Array.isArray(fs) || fs.length === 0) return 0
    const f = fs[0]
    const coords = f?.geometry?.type === 'Polygon' ? f.geometry.coordinates?.[0] : null
    return Array.isArray(coords) ? Math.max(0, coords.length - 1) : 0
  }

  async function loadComunidad() {
    if (!comunidadId) return
    loading = true
    error = null
    try {
      const { data } = await api.get(`/comunidades/${comunidadId}`)
      comunidad = data
      features = comunidadToFeatures(comunidad)
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
      loadComunidad()
    }
  })

  // Reconstruye features cuando cambie la comunidad (por si llega tarde)
  $effect(() => {
    features = comunidadToFeatures(comunidad)
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
<!--        <a-->
<!--          class="btn btn-primary btn-sm text-white"-->
<!--          href={`/comunidades/${comunidadId}/editar`}-->
<!--          onclick={goto}-->
<!--          aria-label="Editar comunidad"-->
<!--        >Editar</a>-->
        <a class="btn btn-ghost btn-sm" href="/comunidades" onclick={goto}>Volver</a>
      </nav>
    </header>

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
    </article>
  {/if}
</section>
