<script lang="ts">
  import { onMount } from 'svelte'
  import page from 'page'
  import { route } from '../../router'
  import { goto } from '../../utils/nav'
  import api from '../../utils/api'

  let ideaId: string = ''
  $: ideaId = $route.params.ideaId

  // Form state
  let titulo: string = ''
  let contenido: string = ''
  let loading = true
  let saving = false
  let error: string | null = null
  let saveError: string | null = null
  let loaded = false

  async function loadIdea() {
    if (!ideaId) return
    loading = true
    error = null
    try {
      const { data: idea } = await api.get(`/ideas/${ideaId}`)
      titulo = idea?.titulo ?? ''
      contenido = idea?.contenido ?? idea?.description ?? ''
      loaded = true
    } catch (e: any) {
      error = e?.message ?? 'Error cargando idea'
    } finally {
      loading = false
    }
  }

  async function save(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
    event.preventDefault()
    if (!ideaId) return
    saveError = null
    if (!titulo.trim()) {
      saveError = 'El título es obligatorio'
      return
    }
    saving = true
    try {
      await api.put(`/ideas/${ideaId}`, { titulo, contenido })
      // Volver al detalle (SPA)
      page.show(`/ideas/${ideaId}`)
    } catch (e: any) {
      saveError = e?.message ?? 'No se pudo guardar'
    } finally {
      saving = false
    }
  }

  onMount(loadIdea)
</script>

<section aria-labelledby="edit-idea-heading" class="mx-auto max-w-3xl px-4 py-4 sm:py-6">
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
        <button class="btn btn-sm" onclick={loadIdea}>Reintentar</button>
      </div>
    </div>
  {:else if !loaded}
    <div class="rounded-box border border-base-300 p-8 text-center">
      <p class="mb-2 text-lg">Idea no encontrada.</p>
      <a class="btn" href="/ideas" onclick={goto}>Volver a la lista</a>
    </div>
  {:else}
    <header class="mb-4 flex items-center justify-between gap-3">
      <h1 id="edit-idea-heading" class="text-2xl font-semibold tracking-tight">Editar idea {ideaId}</h1>
      <a class="btn btn-ghost btn-sm" href={`/ideas/${ideaId}`} onclick={goto}>Cancelar</a>
    </header>

    <form class="space-y-4" onsubmit={save}>
      <div class="form-control">
        <label class="label" for="titulo">
          <span class="label-text">Título</span>
        </label>
        <input
          id="titulo"
          class="input input-bordered w-full"
          type="text"
          bind:value={titulo}
          placeholder="Título"
          required
          disabled={saving}
        />
      </div>

      <div class="form-control">
        <label class="label" for="contenido">
          <span class="label-text">Contenido</span>
        </label>
        <textarea
          id="contenido"
          class="textarea textarea-bordered w-full"
          rows="6"
          bind:value={contenido}
          placeholder="Describe tu idea"
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
        <a class="btn btn-ghost" href={`/ideas/${ideaId}`} onclick={goto} type="button">Cancelar</a>
        <button class="btn btn-primary text-white" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>

    <p class="mt-4"><a href="/ideas" onclick={goto} class="link">Volver a la lista</a></p>
  {/if}
</section>
