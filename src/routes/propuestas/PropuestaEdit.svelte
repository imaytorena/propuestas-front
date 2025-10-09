<script lang="ts">
  import { onMount } from 'svelte'
  import page from 'page'
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'
  import ActividadesForm from '../../lib/components/Actividades/ActividadesForm.svelte'

  let propuestaId: string = ''
  $: propuestaId = $route.params.propuestaId

  let title: string = ''
  let descripcion: string = ''
  let actividades: Array<{nombre: string, descripcion: string}> = []
  let loading = true
  let saving = false
  let error: string | null = null
  let saveError: string | null = null
  let loaded = false

  async function loadPropuesta() {
    if (!propuestaId) return
    loading = true
    error = null
    try {
      const { data: p } = await api.get(`/propuestas/${propuestaId}`)
      title = p?.title ?? p?.titulo ?? ''
      descripcion = p?.description ?? p?.descripcion ?? ''
      actividades = p?.actividades ?? []
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
    if (actividades.length === 0) {
      saveError = 'Debe agregar al menos una actividad'
      return
    }
    if (actividades.some(act => !act.nombre.trim() || !act.descripcion.trim())) {
      saveError = 'Todas las actividades deben tener nombre y descripción'
      return
    }
    saving = true
    try {
      await api.put(`/propuestas/${propuestaId}`, { title, description: descripcion, actividades })
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
