<script lang="ts">
  import { onMount } from 'svelte'
  import page from 'page'
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'
  import ActividadesForm from '../../lib/components/Actividades/ActividadesForm.svelte'
  import SvelteSelect from 'svelte-select'
  import '../../lib/components/Ideas/select.css'

  type ComunidadValue = { nombre: string; municipio?: string; lat?: number; lon?: number; lng?: number }
  type ComunidadOption = { id: number; label: string; value: ComunidadValue }

  let propuestaId: string = ''
  $: propuestaId = $route.params.propuestaId

  let title: string = ''
  let descripcion: string = ''
  let actividades: Array<{ nombre: string, descripcion: string, fecha: string, horario?: string }> = []
  let loading = true
  let saving = false
  let error: string | null = null
  let saveError: string | null = null
  let loaded = false

  // Selector de comunidad
  let selectedComunidad: ComunidadOption | null = null
  let comunidades: ComunidadOption[] = []
  let loadingComunidades: boolean = false

  function toNumber(n: any): number | undefined {
    const x = Number(n);
    return Number.isFinite(x) ? x : undefined
  }

  function getLatLon(item: any): { lat?: number; lon?: number } {
    const lat = toNumber(item?.lat ?? item?.latitude ?? item?.y ?? item?.latitud ?? item?.geom?.coordinates?.[1])
    const lon = toNumber(item?.lon ?? item?.lng ?? item?.long ?? item?.longitude ?? item?.x ?? item?.longitud ?? item?.geom?.coordinates?.[0])
    return {lat, lon}
  }

  async function searchByNombre(filterText: string) {
    if (filterText === '') return Promise.resolve()
    try {
      loadingComunidades = true
      const q = (filterText ?? '').trim()
      const url = q ? `/comunidades?limit=1200&nombre=${encodeURIComponent(q)}` : `/comunidades?limit=1200`
      const {data: res}: any = await api.get(url)
      const list: any[] = res?.data ?? res?.comunidades ?? res ?? []
      const mapped: ComunidadOption[] = list.map((it: any) => {
        const {lat, lon} = getLatLon(it)
        const nombre = it?.nombre ?? it?.name ?? it?.comunidad ?? 'Comunidad'
        const municipio = it?.municipio ?? it?.city ?? it?.municipality
        const label = `${nombre}${municipio ? ` (${municipio})` : ''}`
        return {id: it.id, label, value: {nombre, municipio, lat, lon}} as ComunidadOption
      })
      comunidades = mapped
      return mapped
    } catch (e) {
      console.error('Error buscando comunidades por nombre', e)
      return []
    } finally {
      loadingComunidades = false
    }
  }

  // Validación auxiliar para hora (si se proporciona)
  function isHoraValida(h?: string): boolean {
    if (!h) return true
    const [hours] = h.split(':').map(Number)
    return Number.isFinite(hours) && hours >= 7 && hours < 22
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  function toYMD(input: any): string {
    if (!input) return ''
    const d = new Date(input)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  }

  function toHHmm(input: any): string {
    if (!input) return ''
    const s = String(input)
    const m = s.match(/^(\d{2}):(\d{2})/)
    return m ? `${m[1]}:${m[2]}` : ''
  }

  async function loadPropuesta() {
    if (!propuestaId) return
    loading = true
    error = null
    try {
      const { data: p } = await api.get(`/propuestas/${propuestaId}`)
      const pr: any = (p as any)?.data ?? p
      title = pr?.title ?? pr?.titulo ?? ''
      descripcion = pr?.description ?? pr?.descripcion ?? ''
      // Actividades: soportar arreglo o objeto tipo mapa {"1": {...}, "2": {...}}
      const rawActs: any = pr?.actividades
      let actsArr: any[] = []
      if (Array.isArray(rawActs)) {
        actsArr = rawActs
      } else if (rawActs && typeof rawActs === 'object') {
        actsArr = Object.entries(rawActs)
          .filter(([_, v]) => v && typeof v === 'object')
          .sort((a: any, b: any) => Number(a[0]) - Number(b[0]))
          .map(([_, v]: any) => v)
      }
      actividades = actsArr.map((a: any) => ({
        nombre: a?.nombre ?? a?.title ?? '',
        descripcion: a?.descripcion ?? a?.description ?? '',
        fecha: toYMD(a?.fecha ?? a?.date ?? a?.fechaActividad ?? a?.activityDate),
        horario: toHHmm(a?.horario ?? a?.hora ?? a?.time ?? a?.horaActividad ?? a?.activityTime)
      }))
      // Comunidad preseleccionada (si viene en la propuesta)
      const cId = pr?.comunidadId ?? pr?.communityId ?? pr?.comunidad?.id
      const cNombre = pr?.comunidad?.nombre ?? pr?.comunidad?.name ?? pr?.comunidadNombre
      const cMunicipio = pr?.comunidad?.municipio ?? pr?.comunidad?.city ?? pr?.municipio
      if (cId && (cNombre || cMunicipio)) {
        const label = `${cNombre ?? 'Comunidad'}${cMunicipio ? ` (${cMunicipio})` : ''}`
        selectedComunidad = { id: cId, label, value: { nombre: cNombre ?? 'Comunidad', municipio: cMunicipio } }
      } else if (cId) {
        selectedComunidad = { id: cId, label: `Comunidad ${cId}`, value: { nombre: `Comunidad ${cId}` } }
      } else {
        selectedComunidad = null
      }
      loaded = true
    } catch (e: any) {
      error = e?.message ?? 'Error cargando propuesta'
    } finally {
      loading = false
    }
  }

  async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    event.preventDefault()
    if (!propuestaId) return
    saveError = null
    if (!title.trim()) {
      saveError = 'El título es obligatorio'
      return
    }
    if (!selectedComunidad?.id) {
      saveError = 'Selecciona una comunidad'
      return
    }
    if (actividades.length === 0) {
      saveError = 'Debe agregar al menos una actividad'
      return
    }
    for (const act of actividades) {
      if (!act.nombre?.trim() || !act.descripcion?.trim()) {
        saveError = 'Todas las actividades deben tener nombre y descripción'
        return
      }
      if (!act.fecha) {
        saveError = 'Cada actividad debe tener fecha'
        return
      }
      if (new Date(act.fecha) < new Date(today)) {
        saveError = 'La fecha de la actividad no puede ser anterior a hoy'
        return
      }
      if (!isHoraValida(act.horario)) {
        saveError = 'La hora debe estar entre 7:00 y 22:00 si se especifica'
        return
      }
    }
    saving = true
    try {
      const payload: any = {
        titulo: title,
        descripcion,
        comunidadId: selectedComunidad.id,
        actividades
      }
      await api.put(`/propuestas/${propuestaId}`, payload)
      page.show(`/propuestas/${propuestaId}`)
    } catch (e: any) {
      saveError = e?.message ?? 'No se pudo guardar'
    } finally {
      saving = false
    }
  }

  onMount(loadPropuesta)
