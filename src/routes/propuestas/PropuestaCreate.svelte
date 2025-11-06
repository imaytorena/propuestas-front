<script lang="ts">
    import page from 'page'
    import {goto} from '../../utils/nav'
    import api from '../../utils/api'
    import ActividadesForm from '../../lib/components/Actividades/ActividadesForm.svelte'
    import SvelteSelect from 'svelte-select'
    import '../../lib/components/Ideas/select.css'

    type ComunidadValue = { nombre: string; municipio?: string; lat?: number; lon?: number; lng?: number }
    type ComunidadOption = { id: number; label: string; value: ComunidadValue }

    let title: string = $state('')
    let descripcion: string = $state('')
    let actividades: Array<{ nombre: string, descripcion: string, fecha: string, horario?: string }> = $state([])
    let saving = $state(false)
    let saveError: string | null = $state(null)

    // Selector de comunidad (similar a IdeasCrear)
    let selectedComunidad: ComunidadOption | null = $state(null)
    let comunidades: ComunidadOption[] = $state([])
    let loadingComunidades: boolean = $state(false)

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

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]

    async function create(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        event.preventDefault()
        saveError = null
        if (!title.trim()) {
            saveError = 'El título es obligatorio';
            return
        }
        if (!selectedComunidad?.id) {
            saveError = 'Selecciona una comunidad';
            return
        }
        if (actividades.length === 0) {
            saveError = 'Debe agregar al menos una actividad';
            return
        }
        // Validar cada actividad: nombre, descripcion, fecha obligatoria y no menor a hoy; hora opcional válida
        for (const act of actividades) {
            if (!act.nombre?.trim() || !act.descripcion?.trim()) {
                saveError = 'Todas las actividades deben tener nombre y descripción';
                return
            }
            if (!act.fecha) {
                saveError = 'Cada actividad debe tener fecha';
                return
            }
            if (new Date(act.fecha) < new Date(today)) {
                saveError = 'La fecha de la actividad no puede ser anterior a hoy';
                return
            }
            if (!isHoraValida(act.horario)) {
                saveError = 'La hora debe estar entre 7:00 y 22:00 si se especifica';
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
            const {data} = await api.post(`/propuestas`, payload)
            const id = data?.id ?? data?.data?.id
            page.show(id ? `/propuestas/${id}` : '/propuestas')
        } catch (e: any) {
            saveError = e?.message ?? 'No se pudo crear la propuesta'
        } finally {
            saving = false
        }
    }
</script>

<section aria-labelledby="create-propuesta-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
    <header class="mb-4 flex items-center justify-between gap-3">
        <h1 id="create-propuesta-heading" class="text-2xl font-semibold tracking-tight">Nueva propuesta</h1>
        <a class="btn btn-ghost btn-sm" href="/propuestas" onclick={goto}>Cancelar</a>
    </header>

    <form class="space-y-4" onsubmit={create}>
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
                <span class="label-text-alt">Relaciona tu propuesta con una comunidad</span>
            </div>
        </div>

        <!-- Actividades con fecha (obligatoria) y hora (opcional) -->
        <ActividadesForm bind:actividades/>

        {#if saveError}
            <div role="alert" class="alert alert-error" aria-live="polite">
                <span>{saveError}</span>
            </div>
        {/if}

        <div class="flex items-center justify-end gap-2">
            <a class="btn btn-ghost" href="/propuestas" onclick={goto} type="button">Cancelar</a>
            <button class="btn btn-primary text-white" type="submit" disabled={saving}>
                {saving ? 'Creando…' : 'Crear'}
            </button>
        </div>
    </form>
</section>
