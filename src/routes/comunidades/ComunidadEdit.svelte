<script lang="ts">
  import { onMount } from 'svelte'
  import page from 'page'
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'

  let comunidadId: string = ''
  $: comunidadId = $route.params.comunidadId

  // Form state
  let nombre: string = ''
  let descripcion: string = ''
  let loading = true
  let saving = false
  let error: string | null = null
  let saveError: string | null = null
  let loaded = false

  async function loadComunidad() {
    if (!comunidadId) return
    loading = true
    error = null
    try {
      const { data: comunidad } = await api.get(`/comunidades/${comunidadId}`)
      nombre = comunidad?.nombre ?? ''
      descripcion = comunidad?.descripcion ?? ''
      loaded = true
    } catch (e: any) {
      error = e?.message ?? 'Error cargando comunidad'
    } finally {
      loading = false
    }
  }

  async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    event.preventDefault()
    if (!comunidadId) return
    saveError = null
    if (!nombre.trim()) {
      saveError = 'El nombre es obligatorio'
      return
    }
    saving = true
    try {
      await api.put(`/comunidades/${comunidadId}`, { nombre, descripcion })
      page.show(`/comunidades/${comunidadId}`)
    } catch (e: any) {
      saveError = e?.message ?? 'No se pudo guardar'
    } finally {
      saving = false
    }
  }

  onMount(loadComunidad)
</script>

<section aria-labelledby="edit-comunidad-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
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
        <button class="btn btn-sm" onclick={loadComunidad}>Reintentar</button>
      </div>
    </div>
  {:else if !loaded}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Comunidad no encontrada.</p>
      <a class="btn" href="/comunidades" onclick={goto}>Volver a la lista</a>
    </div>
  {:else}
    <header class="mb-4 flex items-center justify-between gap-3">
      <h1 id="edit-comunidad-heading" class="text-2xl font-semibold tracking-tight">Editar comunidad {comunidadId}</h1>
      <a class="btn btn-ghost btn-sm" href={`/comunidades/${comunidadId}`} onclick={goto}>Cancelar</a>
    </header>

    <form class="space-y-4" onsubmit={save}>
      <div class="form-control">
        <label class="label" for="nombre">
          <span class="label-text">Nombre</span>
        </label>
        <input
          id="nombre"
          class="input input-bordered w-full"
          type="text"
          bind:value={nombre}
          placeholder="Nombre de la comunidad"
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
          placeholder="Describe la comunidad"
          disabled={saving}
        ></textarea>
        <div class="label">
          <span class="label-text-alt">Puedes usar texto libre.</span>
        </div>
      </div>

      {#if saveError}
        <div role="alert" class="alert alert-error" aria-live="polite">
          <span>{saveError}</span>
        </div>
      {/if}

      <div class="flex items-center justify-end gap-2">
        <a class="btn btn-ghost" href={`/comunidades/${comunidadId}`} onclick={goto} type="button">Cancelar</a>
        <button class="btn btn-primary text-white" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>

    <p class="mt-4"><a href="/comunidades" onclick={goto} class="link">Volver a la lista</a></p>
  {/if}
</section>