</script>

<section aria-labelledby="edit-propuesta-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
  {#if loading}
    <article class="card bg-base-100 shadow-sm">
      <div class="card-body animate-pulse">
        <div class="h-6 w-2/3 rounded bg-base-200"></div>
        <div class="mt-3 h-4 w-full rounded bg-base-200"></div>
        <div class="mt-1 h-4 w-5/6 rounded bg-base-200"></div>
      </div>
    </article>
  {:else if error}
    <div role="alert" class="alert alert-error">
      <span>{error}</span>
      <div class="ml-auto">
        <button class="btn btn-sm" onclick={loadPropuesta}>Reintentar</button>
      </div>
    </div>
  {:else if !loaded}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Propuesta no encontrada.</p>
      <a class="btn" href="/propuestas" onclick={goto}>Volver a la lista</a>
    </div>
  {:else}
    <header class="mb-4 flex items-center justify-between gap-3">
      <h1 id="edit-propuesta-heading" class="text-2xl font-semibold tracking-tight">Editar propuesta {propuestaId}</h1>
      <a class="btn btn-ghost btn-sm" href={`/propuestas/${propuestaId}`} onclick={goto}>Cancelar</a>
    </header>

    <form class="space-y-4" onsubmit={save}>
      <div class="form-control">
        <label class="label" for="title">
          <span class="label-text">Título</span>
        </label>
        <input
          id="title"
          class="input input-bordered w-full"
          type="text"
          bind:value={title}
          placeholder="Título"
          required
          disabled={saving}
        />
      </div>

      <div class="form-control">
        <label class="label" for="descripcion">
          <span class="label-text">Descripción</span>
        </label>
        <textarea
          id="descripcion"
          class="textarea textarea-bordered w-full"
          rows="6"
          bind:value={descripcion}
          placeholder="Describe tu propuesta"
          disabled={saving}
        ></textarea>
        <div class="label">
          <span class="label-text-alt">Puedes usar texto libre.</span>
        </div>
      </div>

      <!-- Selector de comunidad -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Comunidad</span>
        </label>
        <SvelteSelect
          items={comunidades}
          loadOptions={searchByNombre}
          bind:value={selectedComunidad}
          hideEmptyState={true}
          debounceWait={500}
          placeholder={loadingComunidades ? 'Cargando comunidades…' : 'Busca una comunidad'}
          clearable={true}
          searchable={true}
          inputStyles="color: var(--text-primary);"
          containerStyles="border-color: var(--text-primary);"
        />
        <div class="label">
          <span class="label-text-alt">Relaciona la propuesta con una comunidad</span>
        </div>
      </div>

      <ActividadesForm bind:actividades />

      {#if saveError}
        <div role="alert" class="alert alert-error" aria-live="polite">
          <span>{saveError}</span>
        </div>
      {/if}

      <div class="flex items-center justify-end gap-2">
        <a class="btn btn-ghost" href={`/propuestas/${propuestaId}`} onclick={goto} type="button">Cancelar</a>
        <button class="btn btn-primary text-white" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>

    <p class="mt-4"><a href="/propuestas" onclick={goto} class="link">Volver a la lista</a></p>
  {/if}
</section>
